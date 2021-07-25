import * as path from "path";
import * as webpack from "webpack";
import util from "./util";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

/**
 * 在[dev/prod.config.js]中公用的配置
 */
const commonConfig: webpack.Configuration = {
  entry: {
    "react-rxbuilder": util.entry,
  },
  output: {
    filename: `[name].js`,
    path: util.output,
    library: "ReactRxBuilder",
    libraryTarget: "umd",
    globalObject: "this",
    clean: true,
  },
  module: {
    rules: [
      {
        // See also: https://github.com/microsoft/TypeScript-Babel-Starter
        // 如果你想要.d.ts文件，那么ts-loader可能来的更直接点
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.join(
                util.rootPath,
                process.env.NODE_ENV === "production"
                  ? "tsconfig.types.json"
                  : "tsconfig.json"
              ),
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [new CleanWebpackPlugin()],
};

export default commonConfig;
