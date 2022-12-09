import {
  ChangeEventHandler,
  createContext,
  FC,
  FormEventHandler,
  PropsWithChildren,
  useCallback,
  useContext,
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
  }, [runValidator])

  const getFieldProps = (name: keyof T) => {
    const value = values[name]
    const onBlur = handleBlur
    const onChange = handleChange
    return {
      value,
      onBlur,
      onChange,
    }
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
  }
}

const FormContext = createContext<any>({})
FormContext.displayName = "FormContext"

type FormProps<T> = UseFormArgs<T>

function Form<T>({
  children,
  ...props
}: PropsWithChildren<FormProps<T>>): JSX.Element {
  const formValue = useForm<T>(props)

  return (
    <FormContext.Provider value={formValue}>
      <form onSubmit={formValue.handleSubmit}>{children} </form>
    </FormContext.Provider>
  )
}

interface FieldProps {
  type: string
  name: string
}

const Field: FC<FieldProps> = props => {
  const { getFieldProps } = useContext(FormContext)
  return <input {...props} {...getFieldProps(props.name)} />
}

interface ErrorMessageProps {
  name: string
}

const ErrorMessage: FC<ErrorMessageProps> = ({ name }) => {
  const { touched, errors } = useContext(FormContext)
  if (!touched[name] || !errors[name]) {
    return null
  }
  return <span>{errors[name]}</span>
}

interface LoginFormValue {
  email: string
  password: string
}

const LginForm6: FC = () => {
  const validate = (values: LoginFormValue) => {
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
  }
  const handleSubmit = (values: LoginFormValue) => {
    alert(JSON.stringify(values, null, 2))
  }

  return (
    <>
      <h1>6단계. 컨텍스트</h1>
      <Form<LoginFormValue>
        initialValues={{ email: "", password: "" }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        <Field type="email" name="email" />
        <ErrorMessage name="email" />
        <Field type="password" name="password" />
        <ErrorMessage name="password" />
        <button type="submit">로그인</button>
      </Form>
    </>
  )
}

export default LginForm6
