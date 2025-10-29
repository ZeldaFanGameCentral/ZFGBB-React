import type { Plugin } from "vite";
import type { Program, Node, JSXIdentifier, Span } from "@oxc-project/types";

import {
  parseSync,
  type ParseResult,
  type EcmaScriptModule,
  type ParserOptions,
} from "oxc-parser";
import { transform } from "oxc-transform";

import { twMerge } from "tailwind-merge";

export interface PreprocessTwMergeOptions {
  include?: RegExp;
  exclude?: RegExp;
  handleDynamicClassName?: boolean;
  twMergeImportSpecifier?: string;
}

interface SourceEdit extends Span {
  text: string;
}

function applySourceEdits(sourceCode: string, edits: SourceEdit[]) {
  if (edits.length === 0) return sourceCode;

  const sortedEdits = edits.sort((a, b) => a.start - b.start);
  let output = "";
  let cursor = 0;
  let lastEditEnd = -1;

  for (const edit of sortedEdits) {
    if (edit.start < lastEditEnd)
      throw new Error(`Overlapping edits near ${edit.start}-${edit.end}`);
    output += sourceCode.slice(cursor, edit.start) + edit.text;
    cursor = edit.end;
    lastEditEnd = edit.end;
  }

  return output + sourceCode.slice(cursor);
}

function traverseAST(
  node: Node | null | undefined,
  onVisit: (node: Node, parent: Node | null) => void,
  parent: Node | null = null,
) {
  if (!node || typeof node !== "object") return;
  onVisit(node, parent);

  for (const value of Object.values(node)) {
    if (Array.isArray(value))
      for (const child of value) traverseAST(child, onVisit, node);
    else if (value && typeof value === "object" && "type" in value)
      traverseAST(value, onVisit, node);
  }
}

function hasTwMergeImport({ module }: ParseResult, importName: string) {
  const { staticImports } = module ?? {};
  if (!staticImports?.length) return false;

  return staticImports.some(
    (importDecl) =>
      importDecl?.moduleRequest?.value === "tailwind-merge" &&
      importDecl.entries?.some(
        (entry) => entry?.localName?.value === importName,
      ),
  );
}

function computeImportInsertionPoint(
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

function evaluateExpression(
  expression: Node | null | undefined,
  constantBindings: Map<string, string>,
): string | undefined {
  if (!expression) return;

  switch (expression.type) {
    case "Literal": {
      return typeof expression.value === "string"
        ? expression.value
        : undefined;
    }

    case "TemplateLiteral": {
      return expression.quasis
        .map((part) => part.value.cooked ?? part.value.raw ?? "")
        .join(" ");
    }

    case "BinaryExpression": {
      if (expression.operator !== "+") return;
      const left = evaluateExpression(expression.left, constantBindings);
      const right = evaluateExpression(expression.right, constantBindings);
      if (!left || !right) return;
      return `${left} ${right}`.trim();
    }

    case "LogicalExpression": {
      const left = evaluateExpression(expression.left, constantBindings);
      const right = evaluateExpression(expression.right, constantBindings);
      if (expression.operator === "&&") return right ?? "";
      if (expression.operator === "||") return left ?? right;
      return;
    }

    case "ConditionalExpression": {
      const consequent = evaluateExpression(
        expression.consequent,
        constantBindings,
      );
      const alternate = evaluateExpression(
        expression.alternate,
        constantBindings,
      );
      if (consequent && alternate) return `${consequent} ${alternate}`.trim();
      return consequent ?? alternate;
    }

    case "Identifier": {
      return constantBindings.get(expression.name);
    }
  }
}

function collectConstantBindings(program: Program) {
  const bindings = new Map<string, string>();

  traverseAST(program, (node) => {
    if (node.type !== "VariableDeclarator") return;

    const name = (node.id as unknown as JSXIdentifier)?.name;
    if (!name || !node.init) return;

    const value = evaluateExpression(node.init, bindings);
    if (!value) return;

    bindings.set(name, value);
  });

  return bindings;
}

const defaults: Required<PreprocessTwMergeOptions> = {
  include: /\.(jsx|tsx)$/,
  exclude: /node_modules/,
  handleDynamicClassName: false,
  twMergeImportSpecifier: "",
};

export function preprocessTwMerge(
  userOptions: PreprocessTwMergeOptions = {},
): Plugin {
  const options = { ...defaults, ...userOptions };

  return {
    name: "vite-plugin-preprocess-twmerge",
    enforce: "pre",
    transform(sourceCode: string, fileId: string) {
      if (!options.include.test(fileId) || options.exclude.test(fileId)) return;

      const language = fileId.replaceAll(".", "") as ParserOptions["lang"];
      const parsedFile = parseSync(fileId, sourceCode, {
        lang: language,
        sourceType: "module",
        range: true,
      });

      const { program, module: moduleInfo } = parsedFile;

      const edits: SourceEdit[] = [];
      const constants = collectConstantBindings(program);

      traverseAST(program, (node) => {
        if (node.type !== "JSXAttribute") return;

        const jsxIdentifierThing = node.name;
        if (
          jsxIdentifierThing?.type !== "JSXIdentifier" ||
          jsxIdentifierThing.name !== "className"
        )
          return;
        if (!node.value) return;

        if (node.value.type === "Literal") {
          const literal = node.value;
          if (typeof literal.value !== "string") return;

          const merged = twMerge(literal.value);
          const quote = sourceCode[literal.start] ?? '"';
          edits.push({
            start: literal.start,
            end: literal.end,
            text: `${quote}${merged}${quote}`,
          });
          return;
        }

        if (
          node.value.type !== "JSXExpressionContainer" ||
          !options.handleDynamicClassName
        )
          return;

        const container = node.value;
        const evaluated = evaluateExpression(container.expression, constants);

        if (evaluated) {
          const merged = twMerge(evaluated);
          edits.push({
            start: container.start,
            end: container.end,
            text: `"${merged}"`,
          });
          return;
        }

        if (!options.twMergeImportSpecifier) return;

        // fallback: wrap dynamic expression in twMerge()
        const inner = sourceCode.slice(container.start + 1, container.end - 1);
        edits.push({
          start: container.start,
          end: container.end,
          text: `{${options.twMergeImportSpecifier}(${inner})}`,
        });
      });

      if (
        options.handleDynamicClassName &&
        !hasTwMergeImport(parsedFile, options.twMergeImportSpecifier)
      ) {
        const insertPosition = computeImportInsertionPoint(
          sourceCode,
          program,
          moduleInfo,
        );
        edits.push({
          start: insertPosition,
          end: insertPosition,
          text: `import { ${options.twMergeImportSpecifier} } from 'tailwind-merge';`,
        });
      }

      if (edits.length === 0) return;
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
