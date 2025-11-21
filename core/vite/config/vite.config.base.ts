import { defineConfig, type Plugin, type PluginOption } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import rsc from "@vitejs/plugin-rsc";
import { unstable_reactRouterRSC } from "@react-router/dev/vite";
import icons from "unplugin-icons/vite";
import autoImport from "unplugin-auto-import/vite";
import iconsResolver from "unplugin-icons/resolver";
import { VitePWA } from "vite-plugin-pwa";

import { generateImagePaths } from "@zfgc/vite-plugin-generate-image-paths";
import { preprocessTwMerge } from "@zfgc/vite-plugin-preprocess-twmerge";

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild, command }) => {
  const plugins: Array<Plugin | Plugin[] | PluginOption | PluginOption[]> = [
    tailwindcss(),
    autoImport({
      imports: [
        "react",
        "react-router",
        {
          // FIXME: remove this once https://github.com/unplugin/unplugin-auto-import/pull/603 is merged.
          react: [
            "cache",
            "cacheSignal",
            "createContext",
            "use",
            "useOptimistic",
            "useEffectEvent",
            "useActionState",
            "Fragment",
            "Suspense",
            "Activity",
            "StrictMode",
          ],
        },
        {
          "react-router": [
            "Links",
            "Link",
            "LinkProps",
            "Meta",
            "Outlet",
            "Scripts",
            "ScrollRestoration",
            "Register",
            "useNavigation",
            "useNavigate",
            "useParams",
            "useLocation",
            "useSearchParams",
          ],
          // FIXME: remove this once https://github.com/unplugin/unplugin-auto-import/pull/603 is merged.
        },
      ],
      dts: "build/types/auto-import.d.ts",
      dtsMode: command === "build" ? "overwrite" : "append",
      include: ["**/*.{ts,tsx,js,jsx}"],
      dirs: ["src/components/**", "src/types/**", "src/hooks", "src/shared/**"],
      viteOptimizeDeps: true,
      resolvers: [
        iconsResolver({
          prefix: "",
          strict: true,
        }),
      ],
    }),

    VitePWA({
      outDir: "build/client",
      injectRegister: "inline",
      strategies: "generateSW",
      registerType: "autoUpdate",
      selfDestroying: true,
      devOptions: {
        enabled: false,
        type: "module",
      },
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "ZFGC.com",
        short_name: "ZFGC.com",
        theme_color: "#000000",
        start_url: "/",
        display: "browser",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
      },
    }),
  ];

  if (isSsrBuild) plugins.push(unstable_reactRouterRSC(), rsc());
  else plugins.push(reactRouter());
  plugins.push(
    icons({ compiler: "jsx", jsx: "react", autoInstall: true }),
    generateImagePaths(),
  );
  plugins.push(preprocessTwMerge());

  return {
    plugins,
    envPrefix: ["REACT_", "VITE_"],
    build: {
      target: "esnext",
    },
    experimental: {
      hmrPartialAccept: true,
      enableNativePlugin: true,
    },
  };
});
