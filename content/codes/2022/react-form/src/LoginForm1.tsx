import { ChangeEventHandler, FC, FormEventHandler, useState } from "react"
import "./styles.css"

interface LoginFormValue {
  email: string
  password: string
}

const LoginForm1: FC = () => {
  const [values, setValues] = useState<LoginFormValue>({
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

    alert(JSON.stringify(values, null, 2))
  }

  return (
    <>
      <h1>1단계. 로그인 폼 만들기</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default LoginForm1
