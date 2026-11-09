const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const pageSource = fs.readFileSync(path.join(__dirname, "..", "pagina.js"), "utf8");
const instancesSource = fs.readFileSync(path.join(__dirname, "..", "plant-instances.js"), "utf8");

async function loadPage(profiles, saved = ["one", "two"], accountState = null) {
  const elements = new Map();
  for (const id of ["#nav-count", "#saved-plants-grid", "#saved-empty", "#favorites-filter", "#favorites-empty", "#show-all-plants"]) {
    elements.set(id, {
      hidden: true, checked: false, innerHTML: "", textContent: "", handlers: {},
      addEventListener(type, handler) { this.handlers[type] = handler; },
      querySelectorAll() { return []; },
      focus() { this.focused = true; }
    });
  }
  const storage = new Map([
    ["sproutly-plants", JSON.stringify(saved)],
    ["sproutly-profiles", JSON.stringify(profiles)]
  ]);
  const plant = { name: "Monstera", category: "Binnenplant", scientific: "Monstera deliciosa", art: "art-monstera", light: "Licht", difficulty: "easy", image: "plant.jpg", imageSource: "bron" };
  const context = {
    window: {
      SPROUTLY_PLANTS: [plant], SPROUTLY_DEFAULT_SAVED_PLANTS: [],
      SproutlyAccount: {
        async getUser() { return accountState ? { id: "user" } : null; },
        async getState() { return accountState; }
      }
    },
    document: { querySelector: (id) => elements.get(id) || null, querySelectorAll: () => [] },
    localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
    console, structuredClone, setTimeout, clearTimeout
  };
  vm.runInNewContext(instancesSource, context);
  vm.runInNewContext(pageSource, context);
  await new Promise((resolve) => setImmediate(resolve));
  return elements;
}

test("filter selects favorite specimens and can be turned off", async () => {
  const elements = await loadPage({
    one: { species: "Monstera", customName: "Binnen", favorite: true },
    two: { species: "Monstera", customName: "Buiten", favorite: false }
  });
  const grid = elements.get("#saved-plants-grid");
  const filter = elements.get("#favorites-filter");
  assert.match(grid.innerHTML, /Binnen/);
  assert.match(grid.innerHTML, /Buiten/);
  filter.checked = true;
  filter.handlers.change();
  assert.match(grid.innerHTML, /Binnen/);
  assert.doesNotMatch(grid.innerHTML, /Buiten/);
  assert.equal(elements.get("#nav-count").textContent, "2");
  filter.checked = false;
  filter.handlers.change();
  assert.match(grid.innerHTML, /Buiten/);
});

test("empty favorite filter offers a way back without showing an empty collection", async () => {
  const elements = await loadPage({ one: { species: "Monstera" } }, ["one"]);
  const filter = elements.get("#favorites-filter");
  filter.checked = true;
  filter.handlers.change();
  assert.equal(elements.get("#favorites-empty").hidden, false);
  assert.equal(elements.get("#saved-empty").hidden, true);
  elements.get("#show-all-plants").handlers.click();
  assert.equal(filter.checked, false);
  assert.equal(filter.focused, true);
  assert.equal(elements.get("#favorites-empty").hidden, true);
});

test("filter uses loaded account profiles instead of local profiles", async () => {
  const accountState = {
    savedPlants: ["two"], plantProfiles: { two: { species: "Monstera", customName: "Accountplant", favorite: true } },
    completedTasks: [], careOverrides: {}
  };
  const elements = await loadPage({ one: { species: "Monstera", customName: "Lokaal" } }, ["one"], accountState);
  const filter = elements.get("#favorites-filter");
  filter.checked = true;
  filter.handlers.change();
  assert.match(elements.get("#saved-plants-grid").innerHTML, /Accountplant/);
  assert.doesNotMatch(elements.get("#saved-plants-grid").innerHTML, /Lokaal/);
});
