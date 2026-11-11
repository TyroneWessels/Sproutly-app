const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = { window: {}, structuredClone };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "data-transfer.js"), "utf8"), context);
const transfer = context.window.SproutlyDataTransfer;
const knownSpecies = new Set(["Monstera", "Basilicum"]);
const speciesForId = (id, profiles) => {
  const species = profiles[id]?.species || id;
  return knownSpecies.has(species) ? species : null;
};
const state = (overrides = {}) => ({
  savedPlants: [],
  plantProfiles: {},
  completedTasks: [],
  careOverrides: {},
  ...overrides
});

test("parses a Growify account export and rejects unknown plants", () => {
  const parsed = transfer.parseImport(JSON.stringify({ state: state({ savedPlants: ["Monstera"] }) }), speciesForId);
  assert.deepEqual(Array.from(parsed.savedPlants), ["Monstera"]);
  assert.throws(() => transfer.parseImport(JSON.stringify(state({ savedPlants: ["Unknown"] })), speciesForId), /staat niet in de Growify-catalogus/);
  assert.throws(() => transfer.parseImport("not json", speciesForId), /geldige JSON/);
});

test("rejects malformed schemas, unsafe keys, and invalid custom intervals", () => {
  assert.throws(() => transfer.parseImport(JSON.stringify({ savedPlants: [] }), speciesForId), /plantprofielen moet een object/);
  assert.throws(() => transfer.parseImport('{"savedPlants":[],"plantProfiles":{"__proto__":{}},"completedTasks":[],"careOverrides":{}}', speciesForId), /ongeldige sleutel/);
  assert.throws(() => transfer.parseImport(JSON.stringify(state({
    savedPlants: ["Monstera"],
    plantProfiles: { Monstera: { careIntervals: { watering: 0 } } }
  })), speciesForId), /ongeldig interval/);
});

test("merge adds plants and tasks while preserving existing profiles and combining logs", () => {
  const current = state({
    savedPlants: ["Monstera"],
    plantProfiles: { Monstera: { customName: "Mijn plant", careLog: [{ id: "local", action: "Water gegeven" }] } },
    completedTasks: ["local-task"],
    careOverrides: { "task-local": "2026-11-12" }
  });
  const imported = state({
    savedPlants: ["Monstera", "Basilicum"],
    plantProfiles: {
      Monstera: {
        customName: "Backupnaam",
        location: "Vensterbank",
        careLog: [{ id: "backup", action: "Verpot" }],
        careIntervals: { watering: 9, repotting: 60 }
      },
      Basilicum: { customName: "Basil" }
    },
    completedTasks: ["local-task", "imported-task"],
    careOverrides: { "task-import": "2026-11-15" }
  });
  const result = transfer.merge(current, imported);

  assert.deepEqual(Array.from(result.savedPlants), ["Monstera", "Basilicum"]);
  assert.equal(result.plantProfiles.Monstera.customName, "Mijn plant");
  assert.equal(result.plantProfiles.Monstera.location, "Vensterbank");
  assert.deepEqual(Array.from(result.plantProfiles.Monstera.careLog, (entry) => entry.id), ["local", "backup"]);
  assert.equal(result.plantProfiles.Monstera.careIntervals.watering, 9);
  assert.deepEqual(Array.from(result.completedTasks), ["local-task", "imported-task"]);
  assert.equal(result.careOverrides["task-local"], "2026-11-12");
  assert.equal(result.careOverrides["task-import"], "2026-11-15");
});

test("preview reports new and overlapping plants without changing data", () => {
  const current = state({ savedPlants: ["Monstera"] });
  const imported = state({ savedPlants: ["Monstera", "Basilicum"] });
  assert.deepEqual({ ...transfer.preview(current, imported) }, { addedPlants: 1, existingPlants: 1, importedTasks: 0 });
  assert.deepEqual(Array.from(current.savedPlants), ["Monstera"]);
});
