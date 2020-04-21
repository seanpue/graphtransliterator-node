const fs = require("fs");

fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(file => file.isDirectory())
  .forEach(function(subdir) {
    let subdirn = subdir.name;
    let jsfilen = fs
      .readdirSync(`${__dirname}/${subdirn}`)
      .filter(
        filen => filen.toUpperCase() === (subdirn + ".js").toUpperCase()
      )[0];
    let className = jsfilen.slice(0, jsfilen.length - 3);
    module.exports[className] = require(`${__dirname}/${subdirn}/${jsfilen}`);
  });
