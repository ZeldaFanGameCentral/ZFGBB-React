import type { Plugin } from "vite";
import { parseSync, type ParseResult, type ParserOptions } from "oxc-parser";
import { transform } from "oxc-transform";
import { twMerge } from "tailwind-merge";

import { traverseAST } from "./ast/traverse-ast.js";
import type { PreprocessTwMergeOptions } from "./options.js";
import { evaluateExpression } from "./ast/evaluate-expression.js";
import { applySourceEdits, type SourceEdit } from "./ast/apply-source-edits.js";
import { collectConstantBindings } from "./ast/collect-constant-bindings.js";
import { computeImportInsertionPoint } from "./ast/compute-import-insertion-point.js";

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
 * @example
 *
 * <details>
 * <caption>Basic usage</caption>
 * ```ts
 * import { preprocessTwMerge } from "vite-plugin-preprocess-twmerge";
 * export default defineConfig({
 *   plugins: [
 *     preprocessTwMerge(),
 *   ],
 * });
 * ```
 * </details>
 *
 * @example
 *
 * <details>
 * <caption>Dynamic className evaluation</caption>
 * ```ts
 * import { preprocessTwMerge } from "vite-plugin-preprocess-twmerge";
 * export default defineConfig({
 *   plugins: [
 *     // Enable dynamic className evaluation - injects twMerge() into className={...} expressions that cannot be evaluated statically.
 *     preprocessTwMerge({
 *       handleDynamicClassName: true,
 *       twMergeImportSpecifier: "twMerge",
 *     }),
 *   ],
 * });
 * ```
 * </details>
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

      traverseAST(program, (node) => {
        if (
          node.type !== "JSXAttribute" ||
          node.name.name !== "className" ||
          node.name.type !== "JSXIdentifier" ||
          !node.value
        )
          return; // We only care about className attributes in JSX attributes, so skip anything else

        const container = node.value;
        const evaluated = evaluateExpression(
          container.type === "JSXExpressionContainer"
            ? container.expression
            : container,
          constants,
          options,
        );

        // If the expression is not statically evaluable, it will be undefined or empty.
        // If handleDynamicClassName is true, evaluateExpression will try to use additional logic to evaluate the expression.
        // If twMergeImportSpecifier is set, it will try to import twMerge and use it, on fallback. Otherwise, it will just skip and do nothing.
        if (evaluated) {
          const merged = twMerge(evaluated);
          edits.push({
            start: container.start,
            end: container.end,
            text: `"${merged}"`,
          });
          return;
        }

        if (options.debug)
          console.warn(
            `[vite-plugin-preprocess-twmerge] In [${fileId}]: cannot evaluate dynamic expression ${sourceCode.slice(container.start, container.end)}`,
          );

        if (!options.handleDynamicClassName && !options.twMergeImportSpecifier)
          return;

        // fallback: wrap dynamic expression in twMerge()
        const inner = sourceCode.slice(container.start + 1, container.end - 1);
        edits.push({
          start: container.start,
          end: container.end,
          text: `{${options.twMergeImportSpecifier}(${inner})}`,
        });
      });

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
