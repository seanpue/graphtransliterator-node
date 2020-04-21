const fs = require("fs");

fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(file => file.isDirectory())
  .forEach(function(subdir) {
    let classn = subdir.name;
    module.exports[classn] = require(`./${classn}/${classn}.js`);
  });
