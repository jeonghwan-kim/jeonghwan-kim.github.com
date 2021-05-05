---
title: "리액트 컨텍스트"
layout: post
category: dev
featuredImage: drill.jpg
tags: [react]
---

리액트 안내서에 나온 컨택스트는 읽어보기만 했지 실제로 사용해 본적은 한 번도 없었다.
상태관리 솔루션으로 리덕스(Redux)나 모빅스(Mobx)를 사용해서 그런걸까?
문서에는 UI 테마나 로그인한 유저, 로케일 따위의 데이터가 컨택스트로 관리할 수 있는 것이라고 말한다.
상태관리 써드파티 라이브러리로 관리해서 그런지 더욱 컨텍스트의 필요성을 느끼지 못한 것 같다.

## Prop Drilling 현상

![드릴 이미지](drill.jpg)

컨텍스트는 컴포넌트간에 props를 일일이 전달하는 [props drilling](https://kentcdodds.com/blog/prop-drilling/) 현상 개선하기 위해 사용한다.

> context를 이용하면 단계마다 일일이 props를 넘겨주지 않고도 컴포넌트 트리 전체에 데이터를 제공할 수 있습니다. - 출처: [리액트 고급안내서](https://ko.reactjs.org/docs/context.html)

가령 루트 컴포넌트의 상태를 자식 컴포넌트에게 전달할 때 컴포넌트의 단계가 깊어질 수록 매번 props를 전달하는 모양이 된다.
카운터 어플리케이션 예제 코드를 보면 이렇게 작성할 수 있겠다.

```jsx
class App extends React.Component {
  state = { count: 1 }

  setCount = count => this.setState({ count })

  render() {
    return <Counter count={this.state.count} setCount={this.setCount} />
  }
}
```

App 컴포넌트를 만들고 카운터 값과 이를 변경할 수 있는 메소드를 준비했다.

이를 전달받은 Counter 컴포넌트는 이런 모양이 되겠다.

```jsx
function Counter({ count, setCount }) {
  return (
    <>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>➕더하기</button>
    </>
  )
}
```

props로 받은 카운터 값을 보여주고 증가 버튼도 두어 클릭하면 카운터를 하나 올리도록 setCount() 함수를 실행하도록 했다.

만약 컴포넌트로 분리한다면 이런 모양이 되겠다.

```jsx
function Counter({ count, setCount }) {
  return (
    <>
      <CounterMessage count={count} />
      <CounterControl count={count} setCount={setCount} />
    </>
  )
}

function CounterMessage({ count }) {
  return <span>{count}</span>
}

function CounterControl({ count, setCount }) {
  return <button onClick={() => setCount(count + 1)}>➕더하기</button>
}
```

컴포넌트로 추상화하면 더 잘 읽히는 코드가 되는것 같다.
카운터 값을 출력하는 CounterMessage와 카운터를 제어하는 CounterControl 컴포넌트로 의미를 명확히 했기 때문이다.

하지만 이를 사용하는 Counter 컴포넌트의 역할이 조금 애매해졌다.
Props를 받아 이들 자식 컴포넌트에게 전달만하기 때문이다.
이제 props로 받은 데이터는 더이상 Counter의 관심사가 아니다.

이런 결과가 나온 이유는 루트 컴포넌트에서 관리하는 값을 하위 컴포넌트들로 일일이 전달하는 구조 때문이다.
이러한 props drilling 현상의 장/단점을 정리하면 이렇다.

👍 장점

- 명시적으로 데이터를 전달한다
- 그렇기 때문에 데이터를 수정하거나 삭제하기 편하다

👎 단점

- 컴포넌트 계층이 많아질 수록 props를 전달만하는 코드를 많이 작성해야한다
- 각 컴포넌트는 props를 사용하지 않고 전달만 한다

## 컨택스트를 사용하자

이러한 현상을 개선하기 위해 리액트는 컨택스트를 제공한다.
관련된 컴포넌트들의 최상단에서 데이터를 관리하고 자식 컴포넌트 중 필요할 때만 직접 가져다 사용하는 구조이다.

리덕스처럼 어플리케이션 최상단에 위치한 단일 스토어가 아닌가 싶기도 하지만 그렇게 사용하지 말라고 얘기하는 것 같다.
오히려 불필요하게 하위 컴포넌트가 다시 렌더링 되는 문제가 생길 수도 있기 때문이다.
필요한 컴포넌트들에서만 지역적으로 사용하는데 마치 Mobx를 그렇게 사용한 것 같은 모양이다.

컨텍스트 팩토리 함수 **createContext()**를 호출하는 것부터 시작한다.

```jsx
const CounterContext = React.createContext()
console.log(CounterContext)
/**
{
	Provider: Object,
  Consumer: Object
}
*/
```

Provider와 Consumer 키를 갖는 객체를 반환한다.
이 둘은 컴포넌트인데

- **Provider**는 데이터를 제공하고
- **Consumer**는 이 데이터를 조회할 때

사용한다.

먼제 Provider를 이용해 카운터 데이터를 제공할 CounterProvider 컴포넌트를 만든다.

```jsx
class CounterProvider extends React.Component {
  state = { count: 1 }

  setCount = count => this.setState({ count })

  render() {
    const value = {
      ...this.state,
      setCount: this.setCount,
    }

    return (
      <CounterContext.Provider value={value}>
        {this.props.children}
      </CounterContext.Provider>
    )
  }
}
```

CounterProvider는 1로 초기화된 count 상태와 이 값을 변경할 수 있는 setCount 메소드를 가진 컴포넌트 클래스다.
render() 메소드에서 CounterContext.Provider를 사용해 리액트 앨리먼트를 만드는데 value 속성으로 count 상태값을 전달한다.
뿐만 아니라 이를 변경할 방법도 함께 전달한다.

이제 이 CounterProvider를 Counter 컴포넌트에서 사용한다.

```jsx
function Counter() {
  return (
    <CounterProvider>
      <CounterMessage />
      <CounterControl />
    </CounterProvider>
  )
}
```

Props를 받아서 전달하기만 했던 Counter 컴포넌트는 더 이상 본인의 관심사가 아닌 일을 하지 않는다.
CounterMessage나 CounterControldms 컨텍스트에 접근해 데이터를 얻기 때문이다.

```jsx
function CounterMessage() {
  return (
    <CounterContext.Consumer>
      {context => <span>{context.count}</span>}
    </CounterContext.Consumer>
  )
}
```

CounterMessage가 props로 데이터를 받지 않고 컨텍스트에서 직접 조회할 수 있는데 바로 Consumer 컴포넌트 덕분이다.
Consumer의 자식은 함수여야만 한다.
렌더 프롭을 사용해 함수 인자를 통해 Provider의 value에 전달한 값이 들어오기 때문이다.
여기서는 count 값을 출력했다.

CounterControl도 마찬가지다.

```jsx
function CounterControl() {
  return (
    <CounterContext.Consumer>
      {context => (
        <button onClick={() => context.setCount(context.count + 1)}>
          ➕더하기
        </button>
      )}
    </CounterContext.Consumer>
  )
}
```

count와 이를 변경하기 위한 함수 setCount를 컨텍스트에서 가져와 사용했다.

이제 CounterMessage와 CounterControl은 props를 통해서 데이터를 요구하지 않는다.
그렇기 때문에 Counter 컴포넌트는 props 없이 이 둘을 사용할 수 있게 되었다.
더 이상 본인의 관심사가 아닌 코드를 가지고 있을 필요가 없다.

## 직접 만들기

컨텍스트 코드가 궁금했는데 찾아 보기가 좀 어려웠다.

추측만 해봤는데 내가 생각하는 createContext 함수는 이렇게 생겼을 것 같다.

```jsx
function createContext() {
  let _value = null;

  function Provider({ value, children }) {
    _value = value;

    return React.Children.map(children, (child, index) => (
      React.cloneElement(child, { key: index });
    ));
  }

  function Consumer({ children }) {
    return children(_value);
  }

  return { Provider, Consumer }
}
```

Provider가 받는 value를 저장하기위해 \_value 클로저 변수를 만들었다.
Consumer는 render props로 자식 컴포넌트를 받기 때문에 함수 호출을 사용했는데 저장해 둔 \_value 값을 인자로 전달했다.

정확한 동작은 아니고 참고만 해야겠다.

## 훅으로 사용하기

컨텍스트를 소비하는 측이 함수라면 훅을 이용할 수도 있다.
**useContext** 훅이다.

```jsx
function CounterMessage() {
  const { count } = React.useContext(CounterContext)
  return <span>{count}</span>
}

function CounterControl() {
  const { count, setCount } = React.useContext(CounterContext)
  return <button onClick={() => setCount(count + 1)}>➕더하기</button>
}
```

Consumer 컴포넌트를 사용하는 것보다 비교적 단순하다.
컨텍스트를 사용하는 라이브러리들을 찾아보니 훅을 더 사용하는 편인 것 같다.

## 컨텍스트를 사용하는 라이브러리

그 동안 사용했던 리액트 생태계 라이브러리 중 컨텍스트를 사용했을 법한 것들이 떠오른다.

**react-redux**

리덕스 상태 변화가 리액트 컴포넌트 런더러를 건드리려면 어떻게든지 props로 데이터를 넣어 주여야할 할 텐데.
일일이 모든 컴포넌트에 전달하지 않으려면 컨텍스트를 사용해야할 것 같다.

connect 함수를 찾아보았다.
사용하는 것 같기는 하지만 잘은 모르겠다.
흐름만 파악하기 위해 코드를 많이 생략해서 가져왔다.
주석만 참고하자.

```jsx
// 1. 컨텍스트를 생성
const ReactReduxContext = React.createContext(null)

// 2. 프로바이더 컴포넌트 정의
function Provider({ store, children }) {
  // 3. store, subscription을 제공하는 컨텍스트 값을 준비
  const contextValue = useMemo(() => {
    const subscription = new Subscription(store)
    return { store, subscription }
  }, [store])

  // 4. Provider 클래스에 위 값을 제공
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

// 5. connect은 컨텍스트를 사용하는 고차함수
function connect() {
  return function connectAdvanced() {
    return function wrapWithConnect(WrappedComponent) {
      // 6. useContext 훅으로 컨텍스트에 있는 데이터 조회
      const contextValue = useContext(ReactReduxContext)
    }
  }
}
```

**antd**

엔트디자인은 테마나 로케일을 관리하는 ConfigProvider 컴포넌트를 제공하는데 이 녀석이 컨텍스틑를 사용할 것 같다.
이름도 Provder로 끝나는게 컨텍스트의 그것처럼 보인다.

```jsx
// 1. 컨텍스트 생성
const ConfigContext = React.createContext();

// 2. Provider 정의
const ConfigProvider = props => {
	// 3. locale을 제공하는 컨텍스트 값을 준비
	const config = {
    locale: locale || legacyLocale,
  };

	const memoedConfig = useMemo(
		() => config,
    config,
	}

	// 4. Provider 컴포넌트에 전달
  return (
		<ConfigContext.Provider value={memoedConfig}>
			{childNode}
		</ConfigContext.Provider>;
	)
}

// 5. Modal은 컨텍스트를 사용하는 컴포넌트
const Modal = props => {
  // 6. useContext 훅으로 컨텍스트에 있는 데이터를 가져온다
	const { locale } = React.useContext(ConfigContext);

  const renderFooter = () => {
		return (
			<Button>
        {/* 7. 로케일에 따라 버튼 이름이 다르다 */}
        {cancelText || locale.cancelText}
      </Button>
		)

  }
}
```

**react-i18next**

다국어 프레임워크 i18next의 리액트 버전인 이 라이브러리에서도 컨텍스트를 사용한다.

```jsx
// 1. 컨텍스트 생성
const I18nContext = React.createContext()

// 2. Provider 정의
export function I18nextProvider({ i18n, defaultNS, children }) {
  // 3. i18n 객체를 제공하는 컨텍스트 값 준비
  const value = useMemo(() => i18n, [i18n])
  // 4. Provier 컴포넌트로 전달
  return createElement(I18nContext.Provider, { value }, children)
}

// 5. Trans는 컨텍스트를 사용하는 컴포넌트
function Trans(props) {
  // 6. useContext 훅으로 컨텍스트에 있는 데이터를 가져온다
  const { i18n } = useContext(I18nContext)
}
```

## 결론

그 동안 리덕스와 Mobx를 사용하면서 어플리케이션 상태관리를 했다.
어플리케이션에서 단 하나의 스토어만 관리하던 리덕스의 경우 지역적으로 사용하는 데이터도 이 프레임에 맞출려고 하니깐 좀 과하다는 생각을 했었다.
이때 컨택스트를 떠올렸어야 하는데 하는 아쉬움이 든다.

리덕스 이후로는 Mobx만 사용하는데 필요할 때마다 작은 스토어를 만든다.
컨택스트의 역할과 어떻게 겹칠지는 더 생각해봐야겠다.
이왕 리액트 라이브러리를 쓴다면 코어 API를 최대한 활용하는 것이 좋을 것 같다.

참고

- [React 고급안내서 > Context](https://ko.reactjs.org/docs/context.html)
- [React Hook > Hook API 참고서](https://ko.reactjs.org/docs/hooks-reference.html#usecontext)
- [Prop Drilling](https://kentcdodds.com/blog/prop-drilling)
- [상태 관리 도구로서의 React Context](https://chatoo2412.github.io/javascript/react/react-context-as-a-state-management-tool/)
- [awesome-react-context](https://github.com/diegohaz/awesome-react-context)
