import type { Node } from "@oxc-project/types";
export function traverseAST(
  node: Node | null | undefined,
  onVisit: (node: Node, parent: Node | null) => void,
  parent: Node | null = null,
) {
  if (
    !node ||
    (typeof node === "object" && !("type" in node)) ||
    !Array.isArray(node)
  )
    return;

  // FIXME: Create a symbol of the node so we can track its changes. This would allow us to avoid unnecessary re-evaluation of the expression, and to keep AST modifications in sync with the original source code.
  onVisit(node, parent);
  for (const value of Object.values(node)) traverseAST(value, onVisit, node);
}
