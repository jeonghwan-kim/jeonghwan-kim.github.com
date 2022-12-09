/**
 * 커서를 안으로
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

const { useState, resetCursor } = (function MyReact() {
  let cursor = 0
  const values: string[] = []
  const isInitialized: (boolean | undefined)[] = []

  function useState(initilaValue = "") {
    const { forceUpdate } = useForceUpdate()

    if (!isInitialized[cursor]) {
      values[cursor] = initilaValue
      isInitialized[cursor] = true
    }

    const value = values[cursor]
    // 커서를 지정한 세터를 만든다
    const setValueAt = (cursor: number) => (value: any) => {
      values[cursor] = value
      forceUpdate()
    }

    // const setValue = setValueAt(cursor);
    const setValue = (value: any) => {
      values[cursor] = value
      forceUpdate()
    }

    // 커서를 1 증가한다
    cursor++

    return [value, setValue]
  }

  function resetCursor() {
    cursor = 0
  }

  return {
    useState,
    resetCursor,
  }
})()

function NameField4() {
  // 커서를 다시 설정한다
  resetCursor()

  const [firstname, setFirstname] = useState("정환") // cursor 0
  const [lasname, setLastname] = useState("김") // cursor 1

  const handleChangeFirstname: ChangeEventHandler<HTMLInputElement> = e => {
    ;(setFirstname as Function)(e.target.value)
  }
  const handleChangeLastname: ChangeEventHandler<HTMLInputElement> = e => {
    ;(setLastname as Function)(e.target.value)
  }

  return (
    <div>
      <h1>NameField4</h1>
      <input value={firstname as string} onChange={handleChangeFirstname} />
      <input value={lasname as string} onChange={handleChangeLastname} />
    </div>
  )
}

export default NameField4
