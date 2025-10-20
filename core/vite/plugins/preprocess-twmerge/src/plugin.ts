import type { Plugin } from "vite";
import { twMerge } from "tailwind-merge";
import parser from "@babel/parser";

import babelTraverse from "@babel/traverse";
import babelGenerate from "@babel/generator";
import * as types from "@babel/types";
import type { Node } from "@babel/types";

// gm112 note: this is a type hack to workaround babel shipping with cjs
const traverse = (babelTraverse as unknown as { default: typeof babelTraverse })
  .default;
const generate = (babelGenerate as unknown as { default: typeof babelGenerate })
  .default;

function mergeClassesFromExpression(node: Node): string {
  if (types.isStringLiteral(node)) return node.value;

  if (types.isTemplateLiteral(node))
    return node.quasis
      .map(({ value: { raw, cooked } }) => cooked ?? raw)
      .join(" ");

  if (types.isConditionalExpression(node))
    return [
      mergeClassesFromExpression(node.consequent),
      mergeClassesFromExpression(node.alternate),
    ].join(" ");

  if (types.isLogicalExpression(node))
    return [mergeClassesFromExpression(node.right)].join(" ");

  if (types.isArrayExpression(node))
    return node.elements
      .map((element) =>
        element ? mergeClassesFromExpression(element as Node) : "",
      )
      .join(" ");

  const node_is_clsx_or_classnames =
    types.isCallExpression(node) &&
    types.isIdentifier(node.callee) &&
    ["clsx", "classnames"].includes(node.callee.name);

  if (!node_is_clsx_or_classnames) return "";

  return node.arguments
    .map((arg) => mergeClassesFromExpression(arg as Node))
    .join(" ");
}

const preprocessTwMergeOptions = {
  include: /\.(jsx|tsx)$/,
  exclude: /node_modules/,
};

export type PreprocessTwMergeOptions = Partial<typeof preprocessTwMergeOptions>;

/**
 * This plugin will preprocess tailwind merge on React components, so that it
 * does not have to be done at runtime.
 * @returns
 */
export function preprocessTwMerge({
  include = preprocessTwMergeOptions.include,
  exclude = preprocessTwMergeOptions.exclude,
}: PreprocessTwMergeOptions = {}): Plugin[] {
  return [
    {
      name: "vite-plugin-preprocess-twmerge",
      enforce: "pre",
      transform(code, id) {
        if (!include.test(id) || exclude.test(id)) return;

        const ZeldaAncientStoneTablets = parser.parse(code, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
          sourceFilename: id,
        }); //babel AST

        traverse(ZeldaAncientStoneTablets, {
          JSXAttribute(path) {
            const expression = path.node?.value;
            if (path.node.name.name !== "className" || !expression) return;

            // className="..."
            if (types.isStringLiteral(expression))
              path.node.value = types.stringLiteral(twMerge(expression.value));

            if (!types.isJSXExpressionContainer(expression)) return;

            // className={...}
            const rawClasses = mergeClassesFromExpression(
              expression.expression,
            );

            if (!rawClasses?.trim()) return;
            path.node.value = types.stringLiteral(twMerge(rawClasses));
          },
        });

        const result = generate(
          ZeldaAncientStoneTablets,
          {
            sourceMaps: true,
            sourceFileName: id,
          },
          code,
        );
        return { code: result.code, map: result.map };
      },
    },
  ];
}
