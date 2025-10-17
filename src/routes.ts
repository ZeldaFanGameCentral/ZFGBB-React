import type { RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// Reference: https://reactrouter.com/how-to/file-route-conventions for how to use routes.
// https://reactrouter.com/start/framework/route-module
const routes = flatRoutes({
  rootDirectory: "./pages",
  //   ignoredRouteFiles: ["home.tsx"],
}) satisfies RouteConfig;

export default routes;
