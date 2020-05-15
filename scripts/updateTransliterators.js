var fs = require("fs");
var cp = require("child_process");
var path = require("path");

/* Var gtVersion = cp
  .execSync("graphtransliterator --version", { encoding: "utf8" })
  .trim()
  .match(/(?<=graphtransliterator, version )(.+)/)[0];
*/

/**
 * Write to file (in utf8) only if different
 *
 * @param {string} data
 * @param {string} filen
 */
function writeIfDifferent(data, filen) {
  if (
    !fs.existsSync(filen) ||
    fs.readFileSync(filen, "utf8").trim() !== data.trim()
  ) {
    fs.writeFileSync(filen, data, { encoding: "utf8" });
    console.log(`updated ${filen}`);
  }
}

// Get bundled transliterators using graphtransliterator cli
var bundledTransliterators = cp
  .execSync("graphtransliterator list-bundled", { encoding: "utf8" })
  .match(/(?<= {2}).+/g)
  .sort();

bundledTransliterators.forEach(function(className) {
  var transliteratorJSON = cp.execSync(
    `graphtransliterator dump --from bundled ${className}`,
    { encoding: "utf8" }
  );
  var testsJSON = cp
    .execSync(`graphtransliterator dump-tests --to json ${className}`, {
      encoding: "utf8"
    })
    .trim();
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
  let testfilen = path.join(outputdir, className + "_tests.json");
  // Could add more details from JSON to docstring

  var transliteratorJS = `const { Bundled } = require("../bundled.js");

/**
 * ${className} transliterator
 * 
 * @class transliterators/${className}
 * @extends Bundled
 */

const ${className}Settings = require("./${className}.json");
const ${className}Tests = require("./${className}_tests.json");
const ${className} = new Bundled(${className}Settings, ${className}Tests);

module.exports = ${className};
`;

  let JSfilen = path.join(outputdir, "index.js");
  writeIfDifferent(transliteratorJS, JSfilen);
  writeIfDifferent(transliteratorJSON, JSONfilen);
  writeIfDifferent(testsJSON, testfilen);
});

let rstdoc = bundledTransliterators
  .map(x => ".. autoclass:: " + x)
  .join("\n\n");

writeIfDifferent(rstdoc, "docs/transliterators.inc");

let indexjs =
  `/**
* Graph Transliterator's bundled transliterators
*
* @module transliterators
*
*/
const { Bundled } = require("./bundled.js");
module.exports = {
  Bundled,
` +
  bundledTransliterators.map(x => `  ${x}: require("./${x}")`).join(",\n") +
  `
};`;

writeIfDifferent(indexjs, "lib/transliterators/index.js");
