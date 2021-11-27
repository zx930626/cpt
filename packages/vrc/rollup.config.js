import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import typescript2 from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";

export default [
  {
    input: {
      index: path.resolve(__dirname, "./src/index.ts"),
      cli: path.resolve(__dirname, "./src/cli.ts"),
    },
    output: {
      dir: path.resolve(__dirname, "lib"),
      entryFileNames: `[name].js`,
      chunkFileNames: "dep-[hash].js",
      exports: "named",
      format: "es",
      externalLiveBindings: false,
      freeze: false,
      sourcemap: true,
    },
    plugins: [
      copy({
        targets: [{ src: "src/tpl/**/*", dest: "lib/tpl" }],
      }),
      resolve({ extensions: [".js", ".jsx", ".ts", ".tsx"] }),
      typescript2(),
      commonjs({
        include: /node_modules/,
      }),
      json(),
    ],
    external: [
      "vite",
      "fs-extra",
      "chalk",
      "@varc/rebuild",
      "@varc/rebuild/dist/rebuild-antd",
      "@varc/rebuild/dist/render-router",
      ...Object.keys(require("./package.json").dependencies),
    ],
    treeshake: {
      moduleSideEffects: "no-external",
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
  },
  {
    input: {
      index: path.resolve(__dirname, "./src/index.ts"),
      cli: path.resolve(__dirname, "./src/cli.ts"),
    },
    output: {
      dir: path.resolve(__dirname, "dist"),
      entryFileNames: `[name].js`,
      chunkFileNames: "dep-[hash].js",
      exports: "named",
      format: "cjs",
      externalLiveBindings: false,
      freeze: false,
      sourcemap: true,
    },
    plugins: [
      copy({
        targets: [{ src: "src/tpl/**/*", dest: "dist/tpl" }],
      }),
      resolve({ extensions: [".js", ".jsx", ".ts", ".tsx"] }),
      typescript2(),
      commonjs({
        include: /node_modules/,
      }),
      json(),
    ],
    external: [
      "vite",
      "fs-extra",
      "chalk",
      "@varc/rebuild",
      "@varc/rebuild/dist/rebuild-antd",
      "@varc/rebuild/dist/render-router",
      ...Object.keys(require("./package.json").dependencies),
    ],
    treeshake: {
      moduleSideEffects: "no-external",
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
  },
];
