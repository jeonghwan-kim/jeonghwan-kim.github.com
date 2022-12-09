import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react"
import "./styles.css"

interface UseFormArgs<T> {
  initialValues: T
  validate(values: T): Partial<T>
  onSubmit(values: T): void
}

function useForm<T>({ initialValues, validate, onSubmit }: UseFormArgs<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<T>>({})
  const [touched, setTouched] = useState(({} as unknown) as T)

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }

  const handleBlur: ChangeEventHandler<HTMLInputElement> = e => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    })
  }

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault()

    setTouched(
      Object.keys(values).reduce((touched, field) => {
        ;((touched as unknown) as any)[field] = true
        return touched
      }, {} as T)
    )

    const errors = validate(values)
    setErrors(errors)

    if (Object.values(errors).some(e => e)) {
      return
    }

    onSubmit(values)
  }

  const runValidator = useCallback(() => validate(values), [values])

  useEffect(() => {
    const errors = runValidator()
    setErrors(errors)
  }, [values, runValidator])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}

interface LoginFormValue {
  email: string
  password: string
}

const LoginForm4: FC = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<LoginFormValue>({
    initialValues: { email: "", password: "" },
    validate: values => {
      const errors = {
        email: "",
        password: "",
      }

      if (!values.email) {
        errors.email = "이메일을 입력하세요"
      }
      if (!values.password) {
        errors.password = "비밀번호를 입력하세요"
      }

      return errors
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2))
    },
  })

  return (
    <>
      <h1>4단계. useForm </h1>
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

export default LoginForm4
