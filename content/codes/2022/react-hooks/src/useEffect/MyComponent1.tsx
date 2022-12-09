import React from "react"

/**
 * 단일 이펙트
 */
const MyReact = (function () {
  // 부수효과(이펙트)를 사용할수 있는 함수를 정의한다
  function useEffect(effect: () => void) {
    // UI 렌더링 후 이펙트를 실행한다
    function runEffectDelayed() {
      const ENOUGH_TIME_TO_RENDER = 1
      setTimeout(effect, ENOUGH_TIME_TO_RENDER)
    }
    runEffectDelayed()
  }

  return {
    // useEffect를 외부에 제공한다
    useEffect,
  }
})()

const MyComponent1 = () => {
  const [count, setCount] = React.useState(0)

  MyReact.useEffect(() => {
    document.title = `카운트: ${count}`
    console.log("effect1")
  })

  const handleClick = () => setCount(count + 1)

  return (
    <div>
      <h1>MyComponent1</h1>
      <button onClick={handleClick}>더하기</button>
    </div>
  )
}

export default MyComponent1
