import type { Program, JSXIdentifier } from "oxc-parser";
import type { PreprocessTwMergeOptions } from "../options.ts";
import { evaluateExpression } from "./evaluate-expression.ts";
import { traverseAST } from "./traverse-ast.ts";

export function collectConstantBindings(
  program: Program,
  options: PreprocessTwMergeOptions,
) {
  const bindings = new Map<string, string>();
  traverseAST(program, (node) => {
    if (node.type !== "VariableDeclarator" || !node.init) return;
    const name = (node.id as unknown as JSXIdentifier)?.name;
    if (!name) return;

    const value = evaluateExpression(node.init, bindings, options);
    if (value) bindings.set(name, value);
  });

  return bindings;
}
