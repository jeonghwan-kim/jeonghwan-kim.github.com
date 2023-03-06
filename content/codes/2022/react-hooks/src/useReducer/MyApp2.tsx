/**
 * 2차 버전. 리듀서를 만들자.
 */

import React from "react"

function createStore<S, A>(
  reducer: (state: S, action: A) => S,
  initialValue: S
) {
  let currentState = initialValue
  const listeners: (() => void)[] = []

  function getStore() {
    return currentState
  }

  function subscribe(callback: () => void) {
    listeners.push(callback)
  }

  function dispatch(action: A) {
    const nextState = reducer(currentState, action)
    if (nextState !== currentState) {
      currentState = nextState
      listeners.forEach(listener => listener())
    }
  }

  return {
    getStore,
    subscribe,
    dispatch,
  }
}

interface State {
  value: string
}
interface Action {
  type: "change"
  value: string
}

function reducer(state: State, action: Action): State {
  if (action.type === "change") {
    return { ...state, value: action.value }
  }
  throw "알 수 없는 타입"
}

const initialValue: State = {
  value: "foo",
}

const store = createStore(reducer, initialValue)

console.log("after createStore:", store.getStore())

store.subscribe(() => console.log("subscribe:", store.getStore()))
store.dispatch({ type: "change", value: "bar" })

console.log("after dispatch:", store.getStore())

// 우선 신경쓰지 말고
const useForceUpdate = () => {
  const [value, setValue] = React.useState(1)
  const forceUpdate = () => setValue(value + 1)
  return {
    forceUpdate,
  }
}

const { useReducer, resetCursor } = (function MyReact() {
  const stores: ReturnType<typeof createStore>[] = []
  const isInitialized: boolean[] = []
  let cursor = 0

  function useReducer<R, S>(
    reducer: R,
    initialValue: S
  ): [S, (action: any) => void] {
    const { forceUpdate } = useForceUpdate()

    if (!isInitialized[cursor]) {
      // @ts-ignore
      stores[cursor] = createStore(reducer, initialValue)
      isInitialized[cursor] = true
    }

    const store = stores[cursor]

    store.subscribe(forceUpdate)

    cursor++

    // @ts-ignore
    return [store.getStore(), store.dispatch]
  }

  function resetCursor() {
    cursor = 0
  }

  return {
    useReducer,
    resetCursor,
  }
})()

function reducer2(state: any, action: any) {
  if (action.type === "change") {
    return {
      ...state,
      value: Math.random().toString(),
    }
  }

  throw Error("알 수 없는 액션")
}

const initialValue2 = {
  value: Math.random().toString(),
}

const MyApp2 = () => {
  resetCursor()

  const [state, dispatch] = useReducer(reducer2, initialValue2)

  const handleClick = () => dispatch({ type: "change" })

  return (
    <div>
      {state.value}
      <button onClick={handleClick}>Change</button>
    </div>
  )
}

export default MyApp2
