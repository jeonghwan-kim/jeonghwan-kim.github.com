/**
 * 1차 버전. useState로 상태 관리
 */

import { ChangeEventHandler, MouseEventHandler, useState } from "react"

const RegisterForm1 = () => {
  const [state, setState] = useState({
    value: { nickname: "", password: "" },
    error: { nickname: "", password: "" },
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
    setState({
      value: { nickname: "", password: "" },
      error: { nickname: "", password: "" },
    })
  }

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = e => {
    setState({
      ...state,
      error: {
        nickname: /^\w+$/.test(state.value.nickname)
          ? ""
          : "영문, 숫자만 입력하세요",
        password: /^.{3,6}$/.test(state.value.password)
          ? ""
          : "3자이상 6자이하로 입력하세요",
      },
    })
  }

  return (
    <>
      <div>
        <label>닉네임:</label>
        <input
          type="text"
          name="nickname"
          value={state.value.nickname}
          onChange={handleChange}
        />
        <span>{state.error.nickname}</span>
      </div>
      <div>
        <label>비밀번호:</label>
        <input
          type="password"
          name="password"
          value={state.value.password}
          onChange={handleChange}
        />
        <span>{state.error.password}</span>
      </div>
      <button onClick={handleReset}>초기화</button>
      <button onClick={handleSubmit}>회원가입</button>
    </>
  )
}

export default RegisterForm1
