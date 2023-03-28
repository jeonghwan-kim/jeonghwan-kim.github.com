/**
 * 2차 버전. 리듀서를 만들자.
 */

import React, { ChangeEventHandler, MouseEventHandler } from "react"

function createStore<S, A>(
  reducer: (state: S, action: A) => S,
  initialValue: S
) {
  let currentState = initialValue
  const listeners: (() => void)[] = []

  function getState() {
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
    getState,
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

console.log("after createStore:", store.getState())

store.subscribe(() => console.log("subscribe:", store.getState()))
store.dispatch({ type: "change", value: "bar" })

console.log("after dispatch:", store.getState())

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
    return [store.getState(), store.dispatch]
  }

  function resetCursor() {
    cursor = 0
  }

  return {
    useReducer,
    resetCursor,
  }
})()

// 클래스 컴포넌트의 forceUpdate를 흉내낸다.
// 리렌더링을 유발하는 역할이다.
const useForceUpdate = () => {
  const [value, setValue] = React.useState(1)
  const forceUpdate = () => setValue(value + 1)
  return {
    forceUpdate,
  }
}

function registerFormReducer(state: any, action: any) {
  if (action.type === "SET_FIELD") {
    return {
      ...state,
      value: {
        ...state.value,
        [action.name]: action.value,
      },
    }
  }

  if (action.type === "RESET") {
    return {
      value: {
        nickname: "",
        password: "",
      },
      error: {
        nickname: "",
        password: "",
      },
    }
  }

  if (action.type === "VALIDATE") {
    return {
      ...state,
      error: {
        nickname: /^\w+$/.test(state.value.nickname)
          ? ""
          : "영문, 숫자만 입력하세요",
        password: /^.{3,6}$/.test(state.value.password)
          ? ""
          : "3자이상 6자이하로 입력하세요",
      },
    }
  }

  throw Error("알 수 없는 액션")
}

const registerFormInitialValue = {
  value: {
    nickname: "",
    password: "",
  },
  error: {
    nickname: "",
    password: "",
  },
}

const RegisterForm2 = () => {
  resetCursor()

  const [state, dispatch] = useReducer(
    registerFormReducer,
    registerFormInitialValue
  )

  const handleChange: ChangeEventHandler<HTMLInputElement> = e =>
    dispatch({ type: "SET_FIELD", name: e.target.name, value: e.target.value })

  const handleReset: MouseEventHandler<HTMLButtonElement> = e =>
    dispatch({ type: "RESET" })

  const handleValidate: MouseEventHandler<HTMLButtonElement> = e =>
    dispatch({ type: "VALIDATE" })

  return (
    <div>
      <div>
        <label>닉네임</label>
        <input
          type="text"
          name="nickname"
          value={state.value.nickname}
          onChange={handleChange}
        />
        <span>{state.error.nickname}</span>
      </div>
      <div>
        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          value={state.value.password}
          onChange={handleChange}
        />
        <span>{state.error.password}</span>
      </div>
      <button onClick={handleReset}>초기화</button>
      <button onClick={handleValidate}>검증</button>
    </div>
  )
}

export default RegisterForm2
