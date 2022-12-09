import React from "react"
import { useState } from "react"
import { FC } from "react"

type Handler<T> = (value: T) => void

interface EventEmitter<T> {
  on(handler: Handler<T>): void
  off(handler: Handler<T>): void
  get(): T
  set(value: T): void
}

function createEventEmitter<T>(value: T): EventEmitter<T> {
  let handlers: Handler<T>[] = []

  return {
    on(handler: Handler<T>) {
      handlers.push(handler)
    },

    off(handler: Handler<T>) {
      handlers = handlers.filter(h => h !== handler)
    },

    get() {
      return value
    },

    set(newValue: T) {
      value = newValue
      handlers.forEach(handler => handler(value))
    },
  }
}

const MyReact = (() => {
  type Context<T> = {
    Provider: FC<{ value: T }>
    Consumer: FC<{ children: (value: T) => ReturnType<FC> }>
    emitter: EventEmitter<T>
  }

  function createContext<T>(initialValue: T): Context<T> {
    const emitter = createEventEmitter<T>(initialValue)

    const Provider: Context<T>["Provider"] = ({ value, children }) => {
      React.useEffect(() => {
        emitter.set(value)
      }, [value])

      return <>{children}</>
    }

    const Consumer: Context<T>["Consumer"] = ({ children }) => {
      const [value, setValue] = useState<T>(emitter.get())

      React.useEffect(() => {
        emitter.on(setValue)
        return () => emitter.off(setValue)
      }, [])

      return <>{children(value)}</>
    }

    return {
      Provider,
      Consumer,
      // emitter를 제공한다.
      emitter,
    }
  }

  // 컨택스트 값을 사용할 수 있는 훅이다.
  function useContext<T>(context: Context<T>): T {
    // 컨택스트 값을 상태 value로 저장해 둔다
    const [value, setValue] = useState<T>(context.emitter.get())

    React.useEffect(() => {
      // 컨택스트의 이벤트 에미터로부터 값을 수신하면 상태 value를 갱신다.
      // 이 상태를 사용하는 컴포넌트는 리렌더링 될 것이다.
      context.emitter.on(setValue)
      return () => context.emitter.off(setValue)
    }, [context])

    // 컨택스트 값을 반환한다.
    return value
  }

  return {
    createContext,
    // 훅을 제공한다.
    useContext,
  }
})()

interface CountContext {
  count: number
  setCount: (value: number) => void
}

const countContext = MyReact.createContext<CountContext>({
  count: 0,
  setCount() {},
})

const CountProvider: FC = ({ children }) => {
  const [count, setCount] = useState(0)

  return (
    <countContext.Provider value={{ count, setCount }}>
      {children}
    </countContext.Provider>
  )
}

const Count: FC = () => {
  // 컨택스트의 값을 가져온다
  const { count } = MyReact.useContext(countContext)
  // Consumer의 렌더 프롭보다 간결하다.
  return <div>{count}</div>
}

const PlusButton: FC = () => {
  // 컨택스트의 값을 가져온다
  const { count, setCount } = MyReact.useContext(countContext)
  // Consumer의 렌더 프롭보다 간결하다.
  return <button onClick={e => setCount(count + 1)}>+ 카운트 올리기</button>
}

const CountApp2: FC = () => {
  return (
    <CountProvider>
      <Count />
      <PlusButton />
    </CountProvider>
  )
}

export default CountApp2
