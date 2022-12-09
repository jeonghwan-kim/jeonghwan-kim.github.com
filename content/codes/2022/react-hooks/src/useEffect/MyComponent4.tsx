import React, { ChangeEventHandler } from "react"

/**
 * 다중 의존성
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

    const previousDependency = previousSependencies[cursor]

    // 의존성 배열을 비교한다.
    if (JSON.stringify(previousDependency) === JSON.stringify(dependency)) {
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

const MyComponent4 = () => {
  MyReact.resetCursor()

  const [count, setCount] = React.useState(0)
  const [name, setName] = React.useState(localStorage.getItem("name") || "")

  // 의존성을 배열로 변경한다. name을 추가했다.
  MyReact.useEffect(() => {
    // 카운트와 이름을 문서 타이틀에 표시한다
    document.title = `카운트: ${count} | 이름: ${name}`
    console.log("effect1")
  }, [count, name])

  // 의존성을 배열로 변경한다.
  MyReact.useEffect(() => {
    localStorage.setItem("name", name)
    console.log("effect2")
  }, [name])

  const handleClick = () => setCount(count + 1)
  const handleChageName: ChangeEventHandler<HTMLInputElement> = e =>
    setName(e.target.value)

  return (
    <div>
      <h1>MyComponent4</h1>
      <button onClick={handleClick}>더하기</button>
      <input value={name} onChange={handleChageName} />
      <p>Hello {name}</p>
    </div>
  )
}

export default MyComponent4
