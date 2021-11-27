import routes from "./routes.config";

export default {
  root: ".varc/index.html",
  history: "browser",
  routes,
  build: {
    dynamicImportVarsOptions: {
      excludes: ["src/**/*"],
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
};
