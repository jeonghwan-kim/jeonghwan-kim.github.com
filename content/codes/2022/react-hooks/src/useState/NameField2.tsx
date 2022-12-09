/**
 * 클로져로 상태 구현
 */

import React from "react"
import { ChangeEventHandler } from "react"

// 우선 신경쓰지 말고
const useForceUpdate = () => {
  const [value, setValue] = React.useState(1)
  const forceUpdate = () => setValue(value + 1)
  return {
    forceUpdate,
  }
}

const { useName } = (function MyReact() {
  // 이름
  let firstname: string
  let isInitialized = false

  function useName(initilaValue = ""): [string, (value: string) => void] {
    const { forceUpdate } = useForceUpdate()

    if (!isInitialized) {
      firstname = initilaValue
      isInitialized = true
    }

    // 이름 변경
    const setFirstname = (value: string) => {
      firstname = value
      forceUpdate()
    }

    return [firstname, setFirstname]
  }

  return {
    useName,
  }
})()

function NameField2() {
  const [firstname, setFirstname] = useName("정환")

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setFirstname(e.target.value)
  }

  return (
    <div>
      <h1>NameField2</h1>
      <input value={firstname} onChange={handleChange} />
    </div>
  )
}

export default NameField2
