import { useOptimistic } from "react"
import DesignButton from "./DesignButton"

async function updateNameSuccess() {
  return new Promise(r => setTimeout(r, 1000))
}

async function updateNameFail() {
  return new Promise((_, r) => setTimeout(r, 1000))
}

function ChangeNameOptimistic({ name, setName }) {
  const [optimisticName, setOptimisticName] = useOptimistic(name)

  const submitAction = async formData => {
    const newName = formData.get("name")

    // 옵티미스틱 값을 먼저 바꾼다.
    setOptimisticName(newName)

    // 비동기 로직을 실행한다.
    try {
      await updateNameSuccess(newName)
      // await updateNameFail(newName)
    } catch (e) {
      // 실패할 때는 오류를 반환한다.
      return e
    }

    // 비동기 로직을 성공하면 실제 값을 바꾼다.
    setName(newName)
  }

  return (
    // form 앨리먼트의 action 프롭에 submitAction을 전달한다.
    <form action={submitAction}>
      <p>OptimisticName: {optimisticName}</p>
      <input type="text" name="name" defaultValue={name} />
      <DesignButton />
    </form>
  )
}

export default ChangeNameOptimistic
