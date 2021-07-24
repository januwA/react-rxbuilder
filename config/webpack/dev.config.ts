import path = require("path");
import * as webpack from "webpack";
import { merge } from "webpack-merge";
const HtmlWebpackPlugin = require("html-webpack-plugin");

import commonConfig from "./common.config";
import util from "./util";

const devConfig: webpack.Configuration = merge(commonConfig, {
  mode: "development",
  devtool: "eval",
  entry: path.resolve(__dirname, "../../examples", "index"),
  output: {
    filename: `[name].js`,
    path: util.output,
    libraryTarget: "umd",
    globalObject: "this",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(__dirname, "../../examples/index.html"),
    }),
  ],
});

export default [devConfig];
