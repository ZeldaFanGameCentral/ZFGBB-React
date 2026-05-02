export interface BBInputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelComponent?: never;
  error?: string;
  helperText?: string;
}

export interface BBInputWithLabelComponentProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: never;
  labelComponent?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export type BBInputProps =
  | BBInputWithLabelProps
  | BBInputWithLabelComponentProps;

export default function BBInput({
  className,
  type,
  name,
  label,
  labelComponent,
  error,
  helperText,
  ...props
}: BBInputProps) {
  return (
    <div className="space-y-1">
      {labelComponent ? (
        labelComponent
      ) : (
        <label htmlFor={name} className="block text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        className={`w-full p-2 bg-default border ${error ? "border-highlighted" : "border-default"} ${className ?? ""}`}
        name={name}
        {...props}
      />
      {error ? (
        <p className="text-xs text-highlighted">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-dimmed">{helperText}</p>
      ) : null}
    </div>
  );
}
