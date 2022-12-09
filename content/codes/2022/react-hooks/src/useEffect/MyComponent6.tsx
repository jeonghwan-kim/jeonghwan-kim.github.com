import React, { ChangeEventHandler, FC, useState } from "react"

/**
 * 정리도하는 이펙트
 */
const MyReact = (function () {
  type Dependency = any[]
  type CleanUp = () => void
  let previousDependencies: Dependency[] = []
  // 부수효과를 정리하는 함수 목록
  let cleanUps: (CleanUp | undefined)[] = []
  let cursor = 0

  function useEffect(effect: () => void | CleanUp, dependency?: Dependency) {
    function runDealyEffect() {
      function runEffect() {
        // 부수효과를 호출하고 반환값을 저장한다
        const cleanUp = effect()
        // 클린업 함수가 있으면 저장해 둔다
        if (cleanUp) {
          cleanUps[cursor] = cleanUp
        }
      }
      const ENOUGH_TIME_TO_RENDER = 1
      setTimeout(runEffect, ENOUGH_TIME_TO_RENDER)
    }

    if (typeof dependency === "undefined") {
      runDealyEffect()
      cursor++
      return
    }

    const prevDependency = previousDependencies[cursor]

    if (JSON.stringify(prevDependency) === JSON.stringify(dependency)) {
      cursor++
      return
    }

    runDealyEffect()

    previousDependencies[cursor] = dependency
    cursor++
  }

  function resetCursor() {
    cursor = 0
  }

  // 저장해 둔 클린업 함수를 모두 실행한다.
  function cleanUpEffects() {
    cleanUps.forEach(cleanup => cleanup?.())
    cleanUps = []
    // 이전 의존성도 제거한다
    previousDependencies = []
  }

  return {
    useEffect,
    resetCursor,
    // 외부에서 사용할 수 있다
    cleanUpEffects,
  }
})()

const MyComponent6 = () => {
  MyReact.resetCursor()

  const [count, setCount] = React.useState(0)
  const [name, setName] = React.useState("")

  MyReact.useEffect(() => {
    document.title = `카운트: ${count} | 이름: ${name}`
    console.log("effect1")

    // 리액트 트리에서 컴포넌트가 사라지면 이 컴포넌트로 발생한 이펙트를 정리한다.
    return function cleanUp() {
      // 문서 타이틀을 빈 문자열로 설정한다
      document.title = ""
      console.log("effect1 cleanup")
    }
  }, [count, name])

  MyReact.useEffect(() => {
    localStorage.setItem("name", name)
    console.log("effect2")
  }, [name])

  MyReact.useEffect(() => {
    setName(localStorage.getItem("name") || "")
    console.log("effect3")
  }, [])

  const handleClick = () => setCount(count + 1)
  const handleChageName: ChangeEventHandler<HTMLInputElement> = e =>
    setName(e.target.value)

  return (
    <div>
      <h1>MyComponent6</h1>
      <button onClick={handleClick}>더하기</button>
      <input value={name} onChange={handleChageName} />
      <p>Hello {name}</p>
    </div>
  )
}

const MyComponent6Wrapper: FC = () => {
  const [visible, setVisible] = useState(false)
  const handleClick = () => {
    if (visible) {
      // 컴포넌트를 숨길때 이펙트를 정리한다
      MyReact.cleanUpEffects()
    }
    setVisible(!visible)
  }
  return (
    <div>
      <button onClick={handleClick}>컴포넌트 토글</button>
      {visible && <MyComponent6 />}
    </div>
  )
}

export default MyComponent6Wrapper
