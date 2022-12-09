import React, { ChangeEventHandler } from "react"

/**
 * 다중 이펙트
 */
const MyReact = (function () {
  // 부수효과별로 의존성 이력을 관리할 배열이다.
  let previousDependencies: any[] = []
  // 현재 부수효과의 의존성 이력을 가리킨다
  let cursor = 0

  function useEffect(effect: () => void, dependency?: any) {
    function runEffectDelayed() {
      const ENOUGH_TIME_TO_RENDER = 1
      setTimeout(effect, ENOUGH_TIME_TO_RENDER)
    }

    if (typeof dependency === "undefined") {
      runEffectDelayed()
      // 다음 부수효과의 의존성 비교를 위해 커서를 옮긴다
      cursor++
      return
    }

    // 커서를 이용해 이전 의존성 값을 가져온다
    const previousDependency = previousDependencies[cursor]

    if (previousDependency === dependency) {
      // 다음 부수효과의 의존성 비교를 위해 커서를 옮긴다
      cursor++
      return
    }

    runEffectDelayed()

    // 커서를 이용해 의존성 값을 기억한다
    previousDependencies[cursor] = dependency

    // 다음 부수효과의 의존성 비교를 위해 커서를 옮긴다
    cursor++
  }

  // 커서 초기화 함수
  function resetCursor() {
    cursor = 0
  }

  return {
    useEffect,
    // 커서 초기화 함수를 제공한다
    resetCursor,
  }
})()

const MyComponent3 = () => {
  // 컴포넌트를 호출할 때마다 커서를 초기화 한다
  MyReact.resetCursor()

  const [count, setCount] = React.useState(0)
  // 상태 초기값을 로컬 스토리지에서 가져온다.
  const [name, setName] = React.useState(localStorage.getItem("name") || "")

  MyReact.useEffect(() => {
    document.title = `카운트: ${count}`
    console.log("effect1")
  }, count)

  MyReact.useEffect(() => {
    localStorage.setItem("name", name)
    console.log("effect2")
  }, name)

  const handleClick = () => setCount(count + 1)
  const handleChageName: ChangeEventHandler<HTMLInputElement> = e =>
    setName(e.target.value)

  return (
    <div>
      <h1>MyComponent3</h1>
      <button onClick={handleClick}>더하기</button>
      <input value={name} onChange={handleChageName} />
      <p>Hello {name}</p>
    </div>
  )
}

export default MyComponent3
