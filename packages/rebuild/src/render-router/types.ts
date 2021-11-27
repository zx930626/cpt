export interface IRoute {
  redirect: string;
  path: string;
  component: string;
  title: string;
  routes: IRoute[];
}

export interface IRouterConfig {
  routes: IRoute[];
  rootEle: string;
  history: "browser" | "hash";
}
