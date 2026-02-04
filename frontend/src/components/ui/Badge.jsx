import "./Badge.css";

export const Badge = ({ label, variant, icon, onClick }) => {
  const content = (
    <>
      {typeof icon === "string" ? (
        <img src={icon} alt="" aria-hidden="true" className="icon" />
      ) : (
        icon
      )}
      {label}
    </>
  );

  // Interactive badge
  if (onClick) {
    return (
      <button type="button" className={`badge ${variant}`} onClick={onClick}>
        {content}
      </button>
    );
  }

  // Informational badge
  return <span className={`badge ${variant}`}>{content}</span>;
};
