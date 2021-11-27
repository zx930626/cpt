import { cac } from "cac";
import chalk from "chalk";
import {
  BuildOptions,
  preview,
  createLogger,
  LogLevel,
  printHttpServerUrls,
  resolveConfig,
  ServerOptions,
  createServer,
  build,
  optimizeDeps,
} from "vite";

import { splitViteConfig, resolveAppConfig } from "./config";
import GenerateCache from "./generate";

const cli = cac("vrc");

// global options
interface GlobalCLIOptions {
  "--"?: string[];
  c?: boolean | string;
  config?: string;
  r?: string;
  root?: string;
  base?: string;
  l?: LogLevel;
  logLevel?: LogLevel;
  clearScreen?: boolean;
  d?: boolean | string;
  debug?: boolean | string;
  f?: string;
  filter?: string;
  m?: string;
  mode?: string;
}

/**
 * removing global flags before passing as command specific sub-configs
 */
function cleanOptions<Options extends GlobalCLIOptions>(
  options: Options
): Omit<Options, keyof GlobalCLIOptions> {
  const ret = { ...options };
  delete ret["--"];
  delete ret.c;
  delete ret.config;
  delete ret.r;
  delete ret.root;
  delete ret.base;
  delete ret.l;
  delete ret.logLevel;
  delete ret.clearScreen;
  delete ret.d;
  delete ret.debug;
  delete ret.f;
  delete ret.filter;
  delete ret.m;
  delete ret.mode;
  return ret;
}

cli
  .option("-c, --config <file>", `[string] use specified config file`)
  .option("-r, --root <path>", `[string] use specified root directory`)
  .option("--base <path>", `[string] public base path (default: /)`)
  .option("-l, --logLevel <level>", `[string] info | warn | error | silent`)
  .option("--clearScreen", `[boolean] allow/disable clear screen when logging`)
  .option("-d, --debug [feat]", `[string | boolean] show debug logs`)
  .option("-f, --filter <filter>", `[string] filter debug logs`)
  .option("-m, --mode <mode>", `[string] set env mode`);

// dev
cli
  .command("[root]") // default command
  .alias("serve")
  .option(
    "--force",
    `[boolean] force the optimizer to ignore the cache and re-bundle`
  )
  .action(async (root: string, options: ServerOptions & GlobalCLIOptions) => {
    // output structure is preserved even after bundling so require()
    // is ok here

    const generateCache = new GenerateCache(root);
    const configFilePath = splitViteConfig(options.config, root);
    const routerCallback = generateCache.generateClient(generateCache);

    try {
      const server = await createServer({
        ...resolveAppConfig({
          configPluginCallback: {
            routerCallback,
          },
        }),
        base: options.base,
        mode: options.mode,
        configFile: configFilePath,
        logLevel: options.logLevel,
        clearScreen: options.clearScreen,
        server: cleanOptions(options),
      });

      if (!server.httpServer) {
        throw new Error("HTTP server not available");
      }

      await server.listen();

      const info = server.config.logger.info;

      info(
        chalk.cyan(`\n  vite v${require("../package.json").version}`) +
          chalk.green(` dev server running at:\n`),
        {
          clear: !server.config.logger.hasWarned,
        }
      );
      server.printUrls();

      // @ts-ignore
      if (global.__vite_start_time) {
        // @ts-ignore
        const startupDuration = performance.now() - global.__vite_start_time;
        info(
          `\n  ${chalk.cyan(`ready in ${Math.ceil(startupDuration)}ms.`)}\n`
        );
      }
    } catch (e) {
      createLogger(options.logLevel).error(
        chalk.red(`error when starting dev server:\n${e.stack}`),
        { error: e }
      );
      process.exit(1);
    }
  });

// build
cli
  .command("build [root]")
  .option("--target <target>", `[string] transpile target (default: 'modules')`)
  .option("--outDir <dir>", `[string] output directory (default: dist)`)
  .option(
    "--assetsDir <dir>",
    `[string] directory under outDir to place assets in (default: _assets)`
  )
  .option(
    "--assetsInlineLimit <number>",
    `[number] static asset base64 inline threshold in bytes (default: 4096)`
  )
  .option(
    "--sourcemap",
    `[boolean] output source maps for build (default: false)`
  )
  .option(
    "--minify [minifier]",
    `[boolean | "terser" | "esbuild"] enable/disable minification, ` +
      `or specify minifier to use (default: esbuild)`
  )
  .option("--manifest", `[boolean] emit build manifest json`)
  .option(
    "--emptyOutDir",
    `[boolean] force empty outDir when it's outside of root`
  )
  .option("-w, --watch", `[boolean] rebuilds when modules have changed on disk`)
  .action(async (root: string, options: BuildOptions & GlobalCLIOptions) => {
    const configFilePath = splitViteConfig(options.config);
    const buildOptions: BuildOptions = cleanOptions(options);

    const generateCache = new GenerateCache(root);

    const routerCallback = generateCache.generateClient(generateCache);

    try {
      await build({
        ...resolveAppConfig({
          configPluginCallback: {
            routerCallback,
          },
        }),
        root,
        base: options.base,
        mode: options.mode,
        configFile: configFilePath,
        logLevel: options.logLevel,
        clearScreen: options.clearScreen,
        build: buildOptions,
      });
    } catch (e) {
      createLogger(options.logLevel).error(
        chalk.red(`error during build:\n${e.stack}`),
        { error: e }
      );
      process.exit(1);
    }
  });

cli.help();
cli.version(require("../package.json").version);

cli.parse();
