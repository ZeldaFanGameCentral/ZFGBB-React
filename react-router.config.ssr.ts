import type { Preset } from "@react-router/dev/config";

export function presetSsr(): Preset {
  return {
    name: "preset-ssr",
    reactRouterConfig: ({ reactRouterUserConfig: config }) => ({
      ...config,
      ssr: true,
      serverModuleFormat: "esm",
      subResourceIntegrity: true,
      future: {
        unstable_optimizeDeps: true,
        v8_splitRouteModules: true,
        v8_viteEnvironmentApi: true,
        v8_middleware: true,
      },
    }),
  };
}
