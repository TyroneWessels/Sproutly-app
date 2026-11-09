const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const pages = ["planten", "mijn-planten", "kalender", "plant", "herstel"];

test("directory pages match their legacy counterparts and use the deployment root", () => {
  for (const page of pages) {
    const source = fs.readFileSync(path.join(root, `${page}.html`), "utf8");
    const directoryPage = fs.readFileSync(path.join(root, page, "index.html"), "utf8");
    assert.equal(directoryPage, source.replace("<head>", '<head>\n  <base href="../" />'), page);
    const base = new URL("../", `https://example.test/project/${page}/`);
    assert.equal(base.href, "https://example.test/project/");
    assert.equal(new URL("styles.css", base).href, "https://example.test/project/styles.css");
    assert.equal(new URL("plant/?naam=Monstera", base).href, "https://example.test/project/plant/?naam=Monstera");
  }
});

test("plant URL keeps the species and specimen id in the query string", () => {
  const vm = require("node:vm");
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, "plant-instances.js"), "utf8"), context);
  const link = context.window.SproutlyPlants.url("Aloë vera", "plant one");
  const url = new URL(link, "https://example.test/project/");
  assert.equal(url.pathname, "/project/plant/");
  assert.equal(url.searchParams.get("naam"), "Aloë vera");
  assert.equal(url.searchParams.get("id"), "plant one");
});
