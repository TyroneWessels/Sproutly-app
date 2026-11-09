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

test("the header shows Sproutly initials without an account and user initials after login", () => {
  const updateAccountUi = source.slice(source.indexOf("function updateAccountUi()"), source.indexOf("function setAuthMode(mode)"));
  const ui = {
    currentUser: null, accountAvatar: {}, accountNameLabel: {},
    profileButton: { setAttribute(name, value) { this[name] = value; } },
    accountDataActions: {}
  };
  vm.runInNewContext(updateAccountUi, ui);
  ui.updateAccountUi();
  assert.equal(ui.accountAvatar.textContent, "SP");
  assert.equal(ui.accountNameLabel.textContent, "Inloggen");
  ui.currentUser = { displayName: "Groene Vriend" };
  ui.updateAccountUi();
  assert.equal(ui.accountAvatar.textContent, "GV");
  assert.equal(ui.accountNameLabel.textContent, "Groene Vriend");
  ui.currentUser = null;
  ui.updateAccountUi();
  assert.equal(ui.accountAvatar.textContent, "SP");
});

test("all account headers initially show signed-out text", () => {
  for (const file of ["index.html", "mijn-planten.html", "kalender.html", "planten.html", "plant.html"]) {
    const html = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    assert.match(html, /class="avatar">SP<\/span>/, file);
    assert.match(html, /class="profile-name">Inloggen<\/span>/, file);
  }
});
