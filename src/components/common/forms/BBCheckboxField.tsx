import { useField } from "@tanstack/react-form";
import { useBBFormContext } from "./BBForm";

type BBCheckboxFieldProps = {
  name: string;
  label: React.ReactNode;
  helperText?: string;
  labelClassName?: string;
};

export default function BBCheckboxField({
  name,
  label,
  helperText,
  labelClassName,
}: BBCheckboxFieldProps) {
  const form = useBBFormContext();
  const field = useField({ form, name });
  const error = firstError(field.state.meta.errors);
  const showError = field.state.meta.isTouched && !!error;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={Boolean(field.state.value)}
          onChange={(e) => field.handleChange(e.target.checked)}
          onBlur={field.handleBlur}
        />
        <label
          htmlFor={name}
          className={labelClassName ?? "text-sm font-medium text-muted"}
        >
          {label}
        </label>
      </div>
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
