import * as path from "path";
import * as fs from "fs";
import * as JSON5 from "json5";

class Util {
  /**
   * 读取 tsconfig.json的配置
   */
  static _tsconfig = null;
  get tsconfig(): any {
    if (Util._tsconfig) return Util._tsconfig;
    return (Util._tsconfig = JSON5.parse(
      fs.readFileSync(path.resolve(this.rootPath, "tsconfig.json"), {
        encoding: "utf-8",
      })
    ));
  }

  /**
   * 返回项目根目录
   */
  static _rootPath = null;
  get rootPath(): string {
    if (Util._rootPath) return Util._rootPath;
    return (Util._rootPath = path.resolve(__dirname, "../../"));
  }

  /**
   * 返回打包入口文件路径
   */
  get entry(): string {
    return path.resolve(this.rootPath, "src", "index");
  }

  /**
   * 打包输出目录
   */
  get output(): string {
    const out = this.tsconfig ? this.tsconfig.compilerOptions.outDir : "dist";
    return path.resolve(this.rootPath, out, "umd");
  }
}
const util = new Util();
export default util;
