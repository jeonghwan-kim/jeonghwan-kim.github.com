import { useActionState } from "react"
import DesignButton from "./DesignButton"

async function updateNameSuccess() {
  return new Promise(r => setTimeout(r, 1000))
}

async function updateNameFail() {
  return new Promise((_, r) => setTimeout(r, 1000))
}

function ChangeName({ name, setName }) {
  const action = async (_, formData) => {
    const newName = formData.get("name")

    try {
      await updateNameSuccess(newName)
      // await updateNameFail(newName)
    } catch (e) {
      // 실패할 때는 오류를 반환한다.
      return e
    }

    setName(newName)
    // 성공할 때는 null을 반환한다.
    return null
  }
  const initialState = null

  const [error, submitAction] = useActionState(action, initialState)

  return (
    // form 앨리먼트의 action 프롭에 submitAction을 전달한다.
    <form action={submitAction}>
      <input type="text" name="name" defaultValue={name} />
      <DesignButton />

      {/* 오류를 표시한다. */}
      {error && <p>{error}</p>}
    </form>
  )
}

export default ChangeName
