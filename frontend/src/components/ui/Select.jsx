import "./Select.css";

export const Select = ({
  id,
  options = [],
  value,
  onChange,
  className,
  placeholder,
  getOptionLabel,
  getOptionValue,
  ...rest
}) => {
  return (
    <select
      id={id}
      className={`select ${className}`}
      value={value}
      onChange={onChange}
      {...rest}
    >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}

      {options.map((opt) => (
        <option key={getOptionValue(opt)} value={getOptionValue(opt)}>
          {getOptionLabel(opt)}
        </option>
      ))}
    </select>
  );
};
