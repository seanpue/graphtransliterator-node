const path = require("path");

const ClientConfig = {
  entry: "./lib/GraphTransliterator.js",
  mode: "development" /* Change to production later */,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "entry",
                  corejs: 3
                }
              ]
            ]
          }
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "GraphTransliterator.js",
    library: "graphtransliterator"
  }
};

const ServerConfig = {
  entry: "./lib/GraphTransliterator.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "GraphTransliterator.node.js"
  }
};

const { readdirSync } = require("fs");
const { join, resolve } = require("path");

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const getClassName = dir =>
  readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name)
    .filter(dirent => dirent.endsWith(".js"));

const baseDir = join(".", "lib", "transliterators");
var transliteratorConfigs = [];

function makeConfig(filen, classn) {
  return {
    entry: `./lib/transliterators/${filen}/${classn}.js`,
    mode: "production",
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "entry",
                    corejs: 3
                  }
                ]
              ]
            }
          }
        }
      ]
    },
    output: {
      path: resolve(__dirname, "dist"),
      filename: `GraphTransliterator.${classn}.js`,
      library: `gt${classn}`
    }
  };
}

let dirs = getDirectories(baseDir);

dirs.forEach(function(dirName) {
  let transDir = join(baseDir, dirName);
  let className = getClassName(transDir)[0].slice(0, -3);
  transliteratorConfigs.push(makeConfig(dirName, className));
});

module.exports = [ClientConfig, ServerConfig].concat(transliteratorConfigs);
console.log(module.exports);
