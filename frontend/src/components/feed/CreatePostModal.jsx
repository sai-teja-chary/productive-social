import { useState } from "react"
import { Modal } from "../ui/Modal"
import { Select } from "../ui/Select"
import closeIcon from "../../assets/icons/cross.svg"
import "./CreatePostModal.css"
import { Input } from "../ui/Input"
import { TextArea } from "../ui/TextArea"
import { Button } from "../ui/Button"
import attachmentIcon from "../../assets/icons/attachment.svg"
import { createPost } from "../../lib/api"
import { AttachmentsModal } from "./AttachmentsModal"

export const CreatePostModal = ({ isOpen, onClose, joinedCommunities = [], onPostCreated }) => {
    const [communityId, setCommunityId] = useState("")
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [images, setImages] = useState([])
    const [notes, setNotes] = useState([])
    const [showAttachmentsModal, setShowAttachmentsModal] = useState(false)

    const resetForm = () => {
        setCommunityId("")
        setTitle("")
        setContent("")
        setImages([])
    }

    const handleClose = () => {
        resetForm()
        onClose()

    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        const postData = {
            communityId: Number(communityId),
            title,
            content
        }

        formData.append(
            "data",
            new Blob([JSON.stringify(postData)], {
                type: "application/json"
            })
        )

        images.forEach(file => {
            formData.append("images", file)
        })

        try {
            const res = await createPost(formData)
            onPostCreated(res.data)
            handleClose()
        } catch (err) {
            console.error("Create post failed:", err)
        }
    }

    return (
        <Modal
            className="createpost-modal"
            isOpen={isOpen}
            onClose={handleClose}
            closeOnOutsideClick={false}
        >
            <div className="createpost-header">
                <h3>Create Post</h3>
                <img onClick={handleClose} src={closeIcon} alt="close" />
            </div>

            <div className="createpost-form">
                <form onSubmit={handleSubmit}>
                    <div className="community-input">

                        <label htmlFor="community">Community<span style={{ color: "red" }}>*</span></label>
                        <Select
                            id={"community"}
                            required
                            className="createpost-select"
                            placeholder="Select a Community"
                            options={joinedCommunities}
                            value={communityId}
                            onChange={(e) => setCommunityId(e.target.value)}
                            getOptionLabel={(c) => c.name}
                            getOptionValue={(c) => c.id}
                        />
                    </div>

                    <div className="createpost-title-input">
                        <label htmlFor="title">Title<span style={{ color: "red" }}>*</span></label>
                        <Input
                            id={"title"}
                            className={"createpost-input"}
                            type={"text"}
                            required
                            placeholder={"What did you accomplish today?"}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="createpost-title-input">
                        <label htmlFor="description">Description</label>
                        <TextArea
                            id={"description"}
                            className={"createpost-textarea"}
                            type={"text"}
                            placeholder={"Share details about your progress, learnings or challenges..."}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="createpost-upload">
                        <Button
                            className={"createpost-upload-button"}
                            onClick={() => setShowAttachmentsModal(true)}

                        >
                            <img src={attachmentIcon} alt="notes" />
                            Attachments
                        </Button>
                        {images.length > 0 && <div className="images-add-msg">{images.length} Images Added</div>}
                    </div>


                    <Button
                        type="submit"
                        className={"createpost-submit-button"}
                    >
                        Publish
                    </Button>
                </form>

                <AttachmentsModal
                    isOpen={showAttachmentsModal}
                    onClose={() => setShowAttachmentsModal(false)}
                    images={images}
                    setImages={setImages}
                    notes={notes}
                    setNotes={setNotes}
                />
            </div>
        </Modal>
    )
}

