const path = require("path");
const fs = require("fs");

fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(file => file.isDirectory())
  .forEach(function(subdir) {
    let subdirn = subdir.name;
    let subdirPath = path.join(__dirname, subdirn);
    let jsfilen = fs
      .readdirSync(subdirPath)
      .filter(
        filen => filen.toUpperCase() === (subdirn + ".js").toUpperCase()
      )[0];
    let className = jsfilen.slice(0, jsfilen.length - 3);
    module.exports[className] = require(path.join(subdirPath, jsfilen));
  });
