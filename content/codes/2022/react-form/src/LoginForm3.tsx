import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react"
import "./styles.css"

interface LoginFormValue {
  email: string
  password: string
}

const LoginForm3: FC = () => {
  const [values, setValues] = useState<LoginFormValue>({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  // 필드 방문 상태를 관리한다
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }

  // blur 이벤트가 발생하면 touched 상태를 true로 바꾼다
  const handleBlur: ChangeEventHandler<HTMLInputElement> = e => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    })
  }

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault()

    // 모든 필드에 방문했다고 표시한다.
    setTouched({
      email: true,
      password: true,
    })

    // 필드 검사 후 잘못된 값이면 제출 처리를 중단한다.
    if (!validate()) {
      return
    }

    alert(JSON.stringify(values, null, 2))
  }

  // 필드값을 검증한다.
  const validate = useCallback(() => {
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
  }, [values])

  // 입력값이 변경될때 마다 검증한다.
  useEffect(() => {
    validate()
  }, [values, validate])

  return (
    <>
      <h1>3단계. 오류 메세지를 더 일찍 보여주기 </h1>
      <form onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {/* 이메일 오류메시지를 출력한다 */}
        {touched.email && errors.email && <span>{errors.email}</span>}

        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {/* 비밀번호 오류메시지를 출력한다 */}
        {touched.password && errors.password && <span>{errors.password}</span>}

        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default LoginForm3
