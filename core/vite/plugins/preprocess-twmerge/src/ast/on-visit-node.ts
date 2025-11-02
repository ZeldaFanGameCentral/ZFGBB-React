import type { Node } from "@oxc-project/types";
import type { PreprocessTwMergeOptions } from "../options.ts";
import type { SourceEdit } from "./apply-source-edits.ts";
import { evaluateExpression } from "./evaluate-expression.ts";

import { twMerge } from "tailwind-merge";
export interface OnVisitNodeOptions {
  node: Node;
  options: PreprocessTwMergeOptions;
  constants: Map<string, string>;
  edits: SourceEdit[];
  fileId: string;
  sourceCode: string;
}
export function onVisitNode({
  node,
  options,
  constants,
  edits,
  fileId,
  sourceCode,
}: OnVisitNodeOptions) {
  if (
    node.type !== "JSXAttribute" ||
    node.name.type !== "JSXIdentifier" ||
    node.name.name !== "className" ||
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
    const text = `"${twMerge(evaluated)}"`;
    edits.push({
      start: container.start,
      end: container.end,
      text,
    });
    return;
  }

  if (options.debug)
    console.warn(
      `[vite-plugin-preprocess-twmerge] In [${fileId}]: cannot evaluate dynamic expression ${sourceCode.slice(container.start, container.end)}`,
    );

  if (!options.twMergeImportSpecifier) return;
  // fallback: wrap dynamic expression in twMerge()
  const inner = sourceCode.slice(container.start + 1, container.end - 1);
  edits.push({
    start: container.start,
    end: container.end,
    text: `{${options.twMergeImportSpecifier}(${inner})}`,
  });
}
