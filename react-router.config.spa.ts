import type { Preset } from "@react-router/dev/config";

export function presetSpa(): Preset {
  return {
    name: "preset-spa",
    reactRouterConfig: ({ reactRouterUserConfig: config }) => ({
      ...config,
      ssr: false,
      serverModuleFormat: "esm",
      future: {
        unstable_viteEnvironmentApi: true,
        unstable_optimizeDeps: true,
        unstable_splitRouteModules: false,
        unstable_subResourceIntegrity: true,
        v8_middleware: true,
      },
    }),
  };
}
