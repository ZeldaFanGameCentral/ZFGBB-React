import type { Plugin } from "vite";
import { twMerge } from "tailwind-merge";
import parser from "@babel/parser";

import babelTraverse from "@babel/traverse";
import babelGenerate from "@babel/generator";
import * as types from "@babel/types";
import type { Node, ArgumentPlaceholder } from "@babel/types";
import type { Scope } from "@babel/traverse";

// gm112 note: this is a type hack to workaround babel shipping with cjs
const traverse =
  (babelTraverse as unknown as { default: typeof babelTraverse }).default ??
  babelTraverse;
const generate =
  (babelGenerate as unknown as { default: typeof babelGenerate }).default ??
  babelGenerate;

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
    const { path } = scope.getBinding(node.name) ?? {};
    const isConstIdentifier =
      !!path &&
      path.isVariableDeclarator() &&
      path.parentPath.isVariableDeclaration() &&
      path.parentPath.node.kind === "const"; // ignore let, var, etc.

    if (!isConstIdentifier) return "";

    const init = path.node.init;
    if (types.isStringLiteral(init)) return init.value;
    else
      return mergeClassesFromExpression(
        init as Node,
        scope,
        twMergeImportSepcifier,
      );
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

        // Heheh, AST? Ancient Stone Tablets! Mwahaha.
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
              !twMergeImportSepcifier ||
              !types.isJSXExpressionContainer(attribute)
            )
              return;

            if (types.isLogicalExpression(attribute.expression)) {
              // This is a logical expression, so we need to evaluate both sides and update the expression.
              const left = mergeClassesFromExpression(
                attribute.expression.left,
                scope,
                twMergeImportSepcifier,
              );
              const right = mergeClassesFromExpression(
                attribute.expression.right,
                scope,
                twMergeImportSepcifier,
              );
              node.value = types.jsxExpressionContainer(
                types.logicalExpression(
                  attribute.expression.operator,
                  types.callExpression(
                    types.identifier(twMergeImportSepcifier),
                    [types.stringLiteral(left)],
                  ),
                  types.callExpression(
                    types.identifier(twMergeImportSepcifier),
                    [types.stringLiteral(right)],
                  ),
                ),
              );
              return;
            }

            // className={...}
            const rawClasses = mergeClassesFromExpression(
              attribute.expression,
              scope,
              twMergeImportSepcifier,
            );

            if (!rawClasses?.trim()) return;
            // This injects the twMerge() call into the JSX className attribute.
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
