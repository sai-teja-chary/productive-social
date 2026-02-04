import "./TextArea.css";

export const TextArea = ({
  id,
  placeholder = "",
  value,
  onChange,
  className = "",
  rows = 4,
  ...rest
}) => {
  return (
    <textarea
      id={id}
      className={`textarea ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      {...rest}
    ></textarea>
  );
};
