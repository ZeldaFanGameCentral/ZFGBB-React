# @zfgccp/vite-plugin-preprocess-twmerge

A vite plugin will preprocess `tailwind-merge` on JSX components className attributes, so that it does not have to be done at runtime.

This vite plugin requires [Node.js](https://nodejs.org) 22 or later, as it depends on the strippable types.

## Usage

```ts
import { preprocessTwMerge } from "@zfgccp/vite-plugin-preprocess-twmerge";

export default defineConfig({
  plugins: [preprocessTwMerge()],
});
```

You can also pass in options to the plugin:

```ts
import { preprocessTwMerge } from "@zfgccp/vite-plugin-preprocess-twmerge";

export default defineConfig({
  plugins: [
    preprocessTwMerge({
      // Enables additional processing of className expressions, to attempt to retrieve the actual className value.
      handleDynamicClassName: true,
      /// Enables wrapping dynamic className expressions in twMerge()
      twMergeImportSpecifier: "twMerge",
    }),
  ],
});
```

## Options

The [options](./src/options.ts) are all optional, as the defaults are sane and safe to use.

By default, this plugin will only attempt statically evaluatable expressions, and will not attempt to evaluate dynamic expressions, or wrap them in twMerge(). You choose to enable either behavior by setting the options.

### `include` (default: `/\.(jsx|tsx)$/`)

Include files matching this regular expression

### `exclude` (default: `/node_modules/`)

Exclude files matching this regular expression

### `handleDynamicClassName` (default: `false`)

Enable dynamic className evaluation - tries to evaluate expressions further that cannot be evaluated.

### `twMergeImportSpecifier` (default: `""`)

Import specifier for twMerge(). Setting this to something other than "" will
enable dynamic className evaluation. All className={...} expressions that cannot be statically
evaluated will be wrapped in twMerge() (or whatever import specifier is set).

### `oxcParserOptions` (default: `{}`)

OXC parser options

### `debug` (default: `false`)

Enable debug mode
