const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "plant-care-info.js"), "utf8"), context);
const careInfo = context.window.SPROUTLY_CARE_INFO;

test("curated care details have a source and verification date", () => {
  assert.equal(Object.keys(careInfo).length, 8);
  for (const [name, details] of Object.entries(careInfo)) {
    assert.ok(details.soil, `${name} soil`);
    assert.ok(details.petSafe, `${name} pet safety`);
    assert.ok(details.sourceLabel, `${name} source label`);
    assert.match(details.sourceUrl, /^https:\/\/www\.rhs\.org\.uk\//, `${name} source URL`);
    assert.equal(details.lastVerified, "5 november 2026");
  }
});
