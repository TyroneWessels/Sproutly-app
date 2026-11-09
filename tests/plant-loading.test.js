const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const source = fs.readFileSync(path.join(__dirname, "..", "plant.js"), "utf8");
const instances = fs.readFileSync(path.join(__dirname, "..", "plant-instances.js"), "utf8");
const care = fs.readFileSync(path.join(__dirname, "..", "care-schedule.js"), "utf8");

async function loadPage(account, storedPlants, storedProfiles) {
  const elements = new Map();
  function element(selector) {
    if (!elements.has(selector)) {
      elements.set(selector, {
        hidden: false, disabled: ["#add-plant", "#profile-fields", "#log-fields"].includes(selector), value: "", checked: false, textContent: "", files: [],
        handlers: {}, addEventListener(type, handler) { this.handlers[type] = handler; },
        replaceChildren() {}, append() {}, removeAttribute() {}, setAttribute() {}, scrollIntoView() {}, focus() {}
      });
    }
    return elements.get(selector);
  }
  const storage = new Map();
  if (storedPlants !== undefined) storage.set("sproutly-plants", storedPlants);
  if (storedProfiles !== undefined) storage.set("sproutly-profiles", storedProfiles);
  const document = { querySelector: element, createElement: () => element(Symbol()), title: "" };
  const plant = { name: "Monstera", category: "Binnenplant", scientific: "Monstera deliciosa", type: "Kamerplant", light: "Indirect licht", difficulty: "easy", soilCheckDays: 7, image: "plant.jpg", imageSource: "bron" };
  const context = {
    document, location: { search: "?naam=Monstera" }, history: { replaceState() {} },
    URLSearchParams, Date, JSON, Object, Array, String, Uint8Array, crypto: webcrypto,
    window: { SPROUTLY_PLANTS: [plant], SPROUTLY_DEFAULT_SAVED_PLANTS: [], handlePlantImageError() {}, SproutlyAccount: account },
    localStorage: {
      getItem: (key) => storage.has(key) ? storage.get(key) : null,
      setItem: (key, value) => storage.set(key, value)
    },
    console: { error() {} }
  };
  vm.runInNewContext(instances, context);
  vm.runInNewContext(care, context);
  vm.runInNewContext(source, context);
  await new Promise((resolve) => setImmediate(resolve));
  return { element, storage };
}

test("signed-out visitor can save plants locally", async () => {
  const { element, storage } = await loadPage({ getUser: async () => null });
  assert.equal(element("#add-plant").disabled, false);
  assert.match(element("#plant-status").textContent, /op deze browser bewaard/);
  await element("#add-plant").handlers.click();
  const [id] = JSON.parse(storage.get("sproutly-plants"));
  assert.match(id, /^plant-[a-f0-9]{32}$/);
  assert.equal(JSON.parse(storage.get("sproutly-profiles"))[id].species, "Monstera");
  await element("#add-plant").handlers.click();
  const ids = JSON.parse(storage.get("sproutly-plants"));
  assert.equal(ids.length, 2);
  assert.notEqual(ids[0], ids[1]);
});

test("account server error does not enable editing", async () => {
  const { element } = await loadPage({ getUser: async () => { throw new Error("offline"); } });
  assert.equal(element("#add-plant").disabled, true);
  assert.match(element("#plant-status").textContent, /accountgegevens konden niet/);
});

test("invalid local data is reported without replacing it", async () => {
  const { element, storage } = await loadPage({ getUser: async () => null }, "invalid json");
  assert.equal(element("#add-plant").disabled, true);
  assert.equal(storage.get("sproutly-plants"), "invalid json");
  assert.match(element("#plant-status").textContent, /deze browser konden niet worden gelezen/);
});

test("saved profiles show an overview and can be edited without losing other data", async () => {
  const profiles = { Monstera: { customName: "Monty", location: "Keuken", date: "2026-01-03", notes: "Bij het raam", favorite: true, careLog: [{ id: "1", date: "2026-01-01", action: "Water gegeven", notes: "" }] } };
  const { element, storage } = await loadPage({ getUser: async () => null }, '["Monstera"]', JSON.stringify(profiles));
  assert.equal(element("#detail-profile-form").hidden, true);
  assert.equal(element("#profile-summary").hidden, false);
  assert.equal(element("#summary-name").textContent, "Monty");
  assert.equal(element("#summary-date").textContent, "3-1-2026");
  assert.equal(element("#detail-name").value, "");
  element("#edit-profile").handlers.click();
  assert.equal(element("#detail-profile-form").hidden, false);
  assert.equal(element("#detail-name").value, "Monty");
  element("#detail-name").value = "Nieuwe naam";
  await element("#detail-profile-form").handlers.submit({ preventDefault() {} });
  assert.equal(element("#detail-profile-form").hidden, true);
  assert.equal(element("#detail-name").value, "");
  assert.equal(element("#summary-name").textContent, "Nieuwe naam");
  const saved = JSON.parse(storage.get("sproutly-profiles")).Monstera;
  assert.equal(saved.location, "Keuken");
  assert.equal(saved.careLog[0].action, "Water gegeven");
  element("#edit-profile").handlers.click();
  assert.equal(element("#detail-name").value, "Nieuwe naam");
});

test("failed account save leaves the form open with entered values", async () => {
  const state = { savedPlants: ["Monstera"], plantProfiles: { Monstera: { customName: "Oud" } }, completedTasks: [], careOverrides: {} };
  const account = { getUser: async () => ({ id: "user" }), getState: async () => structuredClone(state), saveState: async () => { throw new Error("offline"); } };
  const { element } = await loadPage(account);
  element("#edit-profile").handlers.click();
  element("#detail-name").value = "Nieuw";
  await element("#detail-profile-form").handlers.submit({ preventDefault() {} });
  assert.equal(element("#detail-profile-form").hidden, false);
  assert.equal(element("#detail-name").value, "Nieuw");
  assert.match(element("#plant-status").textContent, /offline/);
});

test("failed addition preserves the current unsaved profile form", async () => {
  const state = { savedPlants: ["Monstera"], plantProfiles: { Monstera: { customName: "Oud" } }, completedTasks: [], careOverrides: {} };
  const account = { getUser: async () => ({ id: "user" }), getState: async () => structuredClone(state), saveState: async () => { throw new Error("offline"); } };
  const { element } = await loadPage(account);
  element("#edit-profile").handlers.click();
  element("#detail-name").value = "Nog niet opgeslagen";
  await element("#add-plant").handlers.click();
  assert.equal(element("#detail-profile-form").hidden, false);
  assert.equal(element("#detail-name").value, "Nog niet opgeslagen");
  assert.match(element("#plant-status").textContent, /offline/);
});
