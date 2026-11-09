const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "plant.js"), "utf8");

async function loadPage(account, storedPlants) {
  const elements = new Map();
  function element(selector) {
    if (!elements.has(selector)) {
      elements.set(selector, {
        hidden: false, disabled: ["#add-plant", "#profile-fields", "#log-fields"].includes(selector), value: "", checked: false, textContent: "",
        handlers: {}, addEventListener(type, handler) { this.handlers[type] = handler; },
        replaceChildren() {}, append() {}, removeAttribute() {}, setAttribute() {}
      });
    }
    return elements.get(selector);
  }
  const storage = new Map();
  if (storedPlants !== undefined) storage.set("sproutly-plants", storedPlants);
  const document = { querySelector: element, createElement: () => element(Symbol()), title: "" };
  const plant = { name: "Monstera", category: "Binnenplant", scientific: "Monstera deliciosa", type: "Kamerplant", light: "Indirect licht", difficulty: "easy", soilCheckDays: 7, image: "plant.jpg", imageSource: "bron" };
  const context = {
    document, location: { search: "?naam=Monstera" }, URLSearchParams, Date, JSON, Object, Array, String,
    window: { SPROUTLY_PLANTS: [plant], SPROUTLY_DEFAULT_SAVED_PLANTS: [], handlePlantImageError() {}, SproutlyAccount: account },
    localStorage: {
      getItem: (key) => storage.has(key) ? storage.get(key) : null,
      setItem: (key, value) => storage.set(key, value)
    },
    console: { error() {} }
  };
  vm.runInNewContext(source, context);
  await new Promise((resolve) => setImmediate(resolve));
  return { element, storage };
}

test("signed-out visitor can save plants locally", async () => {
  const { element, storage } = await loadPage({ getUser: async () => null });
  assert.equal(element("#add-plant").disabled, false);
  assert.match(element("#plant-status").textContent, /op deze browser bewaard/);
  await element("#add-plant").handlers.click();
  assert.deepEqual(JSON.parse(storage.get("sproutly-plants")), ["Monstera"]);
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
