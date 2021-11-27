import path from "path";
import fs from "fs-extra";

export default function customTheme() {
  const themePath = path.resolve(__dirname, "config/theme.config.ts");
  let themeConfig = {};

  if (fs.existsSync(themePath)) {
    themeConfig = require(themePath);
  } else {
    return {};
  }
}
