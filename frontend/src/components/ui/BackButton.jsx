import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";
import "./BackButton.css";

export const BackButton = ({
  fallback = "/", // safer than hardcoding
  label = "Go back",
  size = 30,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    const idx = window.history.state?.idx ?? 0;

    if (idx > 0) {
      navigate(-1); // 🔒 stays inside app
    } else {
      navigate(fallback); // 🔒 never leaves app
    }
  };

  return (
    <Tooltip label={label}>
      <Button
        className={"back-arrow-button"}
        onClick={handleBack}
        aria-label={label}
      >
        <ArrowLeft className="back-arrow" size={size} />
      </Button>
    </Tooltip>
  );
};
