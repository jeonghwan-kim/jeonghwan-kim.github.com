import * as React from "react"
import "./Modal.css"

const Modal = ({ children, onClose }) => {
  React.useEffect(() => {
    document.body.style.overflowY = "hidden"
    return () => (document.body.style.overflowY = "auto")
  }, [])
  return (
    <>
      <div className="Modal-backdrop" onClick={onClose}></div>
      <div className="Modal">
        <div className="Modal-body">{children}</div>
        <div className="Modal-footer">
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </>
  )
}

export default Modal
