import { ChangeEventHandler, FC, FormEventHandler, useState } from "react"
import "./styles.css"

interface SignupFormValue {
  firstName: string
  lastName: string
  email: string
}

const SignupFormDefault: FC = () => {
  const [values, setValues] = useState<SignupFormValue>({
    firstName: "",
    lastName: "",
    email: "",
  })

  const [errors, setErrors] = useState<SignupFormValue>({
    firstName: "",
    lastName: "",
    email: "",
  })

  const [touched, setTouched] = useState<
    Record<keyof SignupFormValue, boolean>
  >({
    email: false,
    firstName: false,
    lastName: false,
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    })

    // if (submitted) {
    validate({
      ...values,
      [event.target.name]: event.target.value,
    })
    // }
  }

  const handleBlur: ChangeEventHandler<HTMLInputElement> = event => {
    setTouched({
      ...touched,
      [event.target.name]: true,
    })
    validate(values)
  }

  const handleSubmit: FormEventHandler = event => {
    event.preventDefault()

    setSubmitted(true)
    setTouched({
      email: true,
      firstName: true,
      lastName: true,
    })
    if (validate(values)) {
      alert(JSON.stringify(values, null, 4))
    }
  }

  const validate = (values: SignupFormValue) => {
    const _errors: typeof errors = {
      email: "",
      firstName: "",
      lastName: "",
    }

    if (!values.firstName) {
      _errors.firstName = "이름을 입력하세요"
    }

    if (!values.lastName) {
      _errors.lastName = "성을 입력하세요"
    }

    if (!values.email) {
      _errors.email = "이메일 주소를 입력하세요"
    } else if (!/^.*@.*\..*$/.test(values.email)) {
      _errors.email = "이메일 주소 형식으로 입력하세요"
    }

    setErrors(_errors)

    return Object.values(_errors).every(value => !value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.firstName && errors.firstName && (
          <div className="error">{errors.firstName}</div>
        )}
      </div>
      <div>
        <label htmlFor="lastNae">Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.lastName && errors.lastName && (
          <div className="error">{errors.lastName}</div>
        )}
      </div>
      <div>
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && (
          <div className="error">{errors.email}</div>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default SignupFormDefault
