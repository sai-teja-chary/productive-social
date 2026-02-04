import { useEffect, useRef } from "react";
import "./Modal.css";

let openModalCount = 0;

export const Modal = ({
  isOpen,
  onClose,
  closeOnOutsideClick = true,
  className = "default-modal",
  children,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    openModalCount += 1;

    if (openModalCount === 1) {
      document.body.style.overflow = "hidden";
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      openModalCount -= 1;

      if (openModalCount === 0) {
        document.body.style.overflow = "";
      }

      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        closeOnOutsideClick && onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`modal ${className}`}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
