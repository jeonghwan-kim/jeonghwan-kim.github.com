import React from "react"
import ChangeName from "./ChangeName"
import ChangeNameOptimistic from "./ChangeNameOptimistic"
import CommentPage from "./CommentPage"
import ContextTest from "./Context"
import RefTest from "./Ref"
import Metadata from "./Metadata"

const App = () => {
  const [name, setName] = React.useState("jh.kim")

  return (
    <>
      <ChangeName name={name} setName={setName} />
      <ChangeNameOptimistic name={name} setName={setName} />
      <CommentPage />
      <ContextTest />
      <RefTest />
      <Metadata />
    </>
  )
}

export default App
