import { defineConfig, mergeConfig, UserConfig } from "vite";
import { fileURLToPath, resolve } from "node:url";
import baseConfig from "./vite/vite.config.base.js";

const srcDirectory = resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "src",
);

// https://vitejs.dev/config/
export default defineConfig((env) => {
  return mergeConfig(baseConfig(env), {
    server: {
      allowedHosts: [".zfgc.com"],
    },
    resolve: {
      alias: {
        "@": srcDirectory,
      },
    },
  } satisfies UserConfig);
});
