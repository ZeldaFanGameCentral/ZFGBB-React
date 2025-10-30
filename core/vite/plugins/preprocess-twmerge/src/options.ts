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
   * Enable dynamic className evaluation - injects twMerge() into className={...} expressions that cannot be evaluated statically.
   * @default false
   */
  handleDynamicClassName?: boolean;
  /**
   * Import specifier for twMerge()
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
