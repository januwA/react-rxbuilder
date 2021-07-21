import * as path from "path";
import * as webpack from "webpack";
import util from "./util";

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

    // 如果发布第三方包，可以启动下面这三个配置
    library: "ReactRxStream",
    libraryTarget: "umd",
    globalObject: "this",

    // 清理dist
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
                  ? "tsconfig.build.json"
                  : "tsconfig.json"
              ),
            },
          },
        ],
      },
    ],
  },

  resolve: {
    // 导入此类文件时，不用添加文件后缀
    extensions: [".tsx", ".ts", ".js"],
  },
};

export default commonConfig;
