import type { Preset } from "@react-router/dev/config";

export function presetSsr(): Preset {
  return {
    name: "preset-ssr",
    reactRouterConfig: ({ reactRouterUserConfig: config }) => ({
      ...config,
      ssr: true,
      serverModuleFormat: "esm",
      future: {
        unstable_viteEnvironmentApi: true,
        unstable_optimizeDeps: true,
        unstable_splitRouteModules: false, // Unsupported for now
        unstable_subResourceIntegrity: false, // Unsupported for now
        v8_middleware: true,
      },
    }),
  };
}
