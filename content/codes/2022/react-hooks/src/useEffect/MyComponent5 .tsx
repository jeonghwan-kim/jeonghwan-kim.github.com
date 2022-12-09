import React, { ChangeEventHandler } from "react"

/**
 * 이펙트를 한 번만 실행하기
 */
const MyReact = (function () {
  type Dependency = any[]
  let previousSependencies: Dependency[] = []
  let cursor = 0

  function useEffect(effect: () => void, dependency?: Dependency) {
    function runEffectDelayed() {
      const ENOUGH_TIME_TO_RENDER = 1
      setTimeout(effect, ENOUGH_TIME_TO_RENDER)
    }

    if (typeof dependency === "undefined") {
      runEffectDelayed()
      cursor++
      return
    }

    const prevDep = previousSependencies[cursor]

    if (JSON.stringify(prevDep) === JSON.stringify(dependency)) {
      cursor++
      return
    }

    runEffectDelayed()

    previousSependencies[cursor] = dependency
    cursor++
  }

  function resetCursor() {
    cursor = 0
  }

  return {
    useEffect,
    resetCursor,
  }
})()

const MyComponent5 = () => {
  MyReact.resetCursor()

  const [count, setCount] = React.useState(0)
  // 로컬스토리지에서 가져올 초기값 설정을 이펙트로 옮긴다.
  const [name, setName] = React.useState("")

  MyReact.useEffect(() => {
    document.title = `카운트: ${count} | 이름: ${name}`
    console.log("effect1")
  }, [count, name])

  MyReact.useEffect(() => {
    localStorage.setItem("name", name)
    console.log("effect2")
  }, [name])

  // 의존성으로 빈 배열을 전달한다.
  // 리액트는 한 번만 이팩트를 실행할 것이다.
  // 의존성이 변하지 않기 때문이다.
  MyReact.useEffect(() => {
    setName(localStorage.getItem("name") || "")
    console.log("effect3")
  }, [])

  const handleClick = () => setCount(count + 1)
  const handleChageName: ChangeEventHandler<HTMLInputElement> = e =>
    setName(e.target.value)

  return (
    <div>
      <h1>MyComponent5</h1>
      <button onClick={handleClick}>더하기</button>
      <input value={name} onChange={handleChageName} />
      <p>Hello {name}</p>
    </div>
  )
}

export default MyComponent5
