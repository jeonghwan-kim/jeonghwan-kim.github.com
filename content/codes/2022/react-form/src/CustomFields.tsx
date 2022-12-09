import { FieldInputProps, useField } from "formik"
import { FC } from "react"

type MyTextInputProps = FieldInputProps<string> & {
  label: string
}

export const MyTextInput: FC<MyTextInputProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <>
      <label htmlFor={props.name}>{label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? <div>{meta.error}</div> : null}
    </>
  )
}
