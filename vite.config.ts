import { defineConfig, loadEnv, Plugin, PluginOption } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import rsc from "@vitejs/plugin-rsc";
import { unstable_reactRouterRSC } from "@react-router/dev/vite";
import icons from "unplugin-icons/vite";
import autoImport from "unplugin-auto-import/vite";
import iconsResolver from "unplugin-icons/resolver";
import { generateImagePaths } from "./vite/plugins/vite-plugin-generate-image-paths";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const srcDirectory = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), ["REACT_", "VITE_"]);
  const plugins: Array<Plugin | Plugin[] | PluginOption | PluginOption[]> = [
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
      dtsMode: "overwrite",
      include: ["**/*.{ts,tsx,js,jsx}"],
      dirs: ["src/components/**", "src/types/**"],
      viteOptimizeDeps: true,
      resolvers: [
        iconsResolver({
          prefix: "",
          strict: true,
        }),
      ],
    }),
    icons({ compiler: "jsx", jsx: "react", autoInstall: true }),
    tailwindcss(),
  ];

  if (isSsrBuild) plugins.push(unstable_reactRouterRSC(), rsc());
  else plugins.push(reactRouter());
  plugins.push(generateImagePaths());

  return {
    base: env["VITE_BASE"] ?? "/",
    plugins,
    envPrefix: ["REACT_", "VITE_"],
    build: {
      target: "esnext",
    },
    experimental: {
      hmrPartialAccept: true,
      enableNativePlugin: true,
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
  };
});
