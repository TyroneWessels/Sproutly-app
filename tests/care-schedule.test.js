const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const root = path.join(__dirname, "..");
const context = {
  window: { SPROUTLY_PLANTS: [
    { name: "Monstera", soilCheckDays: 7 },
    { name: "Varen", soilCheckDays: 4 }
  ] },
  crypto: webcrypto, Uint8Array
};
for (const file of ["plant-instances.js", "care-schedule.js"]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), context);
}
const care = context.window.SproutlyCare;
const today = new Date(2026, 10, 9);
const entry = (date, action) => ({ id: `${date}-${action}`, date, action, notes: "" });

test("latest applicable activity schedules each plant independently", () => {
  const profiles = {
    first: { species: "Monstera", customName: "Eerste", careLog: [
      entry("2026-11-02", "Water gegeven"), entry("2026-11-08", "Aarde gecontroleerd"),
      entry("2026-11-04", "Voeding gegeven"), entry("2026-11-06", "Verpot"),
      entry("2026-11-09", "Gesnoeid"), entry("2026-11-15", "Water gegeven")
    ] },
    second: { species: "Monstera", customName: "Tweede", careLog: [entry("2026-11-05", "Water gegeven")] }
  };
  const events = care.events(["first", "second"], profiles, {}, today);
  const find = (id, type) => events.find((item) => item.plantId === id && item.type === type);
  assert.equal(find("first", "watering").dueDate, "2026-11-15");
  assert.equal(find("first", "fertilizing").dueDate, "2026-12-02");
  assert.equal(find("first", "repotting").dueDate, "2027-11-06");
  assert.equal(find("second", "watering").dueDate, "2026-11-12");
  assert.equal(find("second", "fertilizing"), undefined);
  profiles.first.careLog = profiles.first.careLog.filter((item) => item.action !== "Aarde gecontroleerd");
  assert.equal(care.events(["first"], profiles, {}, today).find((item) => item.type === "watering").dueDate, "2026-11-09");
});

test("unknown and overdue dates, postponement, and unsupported actions", () => {
  const profiles = { Varen: { careLog: [entry("2026-10-01", "Water gegeven"), entry("2026-11-05", "Voeding gegeven")] } };
  const event = care.events(["Varen"], profiles, {}, today)[0];
  assert.equal(event.dueDate, "2026-10-05");
  assert.equal(event.date, "2026-11-09");
  assert.equal(event.overdue, true);
  assert.equal(care.events(["Varen"], profiles, {}, today).length, 1);
  const moved = care.events(["Varen"], profiles, { [event.taskId]: "2026-11-16" }, today)[0];
  assert.equal(moved.date, "2026-11-16");
  const fresh = care.events(["Monstera"], {}, {}, today)[0];
  assert.equal(fresh.unplanned, true);
  assert.equal(care.events(["Monstera"], {}, { [fresh.taskId]: "2026-11-16" }, new Date(2026, 10, 10))[0].date, "2026-11-16");
});

test("recording a calendar action uses today and recalculates; full logs fail", () => {
  const profiles = { Monstera: { careLog: [entry("2026-11-01", "Water gegeven")] } };
  const event = care.events(["Monstera"], profiles, {}, today)[0];
  care.record(profiles, event, today);
  assert.equal(profiles.Monstera.careLog[0].action, "Aarde gecontroleerd");
  assert.equal(profiles.Monstera.careLog[0].date, "2026-11-09");
  assert.equal(care.events(["Monstera"], profiles, {}, today)[0].dueDate, "2026-11-16");
  profiles.Monstera.careLog = Array(200).fill(entry("2026-11-01", "Water gegeven"));
  assert.throws(() => care.record(profiles, event, today), /logboek is vol/);
});

test("rejects invalid calendar dates and handles year transition", () => {
  assert.equal(care.parseDate("2026-02-30"), null);
  const profiles = { Monstera: { careLog: [entry("2026-12-29", "Water gegeven")] } };
  assert.equal(care.events(["Monstera"], profiles, {}, new Date(2026, 11, 30))[0].dueDate, "2027-01-05");
});
