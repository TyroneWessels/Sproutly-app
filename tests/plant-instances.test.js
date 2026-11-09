const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const source = fs.readFileSync(path.join(__dirname, "..", "plant-instances.js"), "utf8");

function setup() {
  const storage = new Map();
  let failingKey = "";
  const localStorage = {
    getItem: (key) => storage.has(key) ? storage.get(key) : null,
    setItem(key, value) {
      if (key === failingKey) {
        failingKey = "";
        throw new Error("storage full");
      }
      storage.set(key, value);
    },
    removeItem: (key) => storage.delete(key)
  };
  const context = { window: {}, crypto: webcrypto, Uint8Array, localStorage, console };
  vm.runInNewContext(source, context);
  return { plants: context.window.SproutlyPlants, storage, fail: (key) => { failingKey = key; } };
}

test("legacy plants and new specimens retain separate identities", () => {
  const { plants } = setup();
  const profiles = { Monstera: { customName: "Oude Monty", careLog: [{ action: "Water gegeven" }] } };
  const first = plants.create("Monstera", profiles);
  const second = plants.create("Monstera", profiles);
  assert.equal(plants.label(first, ["Monstera", first, second], profiles), "Monstera 2");
  assert.equal(plants.label(second, ["Monstera", first, second], profiles), "Monstera 3");
  profiles[first].customName = "Binnen";
  profiles[second].customName = "Buiten";
  assert.notEqual(first, second);
  assert.equal(plants.species("Monstera", profiles), "Monstera");
  assert.equal(plants.species(first, profiles), "Monstera");
  assert.equal(profiles.Monstera.careLog[0].action, "Water gegeven");
  assert.equal(profiles[first].customName, "Binnen");
  assert.equal(profiles[second].customName, "Buiten");
  assert.match(plants.url("Monstera", second), new RegExp(`id=${second}$`));
});

test("a failed browser write restores all original plant data", () => {
  const { plants, storage, fail } = setup();
  storage.set("sproutly-plants", '["Monstera"]');
  storage.set("sproutly-profiles", '{"Monstera":{"customName":"Oud"}}');
  fail("sproutly-profiles");
  assert.throws(() => plants.writeLocal({
    "sproutly-plants": ["Monstera", "new"],
    "sproutly-profiles": { Monstera: {}, new: { species: "Monstera" } }
  }), /storage full/);
  assert.equal(storage.get("sproutly-plants"), '["Monstera"]');
  assert.equal(storage.get("sproutly-profiles"), '{"Monstera":{"customName":"Oud"}}');
});
