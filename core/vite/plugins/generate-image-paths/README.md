# @zfgc/vite-plugin-generate-image-paths

This plugin generates image paths for the [BBImage](../../../../src//components/common/BBImage.tsx) component. Generates TypeScript type defintiions for asset paths
that can be used for making the src attribute type-safe of the actual images that are available.

## Installation

```bash
yarn add -D @zfgc/vite-plugin-generate-image-paths
```

## Usage

```ts
import { defineConfig } from "vite";
import { generateImagePaths } from "@zfgc/vite-plugin-generate-image-paths";

export default defineConfig({
  plugins: [
    generateImagePaths({
      // Options
    }),
  ],
});
```

## Options

### `assetsPath`

Type: `string`

Default: `"public"`

Root directory for assets.

### `includeAssetDirs`

Type: `string[]`

Default: `["images", "themes"]`

Array of subdirectories to scan for generating types.

### `outputTypeDir`

Type: `string`

Default: `"build"`

Tyoe output directory.

### `outputClientDir`

Type: `string`

Default: `"build/client/assets"`

Client assets output directory.

### `outputServerDir`

Type: `string`

Default: `"build/server/assets"`

Server assets output directory.

### `debug`

Type: `boolean`

Default: `false`

Enable debug logging.
