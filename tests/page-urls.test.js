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

test("care reminders load on every page that monitors the care schedule", () => {
  for (const page of ["index", "mijn-planten", "kalender"]) {
    const source = fs.readFileSync(path.join(root, `${page}.html`), "utf8");
    assert.match(source, /<script src="care-schedule\.js"><\/script>/, page);
    assert.match(source, /<script src="care-reminders\.js"><\/script>/, page);
  }
});

test("plant and account pages load care details and data-transfer support", () => {
  const plantPage = fs.readFileSync(path.join(root, "plant.html"), "utf8");
  const homePage = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(plantPage, /<script src="plant-care-info\.js"><\/script>/);
  assert.match(plantPage, /id="care-interval-form"/);
  assert.match(plantPage, /id="plant-care-details"/);
  assert.match(homePage, /<script src="data-transfer\.js"><\/script>/);
  assert.match(homePage, /id="import-data-button"/);
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
