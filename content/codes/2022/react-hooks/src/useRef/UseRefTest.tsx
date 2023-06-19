import React from "react"

const MyReact = (() => {
  let memorizedStates: { current: any }[] = []
  let cursor = 0
  let isInitialized: boolean[] = []

  const useRef = (initialValue: any) => {
    if (!isInitialized[cursor]) {
      memorizedStates[cursor] = { current: initialValue }
    }

    const state = memorizedStates[cursor]
    cursor++

    return state
  }

  return {
    useRef,
  }
})()

const UseRefTest = () => {
  const [count, setCount] = React.useState(0)
  const ref1 = MyReact.useRef(1)
  const ref2 = MyReact.useRef(null)

  if (count > 3) ref1.current = ref1.current + 1

  const handleCount = () => setCount(count + 1)
  const handleSubmit = () => console.log(ref2.current.value)

  return (
    <div>
      <button onClick={handleCount}>Increase(count: {count})</button>
      <div>ref1: {ref1.current}</div>
      <input ref={ref2} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default UseRefTest
