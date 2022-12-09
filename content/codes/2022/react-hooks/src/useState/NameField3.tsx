/**
 * 다중 상태
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

const { useState } = (function MyReact() {
  // 상태
  const values: string[] = []
  const isInitialized: (boolean | undefined)[] = []

  function useState(cursor: number, initilaValue = "") {
    const { forceUpdate } = useForceUpdate()

    if (!isInitialized[cursor]) {
      values[cursor] = initilaValue
      isInitialized[cursor] = true
    }

    const value = values[cursor]
    const setValue = (value: any) => {
      values[cursor] = value
      forceUpdate()
    }

    return [value, setValue]
  }

  return {
    useState,
  }
})()

function NameField3() {
  const [firstname, setFirstname] = useState(0, "정환")
  const [lastname, setLastname] = useState(1, "김")

  const handleChangeFirstname: ChangeEventHandler<HTMLInputElement> = e => {
    ;(setFirstname as Function)(e.target.value)
  }
  const handleChangeLastname: ChangeEventHandler<HTMLInputElement> = e => {
    ;(setLastname as Function)(e.target.value)
  }

  return (
    <div>
      <h1>NameField3</h1>
      <input value={firstname as string} onChange={handleChangeFirstname} />
      <input value={lastname as string} onChange={handleChangeLastname} />
    </div>
  )
}

export default NameField3
