interface BBTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function BBTextInput({
  name,
  label,
  placeholder,
  required,
  type,
  value,
  onChange,
}: BBTextInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-muted">
        {label}
      </label>
      <input
        className="w-full p-3 bg-default border border-default  resize-y focus:outline-none focus:ring-2 focus:ring-accented"
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
