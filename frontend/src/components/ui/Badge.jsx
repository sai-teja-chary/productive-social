import "./Badge.css";

export const Badge = ({ label, variant, icon, onClick }) => {
  return <span onClick={onClick} className={`badge ${variant}`}>
    {typeof icon === "string" ? (
      <img src={icon} alt="icon" className="icon" />
    ) : (
      icon
    )}

    {label}
  </span>;
}
