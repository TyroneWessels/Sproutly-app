const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function setup() {
  const document = { activeElement: null };
  const elements = new Map();
  for (const id of ["tour-start", "tour-modal", "tour-close", "tour-skip", "tour-back", "tour-next", "tour-title", "tour-description", "tour-progress"]) {
    elements.set(`#${id}`, {
      hidden: id === "tour-modal", disabled: false, textContent: "", handlers: {},
      addEventListener(event, callback) { this.handlers[event] = callback; },
      focus() { document.activeElement = this; }
    });
  }
  document.querySelector = (selector) => elements.get(selector);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "rondleiding.js"), "utf8"), { document });
  return { elements, document };
}

test("rondleiding starts on request, covers three steps and can be reopened", () => {
  const { elements } = setup();
  const get = (id) => elements.get(`#tour-${id}`);
  assert.equal(get("modal").hidden, true);
  get("start").handlers.click();
  assert.equal(get("title").textContent, "Zoek een plant");
  assert.equal(get("back").hidden, true);
  get("next").handlers.click();
  assert.equal(get("title").textContent, "Voeg je plant toe");
  get("next").handlers.click();
  assert.equal(get("title").textContent, "Houd verzorging bij");
  assert.equal(get("next").textContent, "Afronden");
  get("next").handlers.click();
  assert.equal(get("modal").hidden, true);
  get("start").handlers.click();
  assert.equal(get("progress").textContent, "Stap 1 van 3");
  get("skip").handlers.click();
  assert.equal(get("modal").hidden, true);
});

test("rondleiding traps focus and closes with Escape", () => {
  const { elements, document } = setup();
  const get = (id) => elements.get(`#tour-${id}`);
  get("start").handlers.click();
  let prevented = false;
  get("modal").handlers.keydown({ key: "Tab", shiftKey: true, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(document.activeElement, get("skip"));
  get("modal").handlers.keydown({ key: "Escape", preventDefault() {} });
  assert.equal(get("modal").hidden, true);
  assert.equal(document.activeElement, get("start"));
});
