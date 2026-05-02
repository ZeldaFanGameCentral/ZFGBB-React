/// <reference types="vite/client" />
/// <reference types="../build/types/image-paths.d.ts" />

interface ImportMetaEnv {
  readonly REACT_ZFGBB_API_URL: `/${string}` | `${string}://${string}`;
  readonly REACT_ZFGBB_API_URL_INTERNAL: `${string}://${string}`;
  readonly VITE_API_PROXY_TARGET: `${string}://${string}`;
  readonly REACT_ZFGBB_FEATURE_FLAG_ENABLE_THEME_PICKER: "true" | "false";
  // Vite base url
  readonly VITE_BASE: `/${string}/`;
  readonly VITE_ENABLE_SSR: "true" | "false";
  readonly _oh_Hi_Mark__WHAT_a_STORY_Mark_LOLOLOL_: never;
}
