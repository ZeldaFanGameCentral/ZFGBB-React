import type { Plugin } from "vite";
import { twMerge } from "tailwind-merge";
import parser from "@babel/parser";

import babelTraverse from "@babel/traverse";
import babelGenerate from "@babel/generator";
import * as types from "@babel/types";
import type { Node, ArgumentPlaceholder } from "@babel/types";
import type { Scope } from "@babel/traverse";

// gm112 note: this is a type hack to workaround babel shipping with cjs
const traverse = (babelTraverse as unknown as { default: typeof babelTraverse })
  .default;
const generate = (babelGenerate as unknown as { default: typeof babelGenerate })
  .default;

function mergeClassesFromExpression(
  node: Node,
  scope: Scope,
  twMergeImportSepcifier: string,
): string {
  if (types.isTemplateLiteral(node))
    return node.quasis
      .map(({ value: { raw, cooked } }) => cooked ?? raw)
      .join(" ");

  if (types.isConditionalExpression(node))
    return [
      mergeClassesFromExpression(
        node.consequent,
        scope,
        twMergeImportSepcifier,
      ),
      mergeClassesFromExpression(node.alternate, scope, twMergeImportSepcifier),
    ].join(" ");

  if (types.isLogicalExpression(node))
    return [
      mergeClassesFromExpression(node.right, scope, twMergeImportSepcifier),
    ].join(" ");

  if (types.isArrayExpression(node))
    return node.elements
      .map((element) =>
        element
          ? mergeClassesFromExpression(
              element as Node,
              scope,
              twMergeImportSepcifier,
            )
          : "",
      )
      .join(" ");

  if (types.isBinaryExpression(node) && node.operator === "+")
    return (
      mergeClassesFromExpression(node.left, scope, twMergeImportSepcifier) +
      " " +
      mergeClassesFromExpression(node.right, scope, twMergeImportSepcifier)
    );

  if (types.isIdentifier(node)) {
    const binding = scope.getBinding(node.name);
    if (!binding) return "";
    const path = binding.path;
    if (
      path.isVariableDeclarator() &&
      path.parentPath.isVariableDeclaration() &&
      path.parentPath.node.kind === "const" // ignore let, var, etc.
    ) {
      const init = path.node.init;
      if (types.isStringLiteral(init)) return init.value;
      if (types.isTemplateLiteral(init) && init.expressions.length === 0)
        return init.quasis
          .map(({ value: { cooked, raw } }) => cooked ?? raw)
          .join("");
    }
  }

  return "";
  // gm112 note: I left this commented because I need to figure out how to detect promises here.
  // If so, then we can expand dynamic evaluation a bit. For now, just bail with an empty string
  // instead of trying to evaluate the dynamic function expression.

  // const node_is_dynamic =
  //   types.isCallExpression(node) && types.isIdentifier(node.callee);

  // if (!node_is_dynamic) return "";

  // return node.arguments
  //   .map((argument) =>
  //     mergeClassesFromExpression(
  //       argument as Node,
  //       scope,
  //       twMergeImportSepcifier,
  //     ),
  //   )
  //   .join(" ");
}

const preprocessTwMergeOptions = {
  include: /\.(jsx|tsx)$/,
  exclude: /node_modules/,
  handleDynamicClassName: false,
  twMergeImportSepcifier: "",
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
  handleDynamicClassName = preprocessTwMergeOptions.handleDynamicClassName,
  twMergeImportSepcifier = preprocessTwMergeOptions.twMergeImportSepcifier,
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
          Program(path) {
            if (!handleDynamicClassName || !twMergeImportSepcifier) return;
            const hasTwMergeBeenImported = path.node.body.some(
              (node) =>
                types.isImportDeclaration(node) &&
                node.source.value === "tailwind-merge",
            );
            if (hasTwMergeBeenImported) return;

            // Add import twMerge from "tailwind-merge";
            path.node.body.unshift(
              types.importDeclaration(
                [
                  types.importDefaultSpecifier(
                    types.identifier(twMergeImportSepcifier),
                  ),
                ],
                types.stringLiteral("tailwind-merge"),
              ),
            );
          },
          JSXAttribute({ node, scope }) {
            const attribute = node?.value;
            if (node.name.name !== "className" || !attribute) return;
            // className="..."
            if (types.isStringLiteral(attribute))
              node.value = types.stringLiteral(twMerge(attribute.value));

            if (
              !handleDynamicClassName ||
              !types.isJSXExpressionContainer(attribute) ||
              !twMergeImportSepcifier
            )
              return;

            // className={...}
            const rawClasses = mergeClassesFromExpression(
              attribute.expression,
              scope,
              twMergeImportSepcifier,
            );

            if (!rawClasses?.trim()) return;

            node.value = types.jsxExpressionContainer(
              types.callExpression(types.identifier(twMergeImportSepcifier), [
                attribute.expression as unknown as ArgumentPlaceholder,
              ]),
            );
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
