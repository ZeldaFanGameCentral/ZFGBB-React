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
  oxcParserOptions?: Pick<ParserOptions, "lang" | "sourceType">;
  debug?: boolean;
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
    else traverseAST(value, onVisit, node);
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
  options: PreprocessTwMergeOptions,
): string | undefined {
  if (!expression) return;

  switch (expression.type) {
    case "Literal": {
      return String(expression.value);
    }
    case "Identifier": {
      return constantBindings.get(expression.name);
    }
    case "TemplateLiteral": {
      const classNames: string[] = [];

      for (const [index, subQuasis] of expression.quasis.entries()) {
        const subExpression = expression.expressions[index];
        if (!subExpression || subQuasis.value.cooked?.trim()) continue;
        const evaluated = evaluateExpression(
          subExpression,
          constantBindings,
          options,
        );
        if (!evaluated) continue;

        classNames.push(subQuasis.value.cooked!.trim());
        classNames.push(evaluated);
      }

      if (classNames.length === 0) return;
      return classNames.join(" ");
    }

    case "BinaryExpression": {
      if (expression.operator !== "+") return;
      const left = evaluateExpression(
        expression.left,
        constantBindings,
        options,
      );
      const right = evaluateExpression(
        expression.right,
        constantBindings,
        options,
      );
      if (!left || !right) return;
      return `${left} ${right}`.trim();
    }
    case "LogicalExpression": {
      const left = evaluateExpression(
        expression.left,
        constantBindings,
        options,
      );
      const right = evaluateExpression(
        expression.right,
        constantBindings,
        options,
      );
      if (expression.operator === "&&") return right ?? "";
      if (expression.operator === "||") return left ?? right;
      return;
    }
  }

  if (!options.handleDynamicClassName) return;

  switch (expression.type) {
    case "ArrayExpression": {
      return expression.elements
        .map((subExpression) =>
          evaluateExpression(subExpression, constantBindings, options),
        )
        .join(" ");
    }
    case "ObjectExpression": {
      return expression.properties
        .map((property) => {
          if (property.type === "SpreadElement") {
            return evaluateExpression(
              property.argument,
              constantBindings,
              options,
            );
          } else {
            return evaluateExpression(
              property.value,
              constantBindings,
              options,
            );
          }
        })
        .join(" ");
    }
  }
}

function collectConstantBindings(
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

const defaults: Required<PreprocessTwMergeOptions> = {
  include: /\.(jsx|tsx)$/,
  exclude: /node_modules/,
  handleDynamicClassName: false,
  twMergeImportSpecifier: "",
  oxcParserOptions: {},
  debug: false,
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

      const edits: SourceEdit[] = [];
      const computedLanguage = fileId.split(".").pop() as ParserOptions["lang"];
      const language =
        (options.oxcParserOptions?.lang ??
        ["js", "jsx", "ts", "tsx", "dts"].includes(computedLanguage ?? ""))
          ? computedLanguage
          : "js";

      const parsedFile = parseSync(fileId, sourceCode, {
        lang: language,
        range: true,
      });
      const { program, module: moduleInfo } = parsedFile;
      const constants = collectConstantBindings(program, options);

      traverseAST(program, (node) => {
        if (
          node.type !== "JSXAttribute" ||
          node.name.name !== "className" ||
          node.name.type !== "JSXIdentifier" ||
          !node.value
        )
          return;

        const container = node.value;
        const evaluated = evaluateExpression(
          container.type === "JSXExpressionContainer"
            ? container.expression
            : container,
          constants,
          options,
        );

        if (evaluated) {
          const merged = twMerge(evaluated);
          edits.push({
            start: container.start,
            end: container.end,
            text: `"${merged}"`,
          });
          return;
        }

        if (options.debug)
          console.warn(
            `[vite-plugin-preprocess-twmerge] In [${fileId}]: cannot evaluate dynamic expression ${sourceCode.slice(container.start, container.end)}`,
          );

        if (!options.handleDynamicClassName && !options.twMergeImportSpecifier)
          return;

        // fallback: wrap dynamic expression in twMerge()
        const inner = sourceCode.slice(container.start + 1, container.end - 1);
        edits.push({
          start: container.start,
          end: container.end,
          text: `{${options.twMergeImportSpecifier}(${inner})}`,
        });
      });

      if (!edits.length) return;

      if (
        options.handleDynamicClassName &&
        options.twMergeImportSpecifier &&
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
          text: `import { ${options.twMergeImportSpecifier} } from "tailwind-merge";`,
        });
      }

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
