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
    }
  }

  return {
    createContext,
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
  return (
    <countContext.Consumer>
      {({ count }) => <div>{count}</div>}
    </countContext.Consumer>
  )
}

const PlusButton: FC = () => {
  return (
    <countContext.Consumer>
      {({ count, setCount }) => (
        <button onClick={() => setCount(count + 1)}>+ 카운트 올리기</button>
      )}
    </countContext.Consumer>
  )
}

const CountApp1: FC = () => {
  return (
    <CountProvider>
      <Count />
      <PlusButton />
    </CountProvider>
  )
}

export default CountApp1
