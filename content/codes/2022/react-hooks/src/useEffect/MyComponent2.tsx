import React, { ChangeEventHandler } from "react"

/**
 * 단일 의존성
 */
const MyReact = (function () {
  // 이전 의존성. 다음 의존성 값을 비교하기 위한 용도이다
  let previousDependency: any

  function useEffect(effect: () => void, dependency?: any) {
    function runEffectDelayed() {
      const ENOUGH_TIME_TO_RENDER = 1
      setTimeout(effect, ENOUGH_TIME_TO_RENDER)
    }

    // 의존성이 없으면 부수 효과를 바로 실행한다
    if (typeof dependency === "undefined") {
      runEffectDelayed()
      return
    }

    // 의존값이 변하지 않으면 이펙트를 실행하지 않는다
    if (previousDependency === dependency) {
      return
    }

    // 의존값이 변할 때만 실행한다
    runEffectDelayed()

    // 의존값을 기억한다
    previousDependency = dependency
  }

  return {
    useEffect,
  }
})()

const MyComponent2 = () => {
  const [count, setCount] = React.useState(0)
  // 이름
  const [name, setName] = React.useState("")

  MyReact.useEffect(() => {
    document.title = `카운트: ${count}`
    console.log("effect1")
  }, count)

  const handleClick = () => setCount(count + 1)
  const handleChageName: ChangeEventHandler<HTMLInputElement> = e =>
    setName(e.target.value)

  return (
    <div>
      <h1>UseEffect2</h1>
      <button onClick={handleClick}>더하기</button>
      <input value={name} onChange={handleChageName} />
      <p>Hello {name}</p>
    </div>
  )
}

export default MyComponent2
