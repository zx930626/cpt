import { BrowserRouter, HashRouter } from "react-router-dom";
import { render } from "react-dom";
import * as T from "./types";
import { renderSwitch } from "./renderRouter";

export const renderClient = (config: T.IRouterConfig) => {
  const { routes, rootEle = "root", history = "browser" } = config;

  if (history === "browser") {
    render(
      <BrowserRouter>{renderSwitch({ routes })}</BrowserRouter>,
      document.getElementById(rootEle)
    );
  } else if (history === "hash") {
    render(
      <HashRouter>{renderSwitch({ routes })}</HashRouter>,
      document.getElementById(rootEle)
    );
  }
};
