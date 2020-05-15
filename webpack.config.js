const fs = require("fs");
const path = require("path");

const ServerConfig = {
  mode: "development",
  target: "node",
  entry: "./lib/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "graphtransliterator.node.js"
  }
};
const ClientConfig = {
  target: "web",
  mode: "production",
  entry: "./lib/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "graphtransliterator.js",
    library: "graphtransliterator"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
const GraphTransliteratorOnlyConfig = {
  target: "web",
  mode: "production",
  entry: "./lib/GraphTransliterator.js",
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
    path: path.join(__dirname, "dist"),
    filename: `graphtransliterator.GraphTransliterator.js`,
    library: "graphtransliterator"
  }
};
const getDirectories = source =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const baseDir = path.join(__dirname, "lib", "transliterators");

var transliteratorConfigs = [];

function makeConfig(classn) {
  return {
    mode: "development",
    entry: `./lib/transliterators/${classn}/index.js`,
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
      path: path.join(__dirname, "dist"),
      filename: `GraphTransliterator.${classn}.js`,
      library: `${classn}`
    }
  };
}

let dirs = getDirectories(baseDir);
console.log(dirs);

dirs.forEach(function(dirName) {
  let className = dirName;
  transliteratorConfigs.push(makeConfig(className)); // ClassName);//makeConfig(fullDirName, className));
});

module.exports = [
  ClientConfig,
  ServerConfig,
  GraphTransliteratorOnlyConfig
].concat(transliteratorConfigs);
module.exports.mode = "development";

/*
Const ServerConfig = {
  entry: "./lib/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "graphtransliterator.node.js"
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
    entry: `./lib/transliterators/${filen}/index.js`,
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

module.exports = [ClientConfig, ServerConfig];//.concat(transliteratorConfigs);
console.log(module.exports);
*/
