import type { BBLookup } from "../../../types/forum";

const BBSelect: React.FC<{
  disabled?: boolean;
  value: number | undefined;
  options: BBLookup[];
}> = ({ disabled, value, options }) => {
  return (
    <select
      className="w-full p-2 bg-default border border-default flex-1/2"
      disabled={disabled || false}
      value={value}
    >
      {options.map((opt) => (
        <option value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

export default BBSelect;
