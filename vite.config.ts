import { defineConfig, mergeConfig, type UserConfig } from "vite";
import { fileURLToPath, resolve } from "node:url";
import baseConfig from "@zfgccp/vite-config-base";

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
