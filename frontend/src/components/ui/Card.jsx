import "./Card.css";

export const Card = ({ 
  children, 
  variant,
  className,
  ...rest 
}) => {
  return (
    <div className={`card ${variant} ${className}`} {...rest}>
      {children}
    </div>
  );
}
