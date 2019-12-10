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
  mode: "production" /* Change to production later */,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "GraphTransliterator.node.js"
  }
};

module.exports = [ClientConfig, ServerConfig];
