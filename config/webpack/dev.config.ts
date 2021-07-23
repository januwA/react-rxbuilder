import path = require("path");
import * as webpack from "webpack";
import { merge } from "webpack-merge";
const HtmlWebpackPlugin = require("html-webpack-plugin");

import commonConfig from "./common.config";
import util from "./util";

const devConfig: webpack.Configuration = merge(commonConfig, {
  mode: process.env.NODE_ENV as "development",
  entry: path.resolve(__dirname, "../../examples", "index"),
  output: {
    filename: `[name].js`,
    path: util.output,
    libraryTarget: "umd",
    globalObject: "this",
    clean: true,
  },
  plugins: [
    // 生成一个 HTML5 文件
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      inject: false, // 不自动注入，在html中编写脚本设置注入位置
      title: "webpack-scaffold",
      template: path.resolve(__dirname, '../../examples/index.html'),
    }),
  ],
});

export default [devConfig];
