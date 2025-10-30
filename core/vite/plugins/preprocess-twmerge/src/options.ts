import type { ParserOptions } from "oxc-parser";

export interface PreprocessTwMergeOptions {
  /**
   * Include files matching this regular expression
   * @default /\.(jsx|tsx)$/
   */
  include?: RegExp;
  /**
   * Exclude files matching this regular expression
   * @default /node_modules/
   */
  exclude?: RegExp;
  /**
   * Enable dynamic className evaluation - tries to evaluate expressions further that cannot be evaluated.
   * @default false
   */
  handleDynamicClassName?: boolean;
  /**
   * Import specifier for twMerge(). Setting this to something other than "" will
   * enable dynamic className evaluation. All className={...} expressions that cannot be statically
   * evaluated will be wrapped in twMerge() (or whatever import specifier is set).
   * @default ""
   * @example "twMerge"
   */
  twMergeImportSpecifier?: string;
  /**
   * OXC parser options
   * @default {}
   * @see {@link ParserOptions}
   */
  oxcParserOptions?: Pick<ParserOptions, "lang" | "sourceType">;
  /**
   * Enable debug mode
   * @default false
   */
  debug?: boolean;
}
