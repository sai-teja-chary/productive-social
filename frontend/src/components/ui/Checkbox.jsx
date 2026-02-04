import "./Checkbox.css"


export const Checkbox = ({ completed, onChange, label, disabled = false }) => {
  return (
    <label className="checkbox-container">
      <input
        type="checkbox"
        checked={completed}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="checkmark"></span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};
