import { useId } from "react";
import "./Tooltip.css";

export const Tooltip = ({ label, children }) => {
  const id = useId();

  return (
    <span className="tooltip-wrapper" aria-describedby={id}>
      {children}
      <span role="tooltip" id={id} className="tooltip">
        {label}
      </span>
    </span>
  );
};
