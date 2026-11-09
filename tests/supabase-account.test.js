const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "account.js"), "utf8");

function createAccount() {
  let storedState = null;
  let signedIn = false;
  let failInsert = false;
  const user = { id: "user-1", email: "test@example.test", user_metadata: { display_name: "Test" } };
  const storage = new Map();
  const client = {
    auth: {
      async getSession() { return { data: { session: signedIn ? {} : null }, error: null }; },
      async getUser() { return { data: { user }, error: null }; },
      async signUp() { signedIn = true; return { data: { user, session: {} }, error: null }; },
      async signInWithPassword() { signedIn = true; return { data: { user }, error: null }; },
      async signOut() { signedIn = false; return { error: null }; }
    },
    from() {
      return {
        select() { return { eq() { return { async maybeSingle() { return { data: storedState === null ? null : { state: structuredClone(storedState), user_id: user.id }, error: null }; } }; } }; },
        async insert(row) {
          if (failInsert) return { error: new Error("offline") };
          if (storedState !== null) return { error: new Error("duplicate") };
          storedState = structuredClone(row.state);
          return { error: null };
        }
      };
    },
    async rpc(name, args) {
      if (name === "save_sproutly_state") {
        if (JSON.stringify(storedState) !== JSON.stringify(args.expected_state)) return { data: false, error: null };
        storedState = structuredClone(args.new_state);
        return { data: true, error: null };
      }
      return { data: null, error: null };
    }
  };
  const context = {
    window: { createSproutlySupabaseClient: () => client },
    document: { querySelector: () => null },
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key)
    },
    structuredClone, JSON, console: { error() {} }
  };
  vm.runInNewContext(source, context);
  return {
    account: context.window.SproutlyAccount,
    setFailure(value) { failInsert = value; },
    getStored() { return structuredClone(storedState); },
    changeExternally(value) { storedState = structuredClone(value); }
  };
}

test("registration imports local plant and log data", async () => {
  const { account, getStored } = createAccount();
  const state = { savedPlants: ["Monstera"], plantProfiles: { Monstera: { careLog: [{ action: "Water gegeven" }] } }, completedTasks: [], careOverrides: {} };
  await account.register("test@example.test", "password", "Test", state);
  assert.deepEqual(getStored(), state);
  assert.deepEqual(await account.getState(), state);
});

test("failed import can be retried on login without losing local data", async () => {
  const { account, setFailure, getStored } = createAccount();
  const state = { savedPlants: ["Monstera"], plantProfiles: {}, completedTasks: [], careOverrides: {} };
  setFailure(true);
  await assert.rejects(account.register("test@example.test", "password", "Test", state), /niet worden overgezet/);
  setFailure(false);
  await account.login("test@example.test", "password", state);
  assert.deepEqual(getStored(), state);
});

test("outdated pages cannot overwrite newer account data", async () => {
  const { account, changeExternally, getStored } = createAccount();
  const state = { savedPlants: ["Monstera"], plantProfiles: {}, completedTasks: [], careOverrides: {} };
  await account.register("test@example.test", "password", "Test", state);
  const newer = { ...state, savedPlants: ["Monstera", "Basilicum"] };
  changeExternally(newer);
  await assert.rejects(account.saveState({ ...state, savedPlants: [] }), /andere pagina gewijzigd/);
  assert.deepEqual(getStored(), newer);
});
