import { useEffect, useRef } from "react"

// ref 프롭으로 레프 객체를 받는다.
const Field = ({ ref }) => {
  return <input ref={ref} />
}

const RefTest = () => {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return

    ref.current.focus()
  }, [])

  return <Field ref={ref} />
}

export default RefTest
