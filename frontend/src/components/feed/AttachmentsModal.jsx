import { Modal } from "../ui/Modal";
import closeIcon from "../../assets/icons/cross.svg";
import plusIcon from "../../assets/icons/plus.svg";
import "./AttachmentsModal.css";
import { Tabs } from "../ui/Tabs";
import { useState } from "react";
import { Button } from "../ui/Button";

export const AttachmentsModal = ({
  isOpen,
  onClose,
  images,
  setImages,
  notes,
  setNotes,
}) => {
  const [active, setActive] = useState("Images");
  const attachmentTabs = ["Images", "Notes"];

  const isImagesTab = active === "Images";

  const files = isImagesTab ? images : notes;
  const setFiles = isImagesTab ? setImages : setNotes;

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <Modal
      className="attachment-modal"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={false}
    >
      <div className="create-post-header">
        <h3>Attachments</h3>
        <img onClick={onClose} src={closeIcon} alt="close" />
      </div>
      <div className="attachment-tabs">
        <Tabs tabs={attachmentTabs} active={active} onChange={setActive} />
      </div>
      <div className="upload-box">
        <img
          className={`upload-btn ${files.length > 0 ? "hidden" : ""}`}
          src={plusIcon}
          alt="upload"
          onClick={() => document.getElementById("image-upload").click()}
        />

        <input
          type="file"
          accept={active === "Images" ? "image/*" : ".pdf,.doc,.docx"}
          multiple
          hidden
          id="image-upload"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...files]);
          }}
        />
        <div className="image-preview">
          {files.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);

            return (
              <div key={idx} className="preview-wrapper">
                <button
                  type="button"
                  className="preview-remove"
                  onClick={() => removeFile(idx)}
                >
                  ✕
                </button>
                {active === "Images" ? (
                  <img src={previewUrl} className="preview-img" />
                ) : (
                  <div className="file-preview">📄 {file.name}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Button type="button" className={"attachment-button"} onClick={onClose}>
        Done
      </Button>
    </Modal>
  );
};
