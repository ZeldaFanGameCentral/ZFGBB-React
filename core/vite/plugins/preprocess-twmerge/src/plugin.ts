import type { Plugin } from "vite";
import { parseSync, type ParseResult, type ParserOptions } from "oxc-parser";
import { transform } from "oxc-transform";

import type { PreprocessTwMergeOptions } from "./options.ts";
import { traverseAST } from "./ast/traverse-ast.ts";

import { applySourceEdits, type SourceEdit } from "./ast/apply-source-edits.ts";
import { collectConstantBindings } from "./ast/collect-constant-bindings.ts";
import { computeImportInsertionPoint } from "./ast/compute-import-insertion-point.ts";
import { onVisitNode } from "./ast/on-visit-node.ts";

export type { PreprocessTwMergeOptions } from "./options.ts";

function hasTwMergeImport({ module }: ParseResult, importName: string) {
  const { staticImports } = module ?? {};
  if (!staticImports?.length) return false;

  return staticImports.some(
    (importModules) =>
      importModules?.moduleRequest?.value === "tailwind-merge" &&
      importModules.entries?.some(
        (entry) => entry?.localName?.value === importName,
      ),
  );
}

const defaults: Required<PreprocessTwMergeOptions> = {
  include: /\.(jsx|tsx)$/,
  exclude: /node_modules/,
  handleDynamicClassName: false,
  twMergeImportSpecifier: "",
  oxcParserOptions: {},
  debug: false,
};

/**
 * Preprocess twMerge
 * @param userOptions For defaults, see {@link defaults} or {@link PreprocessTwMergeOptions}.
 * @returns @see {@link Plugin}
 * @see {@link PreprocessTwMergeOptions}
 * @example <caption>Basic usage</caption>
 *
 * ```ts
 * import { preprocessTwMerge } from "vite-plugin-preprocess-twmerge";
 * export default defineConfig({
 *   plugins: [
 *     preprocessTwMerge(),
 *   ],
 * });
 * ```
 *
 * @example <caption>Dynamic className evaluation</caption>
 *
 * ```ts
 * import { preprocessTwMerge } from "vite-plugin-preprocess-twmerge";
 * export default defineConfig({
 *  plugins: [
 *    // Enable dynamic className evaluation - injects twMerge() into className={...} expressions that cannot be evaluated statically.
 *    preprocessTwMerge({
 *      handleDynamicClassName: true,
 *      twMergeImportSpecifier: "twMerge",
 *    }),
 *  ],
 * });
 * ```
 *
 */
export function preprocessTwMerge(
  userOptions: PreprocessTwMergeOptions = {},
): Plugin {
  const options = { ...defaults, ...userOptions };

  return {
    name: "vite-plugin-preprocess-twmerge",
    enforce: "pre",
    transform(sourceCode: string, fileId: string) {
      if (!options.include.test(fileId) || options.exclude.test(fileId)) return;

      const edits: SourceEdit[] = [];
      const computedLanguage = fileId.split(".").pop() as ParserOptions["lang"];
      const language =
        (options.oxcParserOptions?.lang ??
        ["js", "jsx", "ts", "tsx", "dts"].includes(computedLanguage ?? ""))
          ? computedLanguage
          : "js";

      const parsedFile = parseSync(fileId, sourceCode, {
        lang: language,
        range: true,
      });
      const { program, module: moduleInfo } = parsedFile;
      const constants = collectConstantBindings(program, options);

      traverseAST(program, (node) =>
        onVisitNode({ node, options, constants, edits, fileId, sourceCode }),
      );
      if (!edits.length) return;
      if (
        options.handleDynamicClassName &&
        options.twMergeImportSpecifier &&
        !hasTwMergeImport(parsedFile, options.twMergeImportSpecifier)
      ) {
        // Adds the import { twMerge } from "tailwind-merge" statement to the top of the file.
        const insertPosition = computeImportInsertionPoint(
          sourceCode,
          program,
          moduleInfo,
        );
        edits.push({
          start: insertPosition,
          end: insertPosition,
          text: `import { ${options.twMergeImportSpecifier} } from "tailwind-merge";`,
        });
      }

      const result = transform(fileId, applySourceEdits(sourceCode, edits), {
        lang: language,
        jsx: "preserve",
        sourcemap: true,
      });

      if (result.errors?.length)
        console.warn(
          "[vite-plugin-preprocess-twmerge] OXC errors in",
          fileId,
          result.errors,
        );

      return result;
    },
  };
}
