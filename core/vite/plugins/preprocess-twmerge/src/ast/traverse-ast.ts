import type { Node } from "@oxc-project/types";
export function traverseAST(
  node: Node | null | undefined,
  onVisit: (node: Node, parent: Node | null) => void,
  parent: Node | null = null,
) {
  if (!node || typeof node !== "object") return;
  onVisit(node, parent);

  for (const value of Object.values(node)) {
    if (Array.isArray(value))
      for (const child of value) traverseAST(child, onVisit, node);
    else traverseAST(value, onVisit, node);
  }
}
