import { Switch, Route, Redirect } from "react-router-dom";
import React, { ReactNode, useEffect, useState } from "react";
import { render } from "react-dom";

const renderRoutes: React.FC = (props) => {
  const {
    route: { path, component, routes = [], redirect, ...restProps },
  } = props;

  let Component: ReactNode;

  if (typeof component === "string") {
    // @ts-ignore
    Component = React.lazy(() => import(component + ".tsx"));
  }

  console.log(Component, "comps");

  if (redirect) {
    return <Redirect {...restProps} from={path} to={redirect} />;
  }

  return (
    <Route
      path={path}
      {...restProps}
      render={() => {
        return (
          <React.Suspense fallback={"loading"}>
            <Component>
              {routes.length > 0 && renderSwitch({ routes })}
            </Component>
          </React.Suspense>
        );
      }}
    ></Route>
  );
};

export const renderSwitch = (props) => {
  const { routes } = props;
  return <Switch>{routes.map((route) => renderRoutes({ route }))}</Switch>;
};
