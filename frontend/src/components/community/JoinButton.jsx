import { Button } from "../ui/Button";
import "./JoinButton.css";

export const JoinButton = ({ id, joined, onClick, className }) => {
  return (
    <Button
      className={`community-join-button ${className} ${joined ? "joined" : ""}`}
      onClick={onClick}
    >
      {joined ? "Leave" : "Join"}
    </Button>
  );
};
