// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV == "production";

import webpack from "webpack";

const config = {
  output: {
    path: path.resolve(__dirname, "dist"),
    chunkFormat: "module",
    library: {
      type: 'module',
    },
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
      "http": false,
      "async_hooks": false,
    }
  },
  experiments: {
    outputModule: true,
  },
};

export default () => {
  if (isProduction) {
    config.mode = "production";
    config.entry = "./index.ts";
  } else {
    config.mode = "development";
    config.entry = "./demo/index.ts";
  }
  switch (process.env.BUILD_TARGET) {
    case "node":
      config.target = "node12";
      config.output.filename = "main.node.js";
      break;
    case "serviceworker":
      config.target = "webworker";
      config.output.filename = "main.serviceworker.js";
      break;
    case "deno":
      config.target = "webworker";
      config.output.filename = "main.deno.js";
      break;
    case "cfworker":
      config.mode = "production";
      config.target = "webworker";
      config.output.filename = "main.cfworker.js";
      break;
    case "txiki":
      config.mode = "production";
      config.target = "es2021";
      config.output.filename = "main.txiki.js";
      config.plugins.push(
        new webpack.ProvidePlugin({
          'Promise': 'bluebird'
        })
      )
      break;
    case "bun":
      config.mode = "production";
      config.target = "node12";
      config.output.filename = "main.bun.js";
      break;
    case "deno:test":
      config.target = "webworker";
      config.output.filename = "test.deno.js";
      config.entry = "./test/test-server.deno.ts";
      break;
    default:
      config.target = "es6";
      break;
  }

  return config;
};
