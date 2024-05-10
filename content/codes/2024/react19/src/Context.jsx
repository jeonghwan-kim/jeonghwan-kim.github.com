import React, { createContext, useState } from "react"

const Context = createContext()

const Counter = () => {
  const { value, setValue } = React.useContext(Context)

  return (
    <>
      {value}
      <button onClick={() => setValue(value + 1)}>+1</button>
    </>
  )
}

const ContextTest = () => {
  const [value, setValue] = useState(1)

  return (
    // Context.Provider를 사용하지 않고 Context를 사용한다.
    <Context value={{ value, setValue }}>
      <Counter />
    </Context>
  )
}

export default ContextTest
