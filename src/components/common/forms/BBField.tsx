import { useField } from "@tanstack/react-form";
import { useBBFormContext } from "./BBForm";
import BBInput from "./BBInput";

type BBFieldProps = {
  name: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  helperText?: string;
  autoComplete?: string;
  placeholder?: string;
};

export default function BBField({
  name,
  label,
  type = "text",
  helperText,
  autoComplete,
  placeholder,
}: BBFieldProps) {
  const form = useBBFormContext();
  const field = useField({ form, name });
  const error = firstError(field.state.meta.errors);
  const showError = field.state.meta.isTouched && !!error;

  return (
    <BBInput
      label={label}
      name={name}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      helperText={helperText}
      error={showError ? error : undefined}
      value={(field.state.value as string | number | undefined) ?? ""}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
    />
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
