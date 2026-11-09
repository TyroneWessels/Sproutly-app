const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const { URL } = require("node:url");

const rootDirectory = __dirname;
const dataDirectory = path.join(rootDirectory, "data");
const databasePath = path.join(dataDirectory, "sproutly.json");
const databaseBackupPath = path.join(dataDirectory, "sproutly.json.bak");
const port = Number(process.env.PORT) || 3000;
const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000;
const maxBodyBytes = 2 * 1024 * 1024;
const failedAuthAttempts = new Map();
const authRateLimitWindowMs = 15 * 60 * 1000;
const authRateLimitMaxAttempts = 10;

const emptyState = () => ({
  savedPlants: [],
  plantProfiles: {},
  completedTasks: [],
  careOverrides: {}
});

async function ensureDatabase() {
  await fs.mkdir(dataDirectory, { recursive: true });
  try {
    await fs.access(databasePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await writeDatabase({ users: [], sessions: [] });
  }
}

async function readDatabase() {
  const contents = await fs.readFile(databasePath, "utf8");
  const database = JSON.parse(contents);
  database.users = Array.isArray(database.users) ? database.users : [];
  database.sessions = Array.isArray(database.sessions) ? database.sessions : [];
  return database;
}

async function writeDatabase(database) {
  try {
    await fs.copyFile(databasePath, databaseBackupPath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await fs.writeFile(databasePath, `${JSON.stringify(database, null, 2)}\n`, "utf8");
}

function sendJson(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
  response.end(JSON.stringify(payload));
}

function sendError(response, statusCode, message) {
  sendJson(response, statusCode, { error: message });
}

function parseCookies(request) {
  const cookies = {};
  for (const part of (request.headers.cookie || "").split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    const name = part.slice(0, separator).trim();
    cookies[name] = decodeURIComponent(part.slice(separator + 1).trim());
  }
  return cookies;
}

function createSessionCookie(token, maxAge = Math.floor(sessionLifetimeMs / 1000)) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `sproutly_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function passwordsMatch(password, user) {
  const actual = Buffer.from(hashPassword(password, user.passwordSalt), "hex");
  const expected = Buffer.from(user.passwordHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function publicUser(user) {
  return { id: user.id, email: user.email, displayName: user.displayName };
}

function validateCredentials(body, requireDisplayName) {
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Vul een geldig e-mailadres in.");
  if (password.length < 8 || password.length > 128) throw new Error("Je wachtwoord moet 8 tot 128 tekens bevatten.");
  if (requireDisplayName && (displayName.length < 1 || displayName.length > 60)) throw new Error("Vul een naam van maximaal 60 tekens in.");
  return { email, password, displayName };
}

function getClientAddress(request) {
  return request.socket.remoteAddress || "unknown";
}

function checkAuthRateLimit(request) {
  const key = getClientAddress(request);
  const now = Date.now();
  const recentAttempts = (failedAuthAttempts.get(key) || []).filter((timestamp) => now - timestamp < authRateLimitWindowMs);
  if (recentAttempts.length >= authRateLimitMaxAttempts) {
    throw Object.assign(new Error("Te veel inlogpogingen. Probeer het later opnieuw."), { statusCode: 429 });
  }
  failedAuthAttempts.set(key, recentAttempts);
}

function recordFailedAuthAttempt(request) {
  const key = getClientAddress(request);
  const attempts = failedAuthAttempts.get(key) || [];
  attempts.push(Date.now());
  failedAuthAttempts.set(key, attempts);
}

function sanitizeState(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Ongeldige gebruikersdata.");
  const savedPlants = Array.isArray(input.savedPlants)
    ? input.savedPlants.filter((value) => typeof value === "string").slice(0, 100)
    : [];
  const completedTasks = Array.isArray(input.completedTasks)
    ? input.completedTasks.filter((value) => typeof value === "string").slice(0, 1000)
    : [];
  const plantProfiles = {};
  if (input.plantProfiles && typeof input.plantProfiles === "object" && !Array.isArray(input.plantProfiles)) {
    for (const [plantName, profile] of Object.entries(input.plantProfiles).slice(0, 100)) {
      if (!profile || typeof profile !== "object") continue;
      plantProfiles[plantName.slice(0, 80)] = {
        ...(typeof profile.species === "string" ? { species: profile.species.slice(0, 80) } : {}),
        customName: typeof profile.customName === "string" ? profile.customName.slice(0, 40) : "",
        location: typeof profile.location === "string" ? profile.location.slice(0, 60) : "",
        date: typeof profile.date === "string" ? profile.date.slice(0, 10) : "",
        notes: typeof profile.notes === "string" ? profile.notes.slice(0, 240) : "",
        favorite: profile.favorite === true,
        photo: typeof profile.photo === "string" && profile.photo.length < 700000 ? profile.photo : "",
        careLog: Array.isArray(profile.careLog) ? profile.careLog
          .filter((entry) => entry && typeof entry === "object" && typeof entry.id === "string"
            && typeof entry.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(entry.date)
            && typeof entry.action === "string" && entry.action.trim())
          .slice(0, 200)
          .map((entry) => ({
            id: entry.id.slice(0, 80),
            date: entry.date,
            action: entry.action.trim().slice(0, 60),
            notes: typeof entry.notes === "string" ? entry.notes.slice(0, 240) : ""
          })) : []
      };
    }
  }
  const careOverrides = {};
  if (input.careOverrides && typeof input.careOverrides === "object" && !Array.isArray(input.careOverrides)) {
    for (const [taskId, date] of Object.entries(input.careOverrides).slice(0, 1000)) {
      if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        careOverrides[taskId.slice(0, 160)] = date;
      }
    }
  }
  return { savedPlants, plantProfiles, completedTasks, careOverrides };
}

async function readRequestBody(request) {
  let totalBytes = 0;
  const chunks = [];
  for await (const chunk of request) {
    totalBytes += chunk.length;
    if (totalBytes > maxBodyBytes) throw Object.assign(new Error("Verzoek is te groot."), { statusCode: 413 });
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    throw Object.assign(new Error("Ongeldige JSON-data."), { statusCode: 400 });
  }
}

function getUserFromRequest(request, database) {
  const token = parseCookies(request).sproutly_session;
  if (!token) return null;
  const tokenHash = hashToken(token);
  const session = database.sessions.find((item) => item.tokenHash === tokenHash && item.expiresAt > Date.now());
  return session ? database.users.find((user) => user.id === session.userId) || null : null;
}

async function createAuthenticatedSession(response, database, user) {
  const token = crypto.randomBytes(32).toString("hex");
  database.sessions = database.sessions.filter((session) => session.expiresAt > Date.now());
  database.sessions.push({
    tokenHash: hashToken(token),
    userId: user.id,
    expiresAt: Date.now() + sessionLifetimeMs
  });
  await writeDatabase(database);
  return createSessionCookie(token);
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp"
  }[extension] || "application/octet-stream";
}

async function serveStatic(request, response, pathname) {
  const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = path.resolve(rootDirectory, relativePath);
  const relativeToRoot = path.relative(rootDirectory, filePath);
  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    sendError(response, 404, "Niet gevonden.");
    return;
  }
  try {
    const file = await fs.readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentType(filePath),
      "Cache-Control": "no-cache"
    });
    response.end(file);
  } catch (error) {
    if (error.code === "ENOENT") sendError(response, 404, "Niet gevonden.");
    else throw error;
  }
}

async function handleApi(request, response, pathname) {
  const database = await readDatabase();
  const user = getUserFromRequest(request, database);

  if (request.method === "GET" && pathname === "/api/health") {
    sendJson(response, 200, { ok: true });
    return;
  }
  if (request.method === "POST" && pathname === "/api/auth/register") {
    checkAuthRateLimit(request);
    const body = await readRequestBody(request);
    const credentials = validateCredentials(body, true);
    if (database.users.some((item) => item.email === credentials.email)) {
      sendError(response, 409, "Er bestaat al een account met dit e-mailadres.");
      return;
    }
    const passwordSalt = crypto.randomBytes(16).toString("hex");
    const newUser = {
      id: crypto.randomUUID(),
      email: credentials.email,
      displayName: credentials.displayName,
      passwordSalt,
      passwordHash: hashPassword(credentials.password, passwordSalt),
      createdAt: new Date().toISOString(),
      state: emptyState()
    };
    database.users.push(newUser);
    const cookie = await createAuthenticatedSession(response, database, newUser);
    sendJson(response, 201, { user: publicUser(newUser) }, { "Set-Cookie": cookie });
    return;
  }
  if (request.method === "POST" && pathname === "/api/auth/login") {
    checkAuthRateLimit(request);
    const body = await readRequestBody(request);
    const credentials = validateCredentials(body, false);
    const existingUser = database.users.find((item) => item.email === credentials.email);
    if (!existingUser || !passwordsMatch(credentials.password, existingUser)) {
      recordFailedAuthAttempt(request);
      sendError(response, 401, "E-mailadres of wachtwoord klopt niet.");
      return;
    }
    failedAuthAttempts.delete(getClientAddress(request));
    const cookie = await createAuthenticatedSession(response, database, existingUser);
    sendJson(response, 200, { user: publicUser(existingUser) }, { "Set-Cookie": cookie });
    return;
  }
  if (request.method === "POST" && pathname === "/api/auth/logout") {
    const token = parseCookies(request).sproutly_session;
    database.sessions = database.sessions.filter((session) => session.tokenHash !== hashToken(token || ""));
    await writeDatabase(database);
    sendJson(response, 200, { ok: true }, { "Set-Cookie": createSessionCookie("", 0) });
    return;
  }
  if (request.method === "GET" && pathname === "/api/auth/me") {
    sendJson(response, 200, { user: user ? publicUser(user) : null });
    return;
  }
  if (!user) {
    sendError(response, 401, "Log in om je gegevens te beheren.");
    return;
  }
  if (request.method === "GET" && pathname === "/api/me/state") {
    sendJson(response, 200, user.state || emptyState());
    return;
  }
  if (request.method === "PUT" && pathname === "/api/me/state") {
    const body = await readRequestBody(request);
    user.state = sanitizeState(body);
    await writeDatabase(database);
    sendJson(response, 200, user.state);
    return;
  }
  if (request.method === "GET" && pathname === "/api/me/export") {
    sendJson(response, 200, {
      exportedAt: new Date().toISOString(),
      user: publicUser(user),
      state: user.state || emptyState()
    }, { "Content-Disposition": 'attachment; filename="sproutly-export.json"' });
    return;
  }
  if (request.method === "DELETE" && pathname === "/api/me") {
    database.users = database.users.filter((item) => item.id !== user.id);
    database.sessions = database.sessions.filter((session) => session.userId !== user.id);
    await writeDatabase(database);
    sendJson(response, 200, { ok: true }, { "Set-Cookie": createSessionCookie("", 0) });
    return;
  }
  sendError(response, 404, "API-route niet gevonden.");
}

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    if (requestUrl.pathname.startsWith("/api/")) {
      await handleApi(request, response, requestUrl.pathname);
      return;
    }
    await serveStatic(request, response, requestUrl.pathname);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    if (statusCode >= 500) console.error("Serverfout:", error.message);
    sendError(response, statusCode, statusCode === 500 ? "Er ging iets mis op de server." : error.message);
  }
});

ensureDatabase()
  .then(() => server.listen(port, () => {
    console.log(`Sproutly draait op http://localhost:${port}`);
  }))
  .catch((error) => {
    console.error("Database kon niet worden gestart:", error.message);
    process.exitCode = 1;
  });
