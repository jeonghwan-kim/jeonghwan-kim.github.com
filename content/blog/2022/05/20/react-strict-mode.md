---
slug: "/2022/05/20/react-strict-mode"
date: 2022-05-20
title: "리액트 StrictMode"
layout: post
tags:
  - react
---

거의 사용해 보지 못했다. create-react-app에서 잠깐 봤는데 이걸로 프로젝트를 해본 경험이 없으니 정말 거의 사용한 적이 없었다. React의 Strict 모드가 무엇인지 문서 위주로 정리해 보자.

# 역할

자바스크립트에서는 엄격 모드가 있다. 코드 파일 상단에 "use strict"를 써 놓으면 자바스크립트를 실행할 때 조금 더 엄격하게 코드를 검사한다.

리액트에도 이와 유사한 목적으로 사용하는 `<StrictMode />`라는 컴포넌트가 있다.

> StrictMode는 애플리케이션 내의 잠재적 문제 알아내기 위한 도구입니다. - [리액트 공식문서 > 고급 안내서](https://ko.reactjs.org/docs/strict-mode.html)

리액트를 가이드라인에 맞추어 사용하는 것이 가장 좋지만 그렇지 않아도 어플리케이션은 그런대로 동작한다.
이런 결과물은 느리고 불안정할 수 밖에 없는데 문제의 원인을 찾는 것이 좀처럼 어렵다.

Strict 모드를 사용하면 리액트가 자식 컴포넌트를 검사하고 잘못 사용된 부분을 우리에게 알려준다.
이런 경고 메세지를 보면서 리액트를 사용하면 어플리케이션에 잠재된 문제를 미리 해결할 수 있을 것이다.

# 검사항목

그럼 어떤 항목을 검사하는 것일까? 문서에보니 5가지 유형의 검사 항목이 있다.

**1) 잘못 사용한 생명주기 메서드**: componentWillMount 같은 지원 종료(deprecated)한 메서드를 사용하면 경고한다.

**2) 레거시 문자열 ref 사용 여부**: 나도 문자열 ref를 사용해 본적은 없다. 리액트 초기 버전에서 제공한 것 같은데 관련 도서에서만 발견했다. 지금은 createRef() 함수로 만든 객체 ref를 사용한다. 콜백 ref도 초반에 나온 것 같은데 여전히 지원한다고 한다.

**3) findDOMNode 사용 여부**: 컴포넌트 자식 중 특정 엘리먼트를 찾는 함수이다. 자식 엘리먼트는 구현 방식에 따라 달라질 수 있기 때문에 유지보수하기 어려워 사용을 자제한다. 대신 직접 ref를 지정해 사용하라고 권장한다.

**4) 예상치 못한 부작용(side effect)**: 리액트는 컴포넌트를 렌더링하기 위해 두 단계를 거친다. 렌더링과 커밋. 렌더링 단계에서는 변화를 계산하는 단계이다. 예를 들어 render 함수를 호출해서 이전값과 비교하는 방식이다. 이렇게 계산한 변경을 반영하는 단계가 커밋이다.

렌더링 단계에서 사용하는 메서드는 비교 계산을 위해 여러번 호출될 수 있는데 이 메서드 안에서 부작용을 포함하지 않는 것이 중요하다. 메모리 누수 등 예측하지 못한 문제를 일으킬수 있기 때문이다.

Strict 모드는 렌더링 단계의 메서드에 부작용이 있는지를 검사한다. 만약 리액트가 경고한다면 부작용 코드를 커밋 단계로 옮기는 것이 좋다. 렌더링 단계에서는 부작용 코드를 여러번 실행할 것이기 때문이다.

참고로 리액트는 Strict 모드에서 렌더링 단계의 메서드를 두 번씩 호출한다. 부작용 문제를 진단할 목적이다.

> ... 문제가 되는 부분을 발견할 수 있게 도와 줍니다. 이는 아래의 함수를 의도적으로 이중으로 호출하여 찾을 수 있습니다.
>
> - constructor, render, shouldComponentpdate, getDerivedStateFromProps
> - 함수 컴포넌트 바디
> - State updater
> - useStaet, useMemo, useReducer

CRA로 만든 코드에서 이 모드를 기본으로 사용한다. 비슷한 현상을 본 것같다. HTTP 중복 요청, 로그 중복 기록 등.

**5) 레거시 컨택스트 사용 여부**: 레거시 컨택스트는 잘 모르겠다. 리액트 정식 API로 포함되기 전의 컨택스트를 말하는가 보다.

# 운영 환경에서는?

그럼 운영 환경에서는 어떻게 동작할까?

> 생명주기 메서드들은 프로덕션 모드에서 이중으로 호출되지 않습니다.

리액트 개발 버전을 사용해서 로그를 찍어 봤다.

```jsx
// 리액트 개발 버전 사용
// https://unpkg.com/react@18/umd/react.development.js
let count = 0

const App = () => {
  console.log(count++) // 0, 1

  return <div>App</div>
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

로그가 두 번 찍히는 것으로 봐서 App 함수를 두 번 호출했다. `<StrictMode>`가 어플리케이션을 진단하려고 이중으로 호출한 것이다.

리액트 운영 버전을 사용해 로그를 찍어 봤다.

```jsx
// 리액트 개발 버전 사용
// https://unpkg.com/react@18/umd/react.production.min.js
let count = 0

const App = () => {
  console.log(count++) // 0
  return <div>App</div>
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

`<StrictMode>`를 사용했지만 로그가 한 번만 찍혔다. 리액트는 운영보드에서 이 컴포넌트가 있더라도 동작하지 않는다.

# 어디서 사용할까?

CRA 뿐만아니라 여러 오픈소스 프로젝트에서 이 모드를 사용하고 있었다.

Next.js는 설정 파일로 Strict 모드를 활성화할 수 있다[React Strict Mode | Next.js](https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode). 이 옵션을 사용하길 강력히 권고하고 있다.

Gatsby.js는 아직 사용하고 있지는 않은 것 같다. 사용하자는 의견만 있다([Wrap apps in StrictMode in develop](https://github.com/gatsbyjs/gatsby/discussions/25813)).

내 블로그가 개츠비 기반이다. Strcit 모드를 사용해 보니 역시나 경고가 뜬다.

```
Warning: Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://fb.me/react-unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: SideEffect(NullComponent)
```

아마 서드 파티 라이브러리가 원인인 듯하다.

# 결론

앞으로는 리액트를 사용할 때마다 이 모드를 사용해야겠다. 리액트 문서를 빠짐없이 보는 게 힘들고 리액트를 잘 안다고 자신할 수 없기 때문이다. 도구의 도움을 받아서 안전하고 다음 버전의 리액트 사용을 준비해야겠다. 회사에서 맡은 프로덕트에도 도입하자.

참고

- [샘플코드](https://gist.github.com/jeonghwan-kim/cc9e0763091f0aacd896188cac2a0c60)
