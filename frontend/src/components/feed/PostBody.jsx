import { Button } from "../ui/Button"
import "./PostBody.css"
import notesIcon from "../../assets/icons/notes.svg"
import { Link } from "react-router-dom"

export const PostBody = ({ content, images = [], notes }) => {
    return (
        <>
            <div className="post-body">
                <h3 className="post-heading">{content.heading}</h3>
                <p className="post-content">{content.post}</p>
                {images.length > 0 &&
                    images.map((image, index) =>
                        <img key={index}
                            className="post-image"
                            src={`${import.meta.env.VITE_API_URL}${image.imageUrl}`}
                            alt="Post media"
                        />)}

                <Button variant="notes-button">
                    <img src={notesIcon} alt="Notes" />
                    <Link className="notes-link-text" to={notes}>Notes attached</Link>
                </Button>
            </div>

        </>
    )
}