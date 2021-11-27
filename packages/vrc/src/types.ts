import { ResolvedConfig } from "vite";

export { ResolvedConfig, UserConfigExport } from "vite";

export type PartialViteConfig = Partial<ResolvedConfig>;

export interface VrxConfig extends PartialViteConfig {}

export { IRoute } from "@varc/rebuild/dist/render-router/types";

export interface IRenderFromConfig {
  routerCallback: Function;
}

export interface IPluginCallback {
  configPluginCallback?: IRenderFromConfig;
}
