import "./Avatar.css";

export const Avatar = ({ src, alt = "", size = 40, className }) => {
  return (
    <div
      className={`avatar ${className ?? ""}`}
      style={{ width: size, height: size, fontSize: size / 2.5 }}
      role="img"
      aria-label={alt}
    >
      {src ? <img src={src} alt={alt} /> : alt.charAt(0).toUpperCase()}
    </div>
  );
};
