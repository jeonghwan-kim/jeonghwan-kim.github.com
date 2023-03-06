/**
 * 1차 버전. useState로 상태 관리
 */

import { ChangeEventHandler, MouseEventHandler, useState } from "react"

const MyApp = () => {
  const [state, setState] = useState({
    value: { name: "", age: "" },
    error: { name: "", age: "" },
  })

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setState({
      ...state,
      value: {
        ...state.value,
        [e.target.name]: e.target.value,
      },
    })
  }

  const handleReset: MouseEventHandler<HTMLButtonElement> = _ => {
    setState({ value: { name: "", age: "" }, error: { name: "", age: "" } })
  }

  const handleValidate: MouseEventHandler<HTMLButtonElement> = e => {
    setState({
      ...state,
      error: {
        name: state.value.name ? "" : "필수 입력입니다.",
        age: state.value.age ? "" : "필수 입력입니다.",
      },
    })
  }

  return (
    <>
      <div>
        <input
          type="text"
          name="name"
          value={state.value.name}
          onChange={handleChange}
        />
        <span>{state.error.name}</span>
      </div>
      <div>
        <input
          type="number"
          name="age"
          value={state.value.age}
          onChange={handleChange}
        />
        <span>{state.error.age}</span>
      </div>
      <button onClick={handleReset}>초기화</button>
      <button onClick={handleValidate}>검증</button>
    </>
  )
}

export default MyApp
