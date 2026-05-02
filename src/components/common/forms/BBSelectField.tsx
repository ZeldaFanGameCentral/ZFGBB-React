import { firstError } from "./utils";

import { useField } from "@tanstack/react-form";
import { useBBFormContext } from "./BBForm";

export type BBSelectOption = {
  value: string;
  label: string;
};

type BBSelectFieldProps = {
  name: string;
  label: string;
  options: BBSelectOption[];
  helperText?: string;
  disabled?: boolean;
};

export default function BBSelectField({
  name,
  label,
  options,
  helperText,
  disabled,
}: BBSelectFieldProps) {
  const form = useBBFormContext();
  const field = useField({ form, name });
  const error = firstError(field.state.meta.errors);
  const showError = field.state.meta.isTouched && !!error;

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-muted">
        {label}
      </label>
      <select
        id={name}
        name={name}
        disabled={disabled}
        className={`w-full p-2 bg-default border ${
          showError ? "border-highlighted" : "border-default"
        }`}
        value={String(field.state.value ?? "")}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {showError ? (
        <p className="text-xs text-highlighted">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-dimmed">{helperText}</p>
      ) : null}
    </div>
  );
}
