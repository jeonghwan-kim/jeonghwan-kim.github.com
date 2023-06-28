---
slug: "/2023/06/24/lecture-react-season2-part3-ch5"
date: 2023-06-24 00:03:05
title: "[리액트 2부] 3.5 컨택스트 훅"
layout: post
series: 리액트 2부
tags: [react]
---

useContext 훅을 만들어 보면서 리액트가 함수 컴포넌트에서 컨택스트를 어떻게 사용하는지 이해한다.

# 3.4.1 고차 컴포넌트와 훅

리액트 컨택스트는 여러 컴포넌트에게 인자를 자유롭게 전달할 수 있는데 두 가지 단계에 걸쳐 가능하다.

첫째, 컨택스트에게 데이터를 제공할 프로바이더 컴포넌트로 렌더 트리를 감싸야한다. 라우터 컨택스트를 제공하기 위해 Router를 만들고 이를 App 컴포넌트에서 사용했다. Router는 내부에는 컨택스트 프로바이더를 사용해 값을 컨택스트에게 전달했다.

```jsx{4,15-18,21}
class Router extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      path: window.location.pathname
    }
    this.handleChangePath = this.handleChangePath.bind(this)
  }

  handleChangePath(path) {
    this.setState({ path })
  }

  render() {
    const contextValue= {
      path: this.state.path
      changePath: this.handleChangePath
    }

    return (
     <routerContext.Provider value={contextValue}>
       {this.props.children}
     </routerContext.Provider>
    )
  }
}
```

둘째, 컨택스트의 값을 사용하려면 컨슈머 컴포넌트를 사용하고 렌더 프롭으로 chidlren 인자를 전달한다. Routes는 라우터 컨택스트의 컨슈머 컴포넌트를 사용했다. 프로바이더가 전달한 상태값을 컨슈머 컴포넌트의 children을 통해 렌더 프롭으로 전달 받았다. 이 함수의 인자로 컨택스트 값을 받을 수 있다.

```jsx{2}
const Routes = ({ children }) => (
  <routerContext.Consumer>
    {({ path }) => {
      // ...
    }}
  </routerContext.Consumer>
)
```

컨택스트를 사용하려면 이처럼 렌더 프롭 형태로 사용해야 하는 제한이 있다. 여러 컨택스트를 사용한다면 컨슈머 컴포넌트를 중첩해야하는데 사용하기 좀 까다롭다.

이러한 구조적 제한을 해결하기 위해 고차 컴포넌트 패턴을 사용했다. 라우트 컨택스트가 제공하는 값을 컴포넌트에 주입하기 위해 WithRouter를 만들었다. withRouter 함수에 대상 컴포넌트를 전달하면 WithrRouter가 라우팅 기능을 대상 컴포넌트에 주입하는 방식이다.

```jsx{1-3,10}
const withRouter = WrappedComponent => {
  const WithRouter = props => (
    <routerContext.Consumer>
      {({ path, changePath }) => {
        const navigate = () => {
          /* 생략 */
        }
        const match = () => {
          /* 생략 */
        }
        const searchParams = new URLSearchParams(window.location.search)

        const enhancedProps = { navigate, match, searchParams }
        return <WrappedComponent {...props} {...enhancedProps} />
      }}
    </routerContext.Consumer>
  )
  WithRouter.displayName = `WithRouter(${getComponentName(WrappedComponent)})`
  return WithRouter
}
```

```jsx
const PaymentSuccessDialog = withRouter(
  withLayout({ navigate, closeDialog }) => {
    // ...
  })
)
```

PaymentSuccessDialog는 라우터 컨슈머를 사용하지 않았다. 대신 withRouter를 통해 인자로 주입받았다. 컨슈머 컴포넌트를 사용하고 렌더 프롭 패턴의 장황함이 사라졌다. 고차 컴포넌트의 클래스나 함수형 컴포넌트 모두 사용할 수 있다. 고차 컴포넌트는 필요한만큼 함수에 전달해 사용할 수 있어서 레이아웃 기능도 제공받을 수 있다. 필요한만큼 고차 컴포넌트를 사용하면된다.

어플리케이션 횡단 관심사를 해결하는 고차 컴포넌트 패턴을 활용해 컨택스트를 사용했다. 컨택스트는 훅을 사용하는 방법도 있다 . useState, useEffect 처럼 함수 컴포넌트안에서 명시적으로 사용해 내부 값으로 컨택스트 값을 가져온다.

고차 컴포넌트와 비교하면 중첩 단계를 줄일수 있는 효과도 있다.

```jsx
withA(
  withB(
    withC(function TargetComponent(props) {
      const {a, b, c} = props
      // ...
    )
  )
)
```

```jsx
function TargetComponent() {
  const a = useA()
  const b = useB()
  const c = useC()
  // ...
}
```

# 3.4.2 훅을 만들자

2편에서 만들었던 MyReact.createContext를 활용해 useContext 훅을 직접 구현해 보자.

```jsx{1,4,14}
function createContext(initialValue) {
  const emitter = createEventEmitter(initialValue)

  function Provider({ value, children }) {
    React.useEffect(() => {
      emitter.set(value)
    }, [value])

    return <>{children}</>
  }

  return {
    Provider,
    emitter,
  }
}
```

클래스 컴포넌트로 만들었던 Provider를 함수형 컴포넌트로 만들었다. 이전과 달리 인자 value가 바뀔때 마다 이벤트 에미터에게 통지한다. 이벤트 에미터 객체도 반환해서 훅에서 사용하도록 했다.

Consumer는 만들지 않았다. useContext 훅으로 대체할 것이다.

```jsx{2}
const MyReact = (() => {
  function useContext(context) {
    const [value, setValue] = React.useState(context.emitter.get())

    React.useEffect(() => {
      context.emitter.on(setValue)
      return () => context.emitter.off(setValue)
    }, [context])

    return value
  }

  return {
    useContext,
  }
})()
```

컨택스트를 인자로 받아 이벤트 에미터의 값을 초기값으로 가지는 상태를 만들었다. 이벤트 에미터의 변경을 setValue가 구독해 컨택스트 값이 변하면 상태를 갱신할 것이다.

useContext훅을 사용하는 컴포넌트는 컨택스트의 값이 변경될 때마다 리액트가 리렌더링하게될 것이다.

이제 컨택스트를 사용해 보자.

```jsx
const countContext = MyReact.createContext({})

const CountProvider = ({ children }) => {
  const [count, setCount] = React.useState(0)
  const value = { count, setCount }
  return <countContext.Provider value={value}>{children}</countContext.Provider>
}
```

컨택스트 객체를 만들고 제공자인 CounterProvider를 만들었다. 이전에 만든 것과 같다.

이제 훅을 통해 컨택스트르르 소비할 차례다.

```jsx{2,7}
const Count = () => {
  const { count } = MyReact.useContext(countContext)
  return <div>{count}</div>
}

const PlusButton = () => {
  const { count, setCount } = MyReact.useContext(countContext)
  const handleClick = () => setCount(count + 1)
  return <button onClick={handleClick}>카운트 올리기</button>
}

const App = () => (
  <CountProvider>
    <Count />
    <PlusButton />
  </CountProvider>
)
```

컨슈머 컴포넌트와 렌더프롭을 사용하던 코드에 비해 간결하다. 컨택스트를 여러개 사용한다면 이러한 장점은 더 부각된다.

# 3.4.3 useContext의 역할

useContext의 역할은 뭘까?

컨택스트 소비방법이 바뀌었다. 기존에는 컨택스트 데이터를 얻기 위해 컨슈머 컴포넌트를 사용했다. 이 컴포넌트의 children 렌더 프롭을 통해 함수 인자로 컨택스트 데이터가 주입도는 구조이다. 컨택스트 여러 개를 사용한다면 컨슈머 컴포넌트를 중첩해 사용하는데 들여 쓰기 단계가 많아져 장황한 코드가 될 수 있는 문제가 있었다.

반면 컨택스트 훅은 함수 호출과 같다. 리액트 앨리먼트를 반환하기 전에 함수 호출 한 줄이면 컨택스트 데이터를 얻을수 있다. 여러 컨택스트를 사용하더라도 그만큼 함수를 호출하기 때문에 들여쓰기 수준이 같은 평탄한 코드를 작성할 수 있는 이점이 있다.

컨택스트 값은 횡단 관심사 일 경우가 많다. 라우터와 레이아웃처럼 어플리케이션 전반에 사용하는 데이터를 컨택스트로 관리하기 때문이다. 횡단 관심사를 주입하기 위한 방법으로 고차 컴포넌트 패턴을 사용했다.

컨택스트 훅은 컨택스트의 횡단관심사를 제공하는 다른 패턴을 제공한다. 컨택스트 훅을 조합한 커스텀 훅을 만들수 있다. useNavigate, useDialog 처럼 주소 이동이나 다이얼로그 기능이 필요한 컴포넌트에서 함수 호출로 사용할수 있다.

고차컴포넌트 패턴은 기능을 인자로 제공하기 때문에 부모 컴포넌트의 인자와 섞여 있어서 출처가 명확히 보이지 않는다. 타겟 컴포넌트가 직접 사용된 것인지 고차컴포넌트로 래핑된 것인지를 봐야만 출처를 ㅎ파악할수 있다. 반면 컨택스트 훅은 컴포넌트 안에서 함수 호출로 얻어오기 때문에 직관적이다.

# 3.4.4 중간 정리

고차 컴포넌트와 훅

- 고차컴포넌트 패턴으로 컨택스 소비자를 간소화 가능
- 훅을 사용해도 해결 가능

컨택스트 훅 구현

- 2편에서 만든 컨택스트 활용.
- Provider: 컨택스트 값이 바뀔때 이벤트 에미터로 통지
- useContext: 컨택스트 값을 내부 상태로 관리. 이벤트 에미터에서 수신하면 이 상태 갱신. 리렌더 유도
- 컨택스트 소비 방법 변화: 렌더 프롭 → 내부 변수

참고

- [리액트 useContext는 어떤 모습일까? | 김정환블로그](/dev/2022/04/28/use-context.html)
