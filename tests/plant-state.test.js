const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");
const { spawn } = require("node:child_process");

test("plant profile and care log survive an account state round-trip", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "sproutly-plant-test-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.copyFile(path.join(__dirname, "..", "server.js"), path.join(root, "server.js"));
  const listener = net.createServer();
  await new Promise((resolve) => listener.listen(0, "127.0.0.1", resolve));
  const port = listener.address().port;
  await new Promise((resolve, reject) => listener.close((error) => error ? reject(error) : resolve()));
  const server = spawn(process.execPath, [path.join(root, "server.js")], {
    env: { ...process.env, PORT: String(port) }, stdio: ["ignore", "pipe", "pipe"]
  });
  t.after(async () => {
    if (server.exitCode !== null) return;
    const exited = new Promise((resolve) => server.once("exit", resolve));
    server.kill();
    await exited;
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Testserver startte niet.")), 10000);
    server.stdout.once("data", () => { clearTimeout(timer); resolve(); });
    server.once("error", (error) => { clearTimeout(timer); reject(error); });
    server.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Testserver gestopt: ${code}`)); });
  });
  const url = `http://127.0.0.1:${port}`;
  const register = await fetch(`${url}/api/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@example.test", password: "PlantTest-4739!", displayName: "Test" })
  });
  assert.equal(register.status, 201);
  const cookie = register.headers.get("set-cookie").split(";")[0];
  const state = {
    savedPlants: ["Monstera", "plant-second"],
    plantProfiles: { Monstera: {
      customName: "Monty", location: "Woonkamer",
      careLog: [
        { id: "1", date: "2026-11-09", action: "Water gegeven", notes: "Beetje water" },
        { id: "invalid", date: "geen datum", action: "Anders" }
      ]
    }, "plant-second": { species: "Monstera", customName: "Tweede" } },
    completedTasks: ["task-1"], careOverrides: { "task-1": "2026-11-10" }
  };
  const save = await fetch(`${url}/api/me/state`, {
    method: "PUT", headers: { "Content-Type": "application/json", Cookie: cookie }, body: JSON.stringify(state)
  });
  assert.equal(save.status, 200);
  const load = await fetch(`${url}/api/me/state`, { headers: { Cookie: cookie } });
  assert.equal(load.status, 200);
  const stored = await load.json();
  assert.equal(stored.plantProfiles.Monstera.customName, "Monty");
  assert.equal(stored.plantProfiles["plant-second"].species, "Monstera");
  assert.equal(stored.plantProfiles["plant-second"].customName, "Tweede");
  assert.deepEqual(stored.plantProfiles.Monstera.careLog, [
    { id: "1", date: "2026-11-09", action: "Water gegeven", notes: "Beetje water" }
  ]);
  assert.deepEqual(stored.completedTasks, ["task-1"]);
  assert.deepEqual(stored.careOverrides, { "task-1": "2026-11-10" });
});
