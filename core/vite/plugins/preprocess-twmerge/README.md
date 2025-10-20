# @zfgccp/vite-plugin-preprocess-twmerge

This plugin will preprocess tailwind merge on React components, so that it does not have to be done at runtime.

## Usage

```ts
import { preprocessTwMerge } from "@zfgccp/vite-plugin-preprocess-twmerge";

export default defineConfig({
  plugins: [preprocessTwMerge()],
});
```

## Options

### `include`

Type: `RegExp`

Default: `/\.(jsx|tsx)$/`

The pattern to match files to preprocess.

### `exclude`

Type: `RegExp`

Default: `/node_modules/`

The pattern to exclude files from preprocessing.

### `handleDynamicClassName`

Type: `boolean`

Default: `false`

Whether to handle dynamic class name expressions. i.e. `className={...}`.

### `twMergeImportSepcifier`

Type: `string`

Default: `""`

The specifier to import twMerge from. If set, it will auto-import twMerge and use it to merge class names for detected dynamic class name expressions that cannot be evaluated at build time.
