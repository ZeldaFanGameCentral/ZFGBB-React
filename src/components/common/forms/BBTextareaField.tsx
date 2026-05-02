import { useField } from "@tanstack/react-form";
import { useBBFormContext } from "./BBForm";

type BBTextareaFieldProps = {
  name: string;
  label?: string;
  rows?: number;
  helperText?: string;
  placeholder?: string;
};

export default function BBTextareaField({
  name,
  label,
  rows = 10,
  helperText,
  placeholder,
}: BBTextareaFieldProps) {
  const form = useBBFormContext();
  const field = useField({ form, name });
  const error = firstError(field.state.meta.errors);
  const showError = field.state.meta.isTouched && !!error;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={`w-full p-3 bg-default border ${
          showError ? "border-highlighted" : "border-default"
        } resize-y focus:outline-none focus:ring-2 focus:ring-accented`}
        value={String(field.state.value ?? "")}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {showError ? (
        <p className="text-xs text-highlighted">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-dimmed">{helperText}</p>
      ) : null}
    </div>
  );
}

function firstError(errors: unknown[]): string | undefined {
  for (const error of errors) {
    if (!error) continue;
    if (typeof error === "string") return error;
    if (typeof error === "object" && error !== null && "message" in error) {
      const { message } = error;
      return `${message}`;
    }
  }
  return undefined;
}
