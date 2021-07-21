import * as webpack from "webpack";
import { merge } from "webpack-merge";
import commonConfig from "./common.config";

const prodConfig: webpack.Configuration = merge(commonConfig, {
  // target: 'node', // 如果你只想打包在nodejs环境中运行的代码，就开启这个
  mode: process.env.NODE_ENV as "production",
  
  // 生产优化: https://webpack.js.org/configuration/optimization/
  optimization: {
    minimize: true,

    // 摇树
    // https://webpack.js.org/guides/tree-shaking/
    usedExports: true,
  },
});

export default [prodConfig];
