import { Modal } from "../ui/Modal";
import { TextArea } from "../ui/TextArea"
import { Button } from "../ui/Button"
import { Avatar } from "../ui/Avatar"
import "./CommentModal.css";
import closeIcon from "../../assets/icons/cross.svg"
import { useEffect, useState } from "react";
import { getPostComments, postComments } from "../../lib/api";


export const CommentModal = ({ postId, onClose, isOpen, onCommentAdded }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen) fetchComments();
    }, [isOpen]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await getPostComments(postId);
            setComments(res.data);
            console.log(comments)
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const res = await postComments(postId, comment );

            setComments(prev => [res.data, ...prev]);
            setComment("");

            // 🔑 tell feed to increment commentsCount
            onCommentAdded?.(postId);
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <Modal variant="large-modal" isOpen={isOpen} onClose={onClose}>
            <div className="comment-header">
                <h3>Comments</h3>
                <img onClick={onClose} src={closeIcon} alt="close" />
            </div>

            <div className="comments-list">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    comments.map(c => (
                        <div key={c.id} className="comment-item">
                            <p className="name">
                                <Avatar alt={c.username}/>
                                {c.name} <span>{c.username}</span>
                            </p>
                            <p className="text">{c.content}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="comment-input-container">
                <form onSubmit={(e) => {  // if this does NOT print → form isn't submitting through React
                    handleCommentSubmit(e);
                }}>
                    <TextArea
                        placeholder="Add your comment"
                        variant="comment-textarea"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button type="submit" variant="comment-button">Post</Button>
                </form>
            </div>
        </Modal>
    );
};
