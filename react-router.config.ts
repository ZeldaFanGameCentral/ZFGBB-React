import type { Config } from "@react-router/dev/config";
import { parseArgs } from "node:util";
import { loadEnv } from "vite";
import { presetSpa } from "./react-router.config.spa.js";
import { presetSsr } from "./react-router.config.ssr.js";

const { mode } = parseArgs({
  strict: false,
  options: {
    mode: { type: "string", default: "" },
  },
  allowPositionals: true,
}).values;

const env = loadEnv(`${mode}`, process.cwd(), ["REACT_", "VITE_"]);
export default {
  appDirectory: "src",
  basename: env["VITE_BASE"] ?? "/",
  presets: [env["VITE_ENABLE_SSR"] === "true" ? presetSsr() : presetSpa()],
} satisfies Config;
