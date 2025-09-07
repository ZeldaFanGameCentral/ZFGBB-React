import type { Config } from "@react-router/dev/config";
import { parseArgs } from "node:util";
import { loadEnv } from "vite";

const { mode } = parseArgs({
  strict: false,
  options: {
    mode: { type: "string", default: "" },
  },
  allowPositionals: true,
}).values;

const env = loadEnv(`${mode}`, process.cwd(), ["REACT_", "VITE_"]);

// FIXME: #113 fix: remove console.warn when BASE_URL is supported for local commands when react-router/dev fixes the issue with BASE_URL when middleware is enabled.
if (env["VITE_BASE"] && env["VITE_BASE"] !== "/" && mode !== "github-pages")
  console.warn(
    `Setting VITE_BASE does not work for local "yarn preview" or "yarn preview:ssr" commands. Please use "yarn dev" instead.`,
  );

export default {
  appDirectory: "src",
  ssr: env["VITE_ENABLE_SSR"] === "true",
  basename: env["VITE_BASE"] ?? "/",
  future: {
    unstable_viteEnvironmentApi: true,
    unstable_middleware: true,
    unstable_optimizeDeps: true,
    unstable_splitRouteModules: true,
    unstable_subResourceIntegrity: true,
  },
} satisfies Config;
