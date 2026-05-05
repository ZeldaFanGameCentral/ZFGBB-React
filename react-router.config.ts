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
const ssrEnabled = env["VITE_ENABLE_SSR"] === "true";

export default {
  appDirectory: "src",
  prerender: ssrEnabled
    ? true
    : [
        // routes actually prerendered for static hosting
        "/",
        "/forum",
        "/healthz",
        "/user/auth/login",
        "/user/auth/registration",
        // placeholders for dynamic-param routes; no real users hit these paths
        "/forum/board/0/1",
        "/forum/thread/0/1",
        "/user/profile/0",
        "/forum/memberList/0",
        "/search/_",
      ],
  basename: env["VITE_BASE"] ?? "/",
  presets: [ssrEnabled ? presetSsr() : presetSpa()],
} satisfies Config;
