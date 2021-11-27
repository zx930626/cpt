import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";

const pwd = process.cwd();
const args = process.argv.slice(2);
const [projectName] = args.length > 0 ? args : ["myApp"];

console.log("创建项目文件夹：", chalk.green(projectName));

try {
  fs.mkdirSync(pwd + `/${projectName}`);
} catch (err) {
  console.log(chalk.red(`Err: 此项目下已有相同文件夹`));
  console.log(chalk.red("Message: Init Failed"));
}
