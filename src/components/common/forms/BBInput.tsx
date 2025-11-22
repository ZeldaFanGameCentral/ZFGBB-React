export interface BBInputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelComponent?: never;
}

export interface BBInputWithLabelComponentProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: never;
  labelComponent?: React.ReactNode;
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
  ...props
}: BBInputProps) {
  return (
    <>
      {labelComponent ? (
        labelComponent
      ) : (
        <label htmlFor={name} className="block text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full p-2 bg-default border border-default ${className}`}
        name={name}
        {...props}
      />
    </>
  );
}
