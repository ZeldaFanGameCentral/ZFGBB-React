import type { Node } from "@oxc-project/types";
import type { PreprocessTwMergeOptions } from "../options.ts";

/**
 * Walks the AST and evaluates expressions that can be statically evaluated.
 * @param expression The expression to evaluate.
 * @param constantBindings A map of constant bindings for the current program.
 * @param options @see {@link PreprocessTwMergeOptions}
 * @returns The evaluated expression, or undefined/empty string if the expression cannot be statically evaluated.
 */
export function evaluateExpression(
  expression: Node | null | undefined,
  constantBindings: Map<string, string>,
  options: PreprocessTwMergeOptions,
): string | undefined {
  if (!expression) return;

  // FIXME: This code could inject the {className} expression back into the JSX attribute, rather than returning undefined or empty string.
  // This would make the ergonomics of the plugins behavior better, since it could do safer deep evaluation of the template expressions.
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
        if (!subExpression) continue;
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

  // Try to expand additional expressions to strings.
  switch (expression.type) {
    case "ArrayExpression": {
      const classNames = expression.elements
        .map((subExpression) =>
          evaluateExpression(subExpression, constantBindings, options),
        )
        .join(" ");

      if (classNames.trim()) return classNames;
      return;
    }
    case "ObjectExpression": {
      const classNames = expression.properties
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

      if (classNames.trim()) return classNames;
      return;
    }
  }
}
