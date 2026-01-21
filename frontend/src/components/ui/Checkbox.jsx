import "./Checkbox.css";

export const Checkbox = ({ checked, onChange, label }) => {
  return (
    <label className="checkbox-container">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="checkmark"></span>
      {label && <p>{label}</p>}
    </label>
  );
};
