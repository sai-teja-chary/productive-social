import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Tooltip } from "./Tooltip"
import "./BackButton.css"

export const BackButton = ({
  to = -1,
  label = "Go back",
  size = 28,
  className = ""
}) => {
  const navigate = useNavigate()

  return (
    <Tooltip label={label}>
      <ArrowLeft
        className={`back-arrow ${className}`}
        size={size}
        onClick={() => navigate(to)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate(to)
        }}
      />
    </Tooltip>
  )
}
