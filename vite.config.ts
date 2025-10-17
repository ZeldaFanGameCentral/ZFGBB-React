import { defineConfig, loadEnv, Plugin } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import rsc from "@vitejs/plugin-rsc";
import { unstable_reactRouterRSC } from "@react-router/dev/vite";

import { generateImagePaths } from "./vite/plugins/vite-plugin-generate-image-paths";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const srcDirectory = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), ["REACT_", "VITE_"]);
  const plugins = [tailwindcss()];
  if (isSsrBuild) plugins.push(unstable_reactRouterRSC() as Plugin[], rsc());
  else plugins.push(reactRouter(), generateImagePaths());

  plugins.push(generateImagePaths());

  return {
    base: env["VITE_BASE"] ?? "/",
    plugins,
    envPrefix: ["REACT_", "VITE_"],
    build: {
      target: "esnext",
    },
    server: {
      allowedHosts: [".zfgc.com"],
    },
    resolve: {
      alias: {
        "@": srcDirectory,
        "~": srcDirectory,
      },
    },
    ssr: {
      // Fixes build for styled-components.
      noExternal: ["styled-components"],
    },
  };
});
