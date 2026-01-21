import "./Tooltip.css"

export const Tooltip = ({ label, children }) => {
  return (
    <span className="tooltip-wrapper">
      {children}
      <span className="tooltip">{label}</span>
    </span>
  )
}
