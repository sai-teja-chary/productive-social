import "./Input.css";
import { Button } from "./Button";

export const Input = ({
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onClick,
  className,
  icon = "",
  ...rest
}) => {
  return (
    <div className="input-wrapper">
      <input
        id={id}
        className={`input ${className ?? ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {icon && onClick && (
        <Button
          className="input-icon"
          onClick={onClick}
          aria-label="Toggle input visibility"
        >
          <img src={icon} alt="" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
};
