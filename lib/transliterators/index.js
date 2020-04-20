const path = require("path");
const fs = require("fs");

fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(file => file.isDirectory())
  .forEach(function(subdir) {
    let subdirn = subdir.name;
    module.exports[subdirn] = require(path.join(
      __dirname,
      subdirn,
      `${subdirn}.js`
    ));
  });
console.log(module.exports);
