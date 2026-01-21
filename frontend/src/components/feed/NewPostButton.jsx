import plusIcon from "../../assets/icons/plus.svg";
import { Button } from "../ui/Button";
import "./NewPostButton.css";

export const NewPostButton = ({ onClick }) => {
  return (
    <Button variant="create-post" onClick={onClick}>
      <img className="plus-icon" src={plusIcon} alt="newpost" />
      New Post
    </Button>
  );
};
