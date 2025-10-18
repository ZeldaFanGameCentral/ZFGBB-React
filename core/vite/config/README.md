# @zfgccp/vite-config-base

This is a base Vite config for ZFGCBB-React. It includes the following:

- React Router
  - React Server Components configured.
- Tailwind CSS
- TypeScript
- Auto import capability
  - Auto import of icons
- Auto detection of image assets through the [generate-image-paths](../plugins/generate-image-paths) plugin.

This is used in the main [vite.config.ts](../../../vite.config.ts) file.

## Installation

```bash
yarn add -D @zfgccp/vite-config-base
```

## Usage

```ts
import { defineConfig } from "vite";
import baseConfig from "@zfgccp/vite-config-base";

export default defineConfig(baseConfig());
```
