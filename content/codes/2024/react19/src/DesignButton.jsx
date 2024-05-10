import { useFormStatus } from "react-dom"

function DesignButton() {
  // 상위에 있는 form 상태를 바로 가져온다. 마치 컨택스트 처럼
  const { pending, ...formStatus } = useFormStatus()

  console.log(pending, formStatus)

  return (
    <button type="submit" disabled={pending}>
      Update
    </button>
  )
}

export default DesignButton
