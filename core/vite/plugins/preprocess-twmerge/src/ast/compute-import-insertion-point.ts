import type { Program } from "@oxc-project/types";
import type { EcmaScriptModule } from "oxc-parser";

export function computeImportInsertionPoint(
  sourceCode: string,
  program: Program,
  moduleInfo?: EcmaScriptModule,
) {
  let position = 0;
  if (program.hashbang) {
    position = program.hashbang.end;
    if (sourceCode[position] !== "\n") position++;
  }

  const staticImports = moduleInfo?.staticImports ?? [];
  if (staticImports.length > 0) {
    const lastImportEnd = Math.max(...staticImports.map((i) => i.end));
    position = Math.max(position, lastImportEnd);
    if (sourceCode[position] !== "\n") position++;
    return position;
  }

  for (const statement of program.body) {
    if (statement.type !== "ExpressionStatement" || !statement.directive) break;
    position = Math.max(position, statement.end);
    if (sourceCode[position] !== "\n") position++;
  }

  return position;
}
