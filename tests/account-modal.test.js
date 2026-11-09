const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
const setAuthMode = source.slice(source.indexOf("function setAuthMode(mode)"), source.indexOf("function openAuthModal()"));

function setup(user) {
  const loginTab = { dataset: { authMode: "login" }, classList: { toggle() {} } };
  const registerTab = { dataset: { authMode: "register" }, classList: { toggle() {} } };
  const context = {
    currentUser: user, document: { querySelectorAll: () => [loginTab, registerTab] },
    authTitle: {}, authIntro: {}, authTabs: {}, authAccountSummary: {}, authAccountName: {}, authAccountEmail: {},
    authSubmit: {}, authDisplayNameField: {}, authDisplayName: {}, authPassword: {}, logoutButton: {},
    authForm: {}, authStatus: {}
  };
  vm.runInNewContext(setAuthMode, context);
  return context;
}

test("signed-in account shows its own details instead of login options", () => {
  const ui = setup({ displayName: "Plantliefhebber", email: "plant@example.test" });
  ui.setAuthMode("login");
  assert.equal(ui.authTitle.textContent, "Jouw groene account.");
  assert.equal(ui.authIntro.hidden, true);
  assert.equal(ui.authTabs.hidden, true);
  assert.equal(ui.authForm.hidden, true);
  assert.equal(ui.authAccountSummary.hidden, false);
  assert.equal(ui.authAccountName.textContent, "Plantliefhebber");
  assert.equal(ui.authAccountEmail.textContent, "plant@example.test");
  assert.equal(ui.logoutButton.hidden, false);
});

test("signed-out login and registration remain available", () => {
  const ui = setup(null);
  ui.setAuthMode("login");
  assert.equal(ui.authTabs.hidden, false);
  assert.equal(ui.authForm.hidden, false);
  assert.equal(ui.authAccountSummary.hidden, true);
  assert.equal(ui.logoutButton.hidden, true);
  ui.setAuthMode("register");
  assert.equal(ui.authTitle.textContent, "Bewaar je planten overal.");
  assert.equal(ui.authDisplayName.required, true);
  assert.equal(ui.authPassword.autocomplete, "new-password");
});
