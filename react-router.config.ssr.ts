import type { Preset } from "@react-router/dev/config";

export function presetSsr(): Preset {
  return {
    name: "preset-ssr",
    reactRouterConfig: ({ reactRouterUserConfig: config }) => ({
      ...config,
      ssr: true,
      serverModuleFormat: "esm",
      future: {
        unstable_optimizeDeps: true,
        unstable_subResourceIntegrity: true,
        v8_splitRouteModules: false, // Unsupported for now
        v8_viteEnvironmentApi: true,
        v8_middleware: true,
      },
    }),
  };
}
