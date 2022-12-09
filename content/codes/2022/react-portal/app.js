const Modal = ({ children }) => (
  <div className="Modal">
    {children}
    {/* 이 버튼을 클릭하면 이벤트가 부모로 버블링될 것이다. */}
    <button>Button</button>
  </div>
)

const PortalModal = props => {
  return ReactDOM.createPortal(
    <Modal {...props} />,
    document.querySelector("#modal-root")
  )
}

const App = () => {
  const handleClick = e => {
    // button에서 발생한 이벤트가 여기서 잡힐 것이다.
    console.log("App에서 click 캡쳐", e.target) // <button>
  }
  return (
    <div className="App" onClick={handleClick}>
      App
      {/* <Modal>Modal</Modal> */}
      <PortalModal>Modal</PortalModal>
    </div>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
