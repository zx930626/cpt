import chalk from "chalk";
import path from "path";
import * as T from "../types";

const renderFromConfig = (renders?: T.IRenderFromConfig) => {
  return {
    name: "trans-config",
    config(config, { command }) {
      const { routerCallback } = renders;
      routerCallback && routerCallback(config);
      return {
        ...config,
        root: path.join(process.cwd(), "/src/.varc"),
      };
    },
  };
};

export default renderFromConfig;
