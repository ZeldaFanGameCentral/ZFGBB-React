import type { Preset } from "@react-router/dev/config";

export function presetSpa(): Preset {
  return {
    name: "preset-spa",
    reactRouterConfig: ({ reactRouterUserConfig: config }) => ({
      ...config,
      ssr: false,
      serverModuleFormat: "esm",
      subResourceIntegrity: true,
      future: {
        unstable_optimizeDeps: true,
        v8_viteEnvironmentApi: true,
        v8_splitRouteModules: false,
        v8_middleware: true,
      },
    }),
  };
}
