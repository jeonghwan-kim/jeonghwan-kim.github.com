/**
 * 함수 컴포넌트에서 상태를 관리하라
 */

import { ChangeEventHandler } from "react"

function NameField1() {
  let name = "정환"

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    // ?
    name = e.target.value
    console.log("handleChange", name)
  }
  console.log("NameField", name)
  return (
    <div>
      <h1>NameField1</h1>
      <input value={name} onChange={handleChange} />
    </div>
  )
}

export default NameField1
