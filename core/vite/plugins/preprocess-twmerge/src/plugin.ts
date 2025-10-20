import type { Plugin } from "vite";
import { twMerge } from "tailwind-merge";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import {
  isArrayExpression,
  isCallExpression,
  isConditionalExpression,
  isIdentifier,
  isJSXExpressionContainer,
  isLogicalExpression,
  isStringLiteral,
  isTemplateLiteral,
  stringLiteral,
  type Node,
} from "@babel/types";

function mergeClassesFromExpression(node: Node): string {
  if (isStringLiteral(node)) return node.value;

  if (isTemplateLiteral(node))
    return node.quasis.map(({ value: { raw } }) => raw).join(" ");

  if (isConditionalExpression(node))
    return [
      mergeClassesFromExpression(node.consequent),
      mergeClassesFromExpression(node.alternate),
    ].join(" ");

  if (isLogicalExpression(node))
    return [mergeClassesFromExpression(node.right)].join(" ");

  if (isArrayExpression(node))
    return node.elements
      .map((element) =>
        element ? mergeClassesFromExpression(element as Node) : "",
      )
      .join(" ");

  const node_is_clsx_or_classnames =
    isCallExpression(node) &&
    isIdentifier(node.callee) &&
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
}: PreprocessTwMergeOptions): Plugin[] {
  return [
    {
      name: "vite-plugin-preprocess-twmerge",
      enforce: "pre",
      transform(code, id) {
        if (!include.test(id) || exclude.test(id)) return;

        const ZeldaAncientStoneTablets = parse(code, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
          sourceFilename: id,
        }); //babel AST

        traverse(ZeldaAncientStoneTablets, {
          JSXAttribute(path) {
            const expression = path.node?.value;
            if (path.node.name.name !== "className" || !expression) return;

            // className="..."
            if (isStringLiteral(expression))
              path.node.value = stringLiteral(twMerge(expression.value));

            if (!isJSXExpressionContainer(expression)) return;

            // className={...}
            const rawClasses = mergeClassesFromExpression(
              expression.expression,
            );
            path.node.value = stringLiteral(twMerge(rawClasses));
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
