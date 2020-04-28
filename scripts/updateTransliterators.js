var fs = require("fs");
var cp = require("child_process");
var path = require("path");

/* Var gtVersion = cp
  .execSync("graphtransliterator --version", { encoding: "utf8" })
  .trim()
  .match(/(?<=graphtransliterator, version )(.+)/)[0];
*/

var bundledTransliterators = cp
  .execSync("graphtransliterator list-bundled", { encoding: "utf8" })
  .match(/(?<= {2}).+/g)
  .sort();

function writeIfDifferent(data, filen) {
  if (
    !fs.existsSync(filen) ||
    fs.readFileSync(filen, "utf8").trim() !== data.trim()
  ) {
    fs.writeFileSync(filen, data, { encoding: "utf8" });
    console.log(`updated ${filen}`);
  }
}

bundledTransliterators.forEach(function(className) {
  var transliteratorJSON = cp.execSync(
    `graphtransliterator dump --from bundled ${className}`,
    { encoding: "utf8" }
  );
  let outputdir = path.join(
    __dirname,
    "..",
    "lib",
    "transliterators",
    className
  );

  if (!fs.existsSync(outputdir)) {
    fs.mkdirSync(outputdir);
  }

  let JSONfilen = path.join(outputdir, className + ".json");
  /* Turning individual index.js creation this off for now, as surfacing from index.js:
  var transliteratorJS = `const { GraphTransliterator } = require("../../GraphTransliterator.js");
const ${className}Settings = require("./${className}.json");
const ${className}Transliterator = GraphTransliterator.fromDict(${className}Settings);
module.exports = ${className}Transliterator;
`;

  let JSfilen = path.join(outputdir, className + ".js");
  writeIfDifferent(transliteratorJS, JSfilen); \
  */
  writeIfDifferent(transliteratorJSON, JSONfilen);
});

let rstdoc = bundledTransliterators
  .map(x => ".. autoclass:: " + x)
  .join("\n\n");

writeIfDifferent(rstdoc, "docs/transliterators.inc");
