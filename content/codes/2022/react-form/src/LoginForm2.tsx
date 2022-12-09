import { ChangeEventHandler, FC, FormEventHandler, useState } from "react"
import "./styles.css"

interface LoginFormValue {
  email: string
  password: string
}

const LoginForm2: FC = () => {
  const [values, setValues] = useState<LoginFormValue>({
    email: "",
    password: "",
  })

  // 오류 메세지를 담는다
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault()

    // 필드 검사 후 잘못된 값이면 제출 처리를 중단한다.
    if (!validate()) {
      return
    }

    alert(JSON.stringify(values, null, 2))
  }

  // 필드값을 검증한다.
  const validate = () => {
    const nextErrors = {
      email: "",
      password: "",
    }

    if (!values.email) {
      nextErrors.email = "이메일을 입력하세요"
    }
    if (!values.password) {
      nextErrors.password = "비밀번호를 입력하세요"
    }

    // 오류 메세지 상태를 갱신한다
    setErrors(nextErrors)

    // 오류 여부를 반환한다
    return Object.values(nextErrors).every(v => !v)
  }

  return (
    <>
      <h1>2단계. 필드 값을 검사하고 오류 메세지 보여주기</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        {/* 이메일 오류메시지를 출력한다 */}
        {errors.email && <span>{errors.email}</span>}

        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        {/* 비밀번호 오류메시지를 출력한다 */}
        {errors.password && <span>{errors.password}</span>}

        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default LoginForm2
