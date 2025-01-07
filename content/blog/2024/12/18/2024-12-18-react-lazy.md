---
slug: /2024/12/18/react-lazy
date: 2024-12-18
title: 리액트 lazy
layout: post
tags:
  - react
---

웹 애플리케이션의 초기 로딩 속도를 개선하는 핵심 전략 중 하나는 필요한 코드만을 적절한 시점에 로드하는 것이다. Reac.lazy는 이러한 코드 분할(Code Spliiting)을 효과적으로 구현할 수 있게
도와주는 도구다. 이 글에서는 React.lazy의 동작 원리와 사용 방법을 살펴 보겠다.

# 동적 import의 이해

모듈을 동적으로 불러오는 import 함수는 프라미스를 반환하는 함수다. 이 함수는 다음과 같이 사용할 수 있다.

```js
const deferedModule = import("my-module")
```

이 함수는 두 가지 형태의 경로를 인자로 받을 수 있다.

- 로컬 파일 시스템의 파일 경로
- HTTP로 접근할 수 있는 원격 URL

웹팩 같은 번들러를 사용한다면 로컬 파일 시스템의 파일 경로를 전달해 번들러가 파일을 번들할 수 있게 도와준다. URL을 전달해 함수를 호출하면 브라우져는 HTTP 요청을 만들 것이다.

두 경우 모두 I/O 작업이나 네트워크 통신이 필요하기 때문에 비동기적으로 동작하며, 프라미스를 통해 모듈 로딩 처리를 할 수 있다.

```js
deferedModule.then(module => {
  console.log("Module loaded", module)
})
```

이러한 import의 특징을 활용해 어플리케이션 초기 로딩에 기여하지 않는 코드는 따로 분리해 낼 수 있다. 어플리케이션이 로딩된 후 필요한 시점에 분리한 모듈을 로딩하는 방식으로 어플리케이션을 설계할 수 있다.

# 지연 로딩 구현

리액트 컴포넌트를 이런 식으로 분리해 보면 좋겠다. 지연 로딩을 구현하기 위해 다음과 같은 방식으로 접근할 수 있다.

1. 모듈이 로딩되기 전까지는 null을 반환
2. 모듈이 로딩된 후에는 해당 컴포넌트를 렌더링

아래는 간단한 지연 로딩 구현의 예시이다.

```js
let moduleId = 0
const loaded = {}

function myLazy(moduleLoader) {
  const id = moduleId++

  return MyLazyComponent(props) {
    const LoadedComponent = loaded[id]

    // 모듈이 로딩된 후
    if (LoadedComponent) {
      return <LoadedComponent {...props} />
    }

    // 모듈이 로딩되기 전
    throw moduleLoader().then(async lazyModule => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const Component = lazyModule.default
      loaded[id] = Component
    })
  }
}
```

myLazy는 import로 모듈을 불러오는 함수 moduleLoader를 받을 것이다. 이 함수는 MyLazyComponent 를 반환하는데 props 인자를 받고 리액트 앨리먼트를 반환하는 리액트 컴포넌트이다.

반환할 리액트 앨리먼트를 loaded 객체에서 찾는다. 모듈을 비동기로 불러오기 때문에 이 객체에 모듈이 있을 경우만 컴포넌트를 렌더링해 결과를 반환한다.

모듈을 불러와 loaded 저장할 차례다. 리액트는 컴포넌트에서 프라미스를 던지면 이에 반응한다. **프라미스가 이행될 때까지 기다려야하는 컴포넌트**로 이해하고 렌더를 멈추는 것 같다. (참고: [Suspense in React 18](https://dev.to/heyitsarpit/suspense-in-react-18-4ca0)) 모듈이 로딩되더라도 1초간 기다리는데 그 동안은 아무것도 그리지 않는다.

프라미스가 이행되면 리액트는 MyLazyComponent가 준비된것으로 이해하고 다시 호출한다. MyLazyComponet는 laoded에 담아둔 원격 모듈을 이용해 렌더링 결과를 반환할 것이다.

이렇게 사용해 보자.

```jsx
const MyModule = myLazy(() => import("./MyModule"))

function App() {
  return (
    <>
      <h1>App</h1>
      <MyModule />
    </>
  )
}
```

myLazy에 모듈을 로딩하는 함수를 인자로 전달했다. 불러올 모듈 경로를 import 인자로 전달해 호출하는 함수이다. 이렇게 불러온 MyModule을 App 컴포넌트에서 렌더링했다.

# React.Suspense의 활용

리액트의 Suspense 컴포넌트를 사용하면 지연 로딩되는 컴포넌트를 더욱 우아하게 처리할 수 있다.

```jsx
function App() {
  return (
    <>
      <h1>App</h1>
      <React.Suspense>
        <MyModule />
      </React.Suspense>
    </>
  )
}
```

Suspense는 다음과 같은 특징을 가진다.

- 프라미스를 던지는 자식 컴포넌트를 감지
- 로딩중에는 컨텐츠를 표시하지 않음
- 프라미스가 이행되면 실제 컴포넌트를 렌더링

따라서 Suspense로 감싼 MyModule은 모듈을 불러올 동안은 아무것도 그리지 않다가 모듈을 로딩한 즉시 다시 렌더링된다. 한편 App 헤딩 엘리먼트는 이것과 무관하게 처음부터 렌더링되는 효과를 얻을 수 잇다.

Suspense를 사용하면 로딩 중에 표시할 UI를 fallback 인자로 지정할 수도 있다.

```jsx
function App() {
  return (
    <>
      <h1>App</h1>
      <React.Suspense fallback="Loading...">
        <MyModule />
      </React.Suspense>
    </>
  )
}
```

# React.lazy

myLazy롤 React.lazy를 흉내내 보았다. 실제 코드를 보면 비슷한 부분이 있다.

**프라미스(Thanable)를 던지는 부분**:

```js
function lazyInitializer(payload) {
  // ...
  throw payload._result // ()=> Thanable
}
```

모듈 로딩하는 함수인 `payload._result` 를 던져서 컴포넌가 아직 렌더 준비가 되지 않았음을 의도한다.

**로딩한 모듈의 default 값을 반환하는 부분**:

```js
function lazyInitialzier(payload) {
  // ...
  if (payload._status === Resolved) {
    const moduleObject = payload._result
    // ...
    return moduleObject.default
  }
}
```

로딩한 모듈의 default 값을 반환한다. React.lazy 함수로 로딩할 모듈은 `export default` 로 모듈을 외부 노출해야한다.

# 실제 활용 방안

이 함수를 효과적으로 활용할 수 있는 대표적인 시나리오는 다음과 같다.

**라우트 기반 코드 분할**

- 각 라우트별로 독립적인 번들 생성
- 페이지 전환 시에만 해당 코드를 로드

**서드파티 라이브러리의 지연 로딩**

- 차트나 에디터 같은 무거운 외부 라이브러리
- 사용자 인터랙션 후에만 필요한 기능

# 결론

React.lazy는 웹 어프리케이션의 초기 로딩 성능을 최적화하는 도구다. 대표적으로 라우터로 분리된 컴포넌트를 지연 로딩 대상으로 처리할 수 있다. 웹팩과 함께 사용하면 더욱 강력한 코드 분할 전략을 구현할 수도 있다.

단, 무분별한 코드 분할은 오히려 성능 저하를 초리할수 있다는 점을 유념해야할 것 같다.

## 참고

- [예제 코드](https://github.com/jeonghwan-kim/jeonghwan-kim.github.io-examples/tree/main/2024-12-17-react-lazy)
- [Suspense in React 18 | dev.to](https://dev.to/heyitsarpit/suspense-in-react-18-4ca0)
