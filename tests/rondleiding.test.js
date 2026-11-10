const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "rondleiding.js"), "utf8");

function setup(href = "https://example.test/project/") {
  const document = { activeElement: null, baseURI: "https://example.test/project/" };
  const elements = new Map();
  function element(id) {
    const item = {
      hidden: id === "tour-modal", disabled: false, textContent: "", handlers: {},
      addEventListener(event, callback) { this.handlers[event] = callback; },
      focus() { document.activeElement = this; },
      setAttribute(name, value) { this[name] = value; }
    };
    elements.set(`#${id}`, item);
    return item;
  }
  const home = new URL(href).pathname === "/project/";
  const ids = ["tour-modal", "tour-close", "tour-skip", "tour-back", "tour-next", "tour-title", "tour-description", "tour-progress"];
  if (home) {
    element("tour-start");
    for (const id of ids) element(id);
  }
  document.createElement = () => ({
    addEventListener(event, callback) { this.handlers[event] = callback; },
    handlers: {}
  });
  document.body = { appendChild(modal) {
    elements.set("#tour-modal", modal);
    for (const id of ids.slice(1)) element(id);
  } };
  const heading = element("heading");
  document.querySelector = (selector) => selector === "main h1" ? heading : elements.get(selector) || null;
  let destination;
  const location = { href, assign(url) { destination = url; } };
  const history = { state: null, replaceState(state, unused, url) { location.href = url; } };
  vm.runInNewContext(source, { document, window: { location, history }, URL });
  return { get: (name) => elements.get(`#tour-${name}`), document, location, heading, destination: () => destination };
}

test("rondleiding bezoekt de juiste pagina's en vorige gaat terug", () => {
  let page = setup();
  page.get("start").handlers.click();
  assert.equal(page.get("title").textContent, "Welkom bij Growify");
  assert.equal(page.get("back").hidden, true);

  const expected = [
    ["/project/planten/", "Zoek een plant"],
    ["/project/plant/", "Bekijk en voeg een plant toe"],
    ["/project/mijn-planten/", "Bekijk jouw planten"],
    ["/project/kalender/", "Bekijk de verzorgingskalender"]
  ];
  for (const [pathname, title] of expected) {
    page.get("next").handlers.click();
    const url = new URL(page.destination());
    assert.equal(url.pathname, pathname);
    if (pathname === "/project/plant/") assert.equal(url.searchParams.get("naam"), "Monstera");
    page = setup(url.href);
    assert.equal(page.get("modal").hidden, false);
    assert.equal(page.get("title").textContent, title);
    assert.equal(new URL(page.location.href).searchParams.has("rondleiding"), false);
  }
  assert.equal(page.get("next").textContent, "Afronden");
  page.get("back").handlers.click();
  assert.equal(new URL(page.destination()).pathname, "/project/mijn-planten/");
  page.get("next").handlers.click();
  assert.equal(page.get("modal").hidden, true);
  assert.equal(page.document.activeElement, page.heading);
});

test("rondleiding sluit met Escape, bewaakt focus en kan opnieuw starten", () => {
  const page = setup();
  page.get("start").handlers.click();
  let prevented = false;
  page.get("modal").handlers.keydown({ key: "Tab", shiftKey: true, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(page.document.activeElement, page.get("skip"));
  page.get("modal").handlers.keydown({ key: "Escape", preventDefault() {} });
  assert.equal(page.get("modal").hidden, true);
  assert.equal(page.document.activeElement, page.get("start"));
  page.get("start").handlers.click();
  assert.equal(page.get("progress").textContent, "Stap 1 van 5");
  page.get("skip").handlers.click();
  assert.equal(page.get("modal").hidden, true);
});

test("ongeldige stap of verkeerde pagina opent de rondleiding niet", () => {
  for (const url of [
    "https://example.test/project/planten/?rondleiding=4",
    "https://example.test/project/planten/?rondleiding=wat",
    "https://example.test/project/plant/?naam=Basilicum&rondleiding=2"
  ]) {
    const page = setup(url);
    assert.equal(page.get("modal").hidden, true);
    assert.equal(new URL(page.location.href).searchParams.has("rondleiding"), false);
  }
});
