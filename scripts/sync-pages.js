const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const pages = ["planten", "mijn-planten", "kalender", "plant", "herstel"];
for (const page of pages) {
  const source = fs.readFileSync(path.join(root, `${page}.html`), "utf8");
  if (!source.includes("<head>")) throw new Error(`Geen head gevonden in ${page}.html`);
  const output = source.replace("<head>", '<head>\n  <base href="../" />');
  const directory = path.join(root, page);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), output);
}
