import { useFormik } from "formik"
import { FC } from "react"
import * as Yup from "yup"
import "./styles.css"

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("이름을 입력하세요")
    .max(3, "3자 이하로 입력하세요"),
  lastName: Yup.string()
    .required("성을 입력하세요")
    .max(2, "2자 이하로 입력하세요"),
  email: Yup.string()
    .required("전자우편 주소를 입력하세요")
    .email("이메일 형식에 맞게 입력하세요"),
})

type SignupFormValue = Yup.InferType<typeof validationSchema>

const SignupFormFormik: FC = () => {
  const formik = useFormik<SignupFormValue>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 4))
    },
  })
  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          type="text"
          {...formik.getFieldProps("firstName")}
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <div className="error">{formik.errors.firstName}</div>
        )}
      </div>
      <div>
        <label htmlFor="firstName">Last Name:</label>
        <input
          id="lastName"
          type="text"
          {...formik.getFieldProps("lastName")}
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <div className="error">{formik.errors.lastName}</div>
        )}
      </div>
      <div>
        <label htmlFor="email">Email Address:</label>
        <input id="email" type="email" {...formik.getFieldProps("email")} />
        {formik.touched.email && formik.errors.email && (
          <div className="error">{formik.errors.email}</div>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default SignupFormFormik
