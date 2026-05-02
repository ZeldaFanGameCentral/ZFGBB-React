import { defineConfig, loadEnv, mergeConfig, type UserConfig } from "vite";
import { fileURLToPath, resolve } from "node:url";
import baseConfig from "@zfgc/vite-config-base";

const srcDirectory = resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "src",
);

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const envVars = loadEnv(env.mode, process.cwd(), "");
  const apiProxyTarget =
    envVars.VITE_API_PROXY_TARGET ?? "http://localhost:8080";

  return mergeConfig(baseConfig(env), {
    server: {
      allowedHosts: [".zfgc.com"],
      proxy: {
        "/zfgbb": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": srcDirectory,
      },
    },
  } satisfies UserConfig);
});
