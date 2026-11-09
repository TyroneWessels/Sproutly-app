const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "herstel.js"), "utf8");

function setup(hash = "") {
  const elements = new Map();
  for (const id of ["#recovery-request", "#recovery-update", "#recovery-status", "#recovery-intro", "#recovery-email", "#recovery-password", "#recovery-confirm"]) {
    elements.set(id, {
      hidden: id === "#recovery-update", value: "", textContent: "", handlers: {}, button: { disabled: false },
      addEventListener(type, handler) { this.handlers[type] = handler; },
      querySelector() { return this.button; },
      focus() { this.focused = true; },
      reset() { elements.get("#recovery-password").value = ""; elements.get("#recovery-confirm").value = ""; }
    });
  }
  let recovery;
  const calls = [];
  const account = {
    onPasswordRecovery(callback) { recovery = callback; return { unsubscribe() { calls.push(["unsubscribe"]); } }; },
    async requestPasswordReset(...args) { calls.push(["request", ...args]); },
    async updatePassword(value) { calls.push(["update", value]); }
  };
  const location = { href: "https://example.test/Sproutly-app/herstel.html" + hash, pathname: "/Sproutly-app/herstel.html", hash };
  const history = { replaceState(...args) { calls.push(["history", ...args]); } };
  vm.runInNewContext(source, {
    window: { SproutlyAccount: account }, document: { querySelector: (id) => elements.get(id) },
    location, history, URL, URLSearchParams, console: { error() {} }
  });
  return { elements, calls, recover: () => recovery() };
}

test("recovery request uses the current deployment path and a generic message", async () => {
  const { elements, calls } = setup();
  elements.get("#recovery-email").value = " user@example.test ";
  await elements.get("#recovery-request").handlers.submit({ preventDefault() {} });
  assert.deepEqual(calls[0], ["request", "user@example.test", "https://example.test/Sproutly-app/herstel.html"]);
  assert.match(elements.get("#recovery-status").textContent, /Als er een account bestaat/);
});

test("only a recovery event exposes the update form; mismatch is not submitted", async () => {
  const { elements, calls, recover } = setup();
  assert.equal(elements.get("#recovery-update").hidden, true);
  recover();
  assert.equal(elements.get("#recovery-request").hidden, true);
  assert.equal(elements.get("#recovery-update").hidden, false);
  elements.get("#recovery-password").value = "password1";
  elements.get("#recovery-confirm").value = "different";
  await elements.get("#recovery-update").handlers.submit({ preventDefault() {} });
  assert.match(elements.get("#recovery-status").textContent, /niet hetzelfde/);
  assert.equal(calls.length, 0);
  elements.get("#recovery-confirm").value = "password1";
  await elements.get("#recovery-update").handlers.submit({ preventDefault() {} });
  assert.deepEqual(calls, [["update", "password1"], ["unsubscribe"]]);
  assert.equal(elements.get("#recovery-update").hidden, true);
});

test("expired link shows a message and removes error details from the URL", () => {
  const { elements, calls } = setup("#error=access_denied");
  assert.match(elements.get("#recovery-status").textContent, /ongeldig of verlopen/);
  assert.equal(calls[0][0], "history");
});
