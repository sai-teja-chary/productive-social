import { useState } from "react"
import { Modal } from "../ui/Modal"
import { Select } from "../ui/Select"
import closeIcon from "../../assets/icons/cross.svg"
import "./CreatePostModal.css"
import { Input } from "../ui/Input"
import { TextArea } from "../ui/TextArea"
import { Button } from "../ui/Button"
import notesIcon from "../../assets/icons/notes.svg"
import galleryIcon from "../../assets/icons/gallery.svg"
import { createPost } from "../../lib/api"

export const CreatePostModal = ({ isOpen, onClose, joinedCommunities = [] }) => {
    const [communityId, setCommunityId] = useState("")
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [images, setImages] = useState([])

    const resetForm = () => {
        setCommunityId("")
        setTitle("")
        setContent("")
    }

    const handleClose = () => {
        resetForm()
        onClose()

    }

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        // 1️⃣ Create FormData
        const formData = new FormData()

        // 2️⃣ JSON payload (must be Blob for Spring Boot)
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

        //   3️⃣ (Optional) append files later
        images.forEach(file => formData.append("images", file))

        console.log("Multipart payload:");
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }
        const dataBlob = formData.get("data")
        dataBlob.text().then(text => {
            console.log("JSON inside data part:", text)
        })

        try {
            await createPost(formData)
            handleClose() // close modal on success
        } catch (err) {
            console.error(
                "Create post failed:",
                err.response?.data || err.message
            )
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
                        <label htmlFor="title">Title</label>
                        <Input
                            id={"title"}
                            className={"createpost-input"}
                            type={"text"}
                            placeholder={"What did you accomplish today?"}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="createpost-title-input">
                        <label htmlFor="description">Description<span style={{ color: "red" }}>*</span></label>
                        <TextArea
                            id={"description"}
                            required
                            className={"createpost-textarea"}
                            type={"text"}
                            placeholder={"Share details about your progress, learnings or challenges..."}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="createpost-upload">

                        <Button className={"createpost-upload-button"}>
                            <img src={notesIcon} alt="notes" />
                            Upload Notes
                        </Button>
                        <Button
                            type="button"
                            className="createpost-upload-button"
                            onClick={() => document.getElementById("image-upload").click()}
                        >
                            <img src={galleryIcon} alt="gallery" />
                            Upload Images
                        </Button>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            id="image-upload"
                            onChange={(e) => {
                                const files = Array.from(e.target.files)
                                setImages(prev => [...prev, ...files])
                            }}
                        />
                    </div>
                    <div className="image-preview">
                        {images.map((file, idx) => {
                            const previewUrl = URL.createObjectURL(file)

                            return (

                                <div key={idx} className="preview-wrapper">
                                    <button
                                        type="button"
                                        className="preview-remove"
                                        onClick={() => removeImage(idx)}
                                    >
                                        ✕
                                    </button>
                                    <img
                                        src={previewUrl}
                                        alt="preview"
                                        className="preview-img"
                                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    <Button type="submit" className={"createpost-submit-button"}>
                        Publish
                    </Button>
                </form>
            </div>
        </Modal>
    )
}

