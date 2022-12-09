import { ErrorMessage, Field, Form, Formik } from "formik"
import { FC } from "react"
import * as Yup from "yup"
import { MyTextInput } from "./CustomFields"

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

const SignupFormFormikRenderProps: FC = () => (
  <Formik<SignupFormValue>
    initialValues={{ firstName: "", lastName: "", email: "" }}
    validationSchema={validationSchema}
    onSubmit={values => {
      alert(JSON.stringify(values, null, 4))
    }}
  >
    <Form>
      {/* <MyTextInput label="First Name" name="firstName" type="text" /> */}
      <label htmlFor="firstName">First Name:</label>
      <Field name="firstName" type="text" />
      <div>
        <ErrorMessage name="firstName" />
      </div>

      <label htmlFor="lastName">Last Name:</label>
      <Field name="lastName" type="text" />
      <div>
        <ErrorMessage name="lastName" />
      </div>

      <label htmlFor="email">Email:</label>
      <Field name="email" type="email" />
      <div>
        <ErrorMessage name="email" />
      </div>

      <button type="submit">Submit</button>
    </Form>
  </Formik>
)

export default SignupFormFormikRenderProps
