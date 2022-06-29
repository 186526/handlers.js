// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      }

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
    fallback: {
      "http": false
    }
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
    config.entry = "./index.ts";
  } else {
    config.mode = "development";
    config.entry = "./demo/index.ts";
  }
  switch(process.env.TARGET) {
    case "node":
      config.target = "node14";
      config.output.filename = "main.node.js";
      break;
    case "webworker":
      config.target = "webworker";
      config.output.filename = "main.webworker.js";
      break;
    default:
      config.target = "es6";
  }

  return config;
};
