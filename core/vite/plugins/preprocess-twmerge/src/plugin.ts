import type { Plugin } from "vite";

/**
 * This plugin will preprocess tailwind merge on React components, so that it
 * does not have to be done at runtime.
 * @returns
 */
export function preprocessTwMerge(): Plugin[] {
  return [
    {
      name: "vite-plugin-preprocess-twmerge",
      enforce: "pre",
      transform(code, id) {},
    },
  ];
}
