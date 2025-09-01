---
slug: "/series/2021/04/08/lecture-react-intro.html"
date: 2021-04-08
title: "[리액트 1부] 만들면서 학습하는 리액트: 소개편"
layout: post
category: 연재물
series: "[리액트 1부] 만들면서 학습하는 리액트"
tags: [react]
---

# React.js 소개

## 데이터와 화면을 연결하는 방법

리액트나 뷰 같은 UI 라이브러리의 가장 큰 특징은 화면에 출력되는 유저 인터페이스를 상태로 관리할 수 있다는 점이다. 브라우저는 돔(DOM)을 통해 어플리케이션을 렌더링하는데 라이브러리 없이 자바스크립트만으로 그려보자.

이전 준비편을 떠올려 보자. UI를 담당한 뷰는 템플릿 객체로부터 HTML 마크업 문자열을 가져와 엘리먼트의 innerHTML 속성에 저장했다. 브라우져는 이 문자열을 파싱해서 만든 엘리먼트를 사용한다.

엘리먼트는 문서를 구성하는 기본 요소인데 document.createElement() 함수로 만들 수 있다. innerHTML를 사용하는 것과 달리 엘리먼트를 직접 만드는 함수다. CSS 클래스 이름을 지정하거나 이벤트 핸들러를 사용하는 등의 옵션을 추가할 수 있다.

데이터를 화면에 출력하는 일련의 코드를 살펴보자.

```js
let data = "Hello world" // 1
const title = document.createElement("h1") // 2
document.body.appendChild(title) // 3
title.textContent = data // 4
```

데이터를 준비한다(1). 문자열을 출력할 앨리먼트를 생성하고(2) 기존 문서에 추가한다(3). 마지막으로 앨리먼트의 텍스트를 준비한 데이터로 설정한다(4)

데이터를 수정하고 화면에도 반영하려면 두 가지 작업이 필요하다.

```js
data = "안녕하세요" // 1
title.textContent = title.textContent = data // 2
```

먼저 데이터를 수정한다(2). 그리고 이 값을 앨리먼트에 반영한다(2).

이 방식을 조금 개선해보자. data 변수와 title 엘리먼트가 어떤 방식으로든 서로 연결되어 있다. data 변수에 값을 변경하면 title 엘리먼트의 내용도 변경되도록 말이다. 그러면 data는 UI 상태를 담는 역할이라고 할 수 있겠다. 이러한 개선의 이점은 돔 API를 직접 호출할 필요없이 상태만 관리함으로써 UI까지도 자동으로 제어할 수 있다는 점이다.

그럼 다음 장에서 그렇게 만들어 보자.

## 리액티브

코드를 좀 변경해 보겠다.

```js
const state = { _data: "hello world" } // 1

const h1 = document.createElement("h1")
document.body.appendChild(h1)

const render = _ => (h1.textContent = state.data) // 2
```

상태를 의미하는 state라는 이름의 객체로 만들어 그 안에 "hello world" 문자열을 갖는 \_data 키와 함께 넣어 두었다(1). 이전의 data 변수를 객체로 감싼 셈이다.

엘리먼트에 상태값을 반영하는 render() 함수를 만들었다(2). render() 함수를 실행하면 state.data의 값이 엘리먼트에 반영되어 화면에 출력하려는 의도다. 그런데 state.data는 아직 없다.

Object.defineProperty() 메소드를 사용해 보자. 이 정적 메소드를 사용하면 객체의 속성에 접근하는 게터와 세터 함수를 추가할 수 있다.

- Object.defineProperty(obj, prop, descriptor)

이 함수롤 state 객체에 data 속성을 정의해 보겠다.

```js
Object.defineProperty(state, "data", {
  //1
  get() {
    console.log("get()")
    return state._data
  },
  // 2
  set(value) {
    console.log("set()", value)
    state._data = value
    render() // 3
  },
})
```

함수 시그니처에 따라 대상 객체인 state와 정의할 속성 이름 "data"를 문자열로 전달했다. 그리고 descriptor 객체를 설정할 수 있는데 속성에 접근하는 게터(get())와 세터(set()) 함수를 정의할 수 있다(3).

게터에서는 \_data의 값을 그대로 반환(1)하고 세터에서는 인자로 들어온 값을 \_data 에 할당했다(2). 이제 data 속성에 접근할 때 다른 로직을 추가할 수 있는 기회가 생겼다. 위 코드에서는 로그만 기록하도록 했다. state.data로 접근하거나 값을 할당하면 각 로그가 찍힐 것이다.

state.data에 값을 할당하면 UI를 업데이트 작업을 추가한다. render() 함수를 빼둔 것이 바로 이 때문이다. data 값을 변경하고 나면 곧장 render() 함수를 실행해(3) UI를 업데이트할 것이다. 데이터 변경이 자동으로 UI까지 영향을 미치는 것이다.

아래 전체 코드를 보면서 흐름을 정리하자.

```js
// 데이터를 가지는 상태 객체
const state = { _data: "hello world" }

// 엘리먼트를 준비한다
const h1 = document.createElement("h1")
document.body.appendChild(h1)

// DOM에 변경된 내용을 반영하는 함수
const render = () => (h1.textContent = state.data)

// state.data 속성을 추가한다. 게터/세터를 만든다.
Object.defineProperty(state, "data", {
  get() {
    return state._data
  },
  set(value) {
    state._data = value
    render()
  },
})

// "Hello world" 가 출력된다.
render()

setTimeout(() => {
  // state.data 값을 변경하는 것만으로 "안녕하세요"가 화면에 출력된다.
  state.data = "안녕하세요"
}, 1000)
```

이전 편은 데이터와 앨리먼트를 동시에 변경하면서 화면을 제어했다. 이번 편에서는 데이터만 제어하면 자동으로 화면까지 반응한다. 이렇게 특정 값에 의존해 자동으로 반응하는 것을 **리액티브(reactive) 하다**라고 표현한다.

리액트를 비롯한 모던 UI 라이브러리는 이러한 리액티브한 특징을 가지고 있다. MVC 모델에서는 컨트롤러가 데이터와 뷰를 직접 관리한다. 어플리케이션을 동작시킬 때 모델도 변경하고 뷰도 빠짐없이 챙겨야하는 것이다.

한편 UI 상태를 나타내는 것을 뷰모델(View Model, 줄여서 VM)이라고 하는데 컨트롤러의 역할을 뷰모델이 일부 대체한다. 뷰모델을 변경하는 것만으로 UI를 자동으로 갱신하기 때문이다. 어플리케이션의 움직이는 모습을 기술하는 것 보다 상태만 기술하는 방식이 더 선언적이고 읽기 쉬운 코드를 만들 수 있다.

## 가상돔

데이터만 관리하면 값의 변화가 UI까지 반영되다는 것은 무척 매력적인 아이디어다. 코드양이 줄어드니깐. 그만큼 버그도 줄어 든다. 한편 상태 변화가 UI에 반영되려면 DOM API 호출은 불가피하다. 상태가 변하는 횟수만큼 돔 API 호출은 비례한다. 이것은 곧장 브라우져 성능에 영향을 주는 요인이 된다.

브라우져가 HTML과 CSS로 화면을 그리는 과정은 다음과 같다.

1. HTML 코드를 파싱해서 DOM 트리를 만든다
1. CSS 코드를 CSSOM 트리를 만든다
1. 두 트리를 합쳐 렌더트리를 만든다
1. 레이아웃을 계산한다
1. 픽셀로 화면에 그린다

주요렌더링경로(Critical Render Path)라고도 불리는 이 과정은 자바스크립트로 돔 구조를 변경하면 레이아웃다시 계산에 픽셀로 화면에 다시 그린다. 돔을 수정한만큼 이 작업이 반복되기 때문에 페이지 렌더링 성능에 영향을 주는 요소이다.

어떻게 개선할 수 있을까? 아주 단순한 방법은 돔 API를 적게 사용하면 된다. 어떻게 횟수를 줄인다 말인가?

캐쉬. 디스크에 담겨있는 프로그램 명령어는 CPU까지 가야만 실행된다. 디스크에 접근하는 시간은 비교적 무척 느리기 때문에 이를 개선하기 위해 중간에 메모리를 캐쉬로 두어 명령어 로딩 속도를 올리는 것이다. 돔 호출도 이런식으로 캐쉬 계층을 두면 해결할 수 있지 않을까?

트리 구조의 돔과 유사한 **가상돔(Vritual DOM)**을 만들어 메모리에서 관리할 수 있겠다. 어플리케이션에서 화면 변경을 돔에게 직접 요청하는 것이 아니라 가상돔에게 요청한다. 리액트는 렌더링할 때마다 전체 가상돔을 만들고 이전 가상돔과의 차이를 찾는다. 차이가 있는 부분만 실제 돔에 반영하고 차이가 없으면 렌더링 요청이 있더라도 무시하는 방식으로 성능을 낸다.

- 참고: https://www.youtube.com/watch?v=BYbgopx44vo

가상돔은 특정 기술이라기 보다는 패턴이라고 말할 수 있다. 즉 구현하는 방식에 따라 동작하는 것이 조금씩 다를수 있는데 리액트에서는 보통 UI를 말하는 개념이다. 이후에 나올 리액트 앨리먼트(React Element)와 관련되는데 그 때 API를 보면서 살펴보자.

## ⭐중간 정리

순수 자바스크립트의 지난한 과정을 마치고 마침내 리액트를 만나게 되었다. MVC 모델을 사용해서 결과물을 구현했던 이전 편을 떠올려 보자. 모델은 어플리케이션 상태를 관리하고 뷰는 돔으로 UI를 변경한다. 모델과 뷰로 어플리케이션을 관리하는 것이 컨트롤러의 역할이었다.

어플리케이션을 동작하게하려면 상태를 바꾸고 이에 따라 화면도 매번 바꿔주어야 했다. 상태만 변경하면 자동으로 UI를 변경하게 하는 것이 리액티브이다. 리액트는 리액티브 프로그래밍으로 UI 개발을 할 수있도록 돕는 라이브러리다.

프론트엔드 개발에서 돔 제어는 필요하다. 문제는 너무 자주 호출되면 성능에 영향을 준다는 것이다. 매번 DOM에 접근하지 않고 꼭 필요할 때만 접근하는 방식으로 성능을 개선시키는 아이디어가 가상돔이다. 리액트는 가상돔을 가지고 렌더링 성능을 높인다.

리액티브와 가상돔 외에도 리액트는 컴포넌트라는 강력한 추상화 개념을 사용한다. 이것은 나중에 다룰 "컴포넌트편"에서 다룰 예정이다. 이제 리액트로 코딩할 차례다. 다시 키보드에 손을 올리자.

# 헬로 월드로 시작하기

## 헬로 월드

헬로 월드를 찍어보는 것부터 시작하자.

```html
<body>
  <!-- 1 -->
  <div id="app"></div>

  <!-- 2 -->
  <script
    crossorigin
    src="https://unpkg.com/react@17/umd/react.development.js"
  ></script>

  <!-- 3 -->
  <script
    crossorigin
    src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"
  ></script>

  <!-- 4 -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- 5 -->
  <script type="text/babel">
    const element = React.createElement("h1", null, "Hello world") // 6
    ReactDOM.render(element, document.querySelector("#app")) // 7
  </script>
</body>
```

index.html 파일 만들어 리액트 문서에 있는 코드를 가져왔다. 헬로 월드를 화면에 출력한다.

마크업은 아이디 app이란 이름의 div만 있을 뿐인데(1) "hello world"란 문자열을 가진 헤더가 나왔다. 브라우져의 개발자 도구로 돔 구조를 들여다 보면 index.html에 div 엘리먼트 아래에 `<h1>Hello world</h1>` 해딩 엘리먼트가 포함된 것을 확인할 수 있다.

리액트가 어떻게 돔을 변경한 것일까? 헬로 월드에서 사용한 라이브러리 3개(2, 3, 4)의 역할을 하나씩 소개해야겠다.

- React: React 최상위 API
- ReactDOM: DOM API
- Babel: ES6와 오래된 브라우저 지원

## React

DOM에 엘리먼트가 있듯이 리액트 앱에도 **엘리먼트(Element)**라는 개념이 있고 이것은 리액트 앱을 구성하는 최소 단위다. 원자가 모여 물질을 이루듯 리액트 엘리먼트 여러개를 모아 리액트 앱을 만든다. 리액트 엘리먼트는 문서를 표현하는 방식이라는 점에서 돔 엘리먼트와 유사하다.

> "엘리먼트(Element)"는 리액트 앱을 구성하는 최소 단위다.

React 라이브러리가 제공하는 API 중 엘리먼트를 만들 수 있는 것이 바로 createElement() 함수다. "Hello world" 문자열을 담은 h1 엘리먼트를 만들 때 사용했다(6).

```js
React.createElement("h1", null, "Hello World") // 6
```

콘솔 로그로 반환된 값을 찍어보면 돔 엘리먼트와 달리 일반 객체다.

```js
{
  type: "h1",
  props: {
    children: "Hello World"
  }
}
```

인자로 전달한 "h1" 이 type 속성에 "Hello World"가 props 속성에 각각 추가되었다.
그렇다. 이것이 바로 가상돔에 쓰는 녀석인가 보다.

가상돔은 리액트 어플리케이션과 돔 사이에 위치하는 계층으로써 최소한의 연산으로 화면을 그린다. 아직 리액트 앨리먼트 만으로는 가상돔도 없고 따라서 돔에 접근할 수도 없다. 다른 녀석이 또 필요하다. 곧장 ReactDOM을 소개할 차례다.

## ReactDOM

리액트가 만든 가상돔은 일반 객체이다. 리액트가 가상돔을 사용하지 않고 돔을 직접 사용했다면 브라우저에서만 사용하는 라이브러리로 제한되었을지 모른다. 하지만 일반 객체 모양을 갖는 가상돔은 이걸 렌더링하는 환경에 따라 여러 곳에서 사용할 수 있다.

리액트를 웹 브라우저에서 동작하게 하려면 가상돔이 돔 API 호출하도록 하면 될 것이다. 이러한 역할을 하는 것이 **ReactDOM** 라이브러리다. 보통은 웹 개발에서 리액트를 사용한다고 하면 react + reactDOM을 사용하는 것이다.

한편 브라우져를 넘어 iOS나 안드로이드 같은 네이티브 앱에서도 리액트를 사용할 수 있다. 리액트의 가상돔이 네이티브 API 호출하는 것 처럼 말이다. 리액트 네이티브는 리액트로 만든 코드를 iOS나 안드로이드 플래폼에서 동작할 수 있게 해주는 라이브러리다.

리액트의 이러한 확장성은 데스트탑 어플리케이션 개발에도 사용될 수 있다. react-native-windows는 리액트 코드를 맥과 윈도우 환경에서 동작할 수 있게 해주는 라이브러리다(이전 react-native-desktop은 디프리케이트 됨).

리액트 다음으로 가져온 라이브러리가 바로 리액트돔이다(3).

```html
<!-- 3 -->
<script
  crossorigin
  src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"
></script>
```

그리고 어플리케이션에서는 리액트 엘리먼트를 ReactDOM.render() 함수의 인자로 전달한다.

```js
ReactDOM.render(element, document.querySelector("#app")) // 7
```

ReactDOM.render() 함수는 리액트 앨리먼트를 받아서 가상돔을 만들기 시작한다. 이렇게 만들어진 가상돔은 진짜 돔에 반영되고 그 위치는 두 번째 인자로 전달한 아이디 app의 앨리먼트의 자식이다. 이런 과정을 통해 리액트 어플리케이션이 돔에 반영된다.

## Babel

세번째에 로딩한 Babel은 준비편에서 이미 보았다.

```html
<!-- 4 -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

최신 자바스크립트 문법을 브라우저에서 사용하기 위한 도구로 대부분의 브라우져를 지원할수 있는 코드로 변환한다.

리액트 공식문서에는 바벨 따위의 트랜스파일러 없이도 개발할 수 있는 방법을 안내한다.

- [ES6 없이 사용하는 React](https://ko.reactjs.org/docs/react-without-es6.html)

하지만 실제 개발 프로젝트를 진행 해보면 이것만으로는 금방 한계를 느낀다. 앞으로 다룰 리액트 컴포넌트는 클래스 문법을 사용하는 것이 보다 편하다. 클래스 문법을 포함한 최신 자바스크립트를 사용할 때 바벨이 필요하다. 뿐만 아니라 앞으로 소개할 JSX 문법을 사용할 때에도 바벨이 필요하다.

보통은 터미널 명령어를 실행하거나 웹팩같은 번들러로 통합해서 사용한다. 이러한 환경을 구성하는 것은 또 다른 학습이 필요할 수도 있는 영역이다. 이 글에서는 어디까지나 리액트 실습이 목적이기 때문에 최소한의 개발 환경을 유지하겠다.

바벨 사용해 대한 자세한 내용은 아래 글과 영상을 참고하자.

- [글 - 프론트엔드 개발환경의 이해: Babel](https://jeonghwan-kim.github.io/series/2019/12/22/frontend-dev-env-babel.html)
- [인프런 - 프론트엔드 개발환경의 이해와 실습](https://www.inflearn.com/course/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD)

```html
<!-- 1 -->
<script type="text/babel">
  const element = React.createElement("h1", null, "Hello world")
  ReactDOM.render(element, document.querySelector("#app"))
</script>
```

바벨 라이브러리를 로딩한 뒤에는 script 태그의 type="text/babel" 속성을 사용해 자바스크립트 코드를 작성한다(1). 바벨은 이 부분의 코드 조각을 변환할 것이다.

## 템플릿 언어

엘리먼트를 생성할 때 document.createElement() 함수를 사용한다. 트리 형태의 돔에 맞게 엘리먼트를 구성하려면 엘리먼트 간의 부모-자식 관계를 만들어야 한다. 가령 아래 두 엘리먼트는 부모-자식 관계다

```js
const h1 = document.createElement("h1") // 1
const header = document.createElement("header") // 2
header.appendChild(h1) // 3
```

엘리먼트 h1을 만들고(1) 이걸 자식으로 갖을 header 엘리먼트도 만든다(2). 그리고 나서 appendChild() 함수를 이용해 h1을 header의 자식 엘리먼트로 만들었다(3).

트리 형태의 웹 문서 구조상 이런 코드는 늘어나기 마련이다. 문제는 UI를 나타내는 코드가 읽기 어렵다는 것이다. 코드를 유심히 들여다 봐야만 UI를 가늠할 수 있다.

그래서 대안으로 나오는 것이 템플릿 언어다. 핸들바, Pug가 대표적이고 앵귤러와 Vue.js도 나름의 템플릿 기능을 지원한다.

그럼 리액트는 어떤가? 리액트 자체는 템플릿 언어를 지원하지 않는다. 그야말로 UI만 담당하는 아주 작은 라이브러리이기 때문이다.

리액트 엘리먼트를 생성하는 함수인 createElement()로 자식 요소를 추가할수는 있지만 썩 쉬운 편은 아니다.

```js
const h1 = React.createElement("h1", null, "Hello world")
const header = React.createElement("header", null, h1)
```

개발을 할 수는 있지만 개발해야 UI가 늘어날 수록 불편한 것이 사실이다. 읽기 어려운 코드가 되기 때문이다.

리액트에서는 JSX라는 자바스크립트 확장 문법을 사용한다.

## JSX

JSX(JavaScript XML)는 자바스크립트의 확장 문법이다. UI 다루는 코드의 가독성을 높이기 위해 고안된 문법이다. 이전 장에서 보았듯이 createElement() 함수를 직접 사용하는 방식은 읽기 어려운 UI 코드를 만들 수 밖에 없다.

JSX는 마치 마크업 문법 같다.

```js
<h1>Hello world</h1> // React.createElement('h1', null, 'Hello world')
```

JSX를 사용하면 리액트 UI 코드의 모습이 HTML과 닮는다. 돔 구조와 유사하기 때문에 코드로부터 UI을 쉽게 추측할 수 있다. JSX로 만든 코드는 바벨에 의해 변환되는데 React.crateElement() 함수 호출로 대체 된다. [바벨 REPL](https://babeljs.io/repl/#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=DwCwjAfAEgpgNnA9sA9OCQ&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.13.14&externalPlugins=)에서 직접 JSX 코드가 자바스크립트로 변환되는 모습을 확인해 보자.

부모/자식 관계도 HTML과 같다.

```js
<header>
  <h1>Hello world</h1>
</header>
```

확실히 UI 코드의 가독성이 개선되었다. 이것도 마찬가지로 바벨에 의해 React.createElement() 함수 호출로 변환된다. 리액트 엘리먼트를 반환하기 때문에 때문에 ReactDOM.render()의 인자로 전달될 수 있다.

헬로 월드 코드를 JSX 문법을 사용해보자.

```js
// 1
const element = (
  <header>
    <h1>Hello world</h1>
  </header>
)

// 2
ReactDOM.render(element, document.querySelector("#app"))
```

JSX는 자바스크립트 표현식이기 때문에 값으로 평가되고 반환된 리액트 앨리먼트를 element 상수에 할당했다(1). 이 엘리먼트를 ReactDOM.render()에 전달하면 가상돔을 만들고 이걸 "#app" 엘리먼트에 붙여 렌더링되고 우리눈에 "hello world"란 텍스트를 볼 수 있는 것이다.

JSX의 개념에 대해 알아보았다.

## ⭐중간 정리

헬로 월드 코드를 볼 때마다 좀 설레였던 것 같다. 시작이 반이라고 이렇게 작은 코드가 돌아가는 모습을 보면 웬지 리액트를 다 배운것 같은 생각도 들기 때문이다. 공식 문서에 나온 헬로 월드 코드를 통해서 리액트가 UI를 어떻게 다루는지 살펴 보았다.

리액트 앱을 이루는 최소단위가 리액트 엘리먼트인데 이걸 리액트 라이브러리의 React.createElement() 함수로 만들수 있다.

리액트 엘리먼트를 가상 돔으로 만들어 실제 돔에 반영해 주는 것이 바로 ReactDOM의 역할이다. 리액트를 사용하려면 반드시 이 두 개의 라이브러리를 사용해야 한다.

리액트 코딩을 편하게 하려면 바벨같은 트랜스파일러의 도움을 받는 것이 좋다. 클래스, JSX 문법을 사용할 수 있게끔 해주기 때문이다.

JSX는 UI 코드의 가독성을 높여준다. 함수 호출만으로도 리액트 어플리케이션 개발이 가능하지만 약간의 문법을 가미하면 생각보다 UI 개발 환경이 편해진다.

이렇게 React, ReactDOM, Babel, JSX에 대해 알아 보았다. 이제야 비로소 리액트를 본격적으로 사용할 수 있는 준비가 되었다. 다음 장은 프로젝트 구조를 리액트 개발에 맞게 구성한 뒤 이번 편을 마무리하도록 하겠다.

# 실습에 맞게 개선하기

## 시작점

이제 헬로 월드를 넘어 요구사항을 개발할 기반 코드를 만들어 볼 차례다. 실무에서는 CRA(create-react-app) 같은 툴이나 웹팩을 이용해 개발환경을 구성하겠지만 철저히 실습 목적으로 리액트 자체에 집중해야할 필요가 있다. 이러한 상황을 고려해 헬로 월드 코드를 아주 조금만 발전시켜 보자.

```html
<script
  type="text/babel"
  data-presets="react"
  data-type="module"
  src="js/main.js"
></script>
```

헬로 월드 코드를 별도 파일(js/main.js)을 로딩하는 방식으로 변경했다. 이렇게 하는 이유는 두 가지가 있다.

첫째, 코딩 양이 많아지기 때문에 html 파일 안에서 관리하는 것은 한계가 있다. 별도의 자바스크립트 파일을 만들어야 쉽게 알아볼 수 있다.

```js
const element = <h1>Hello world</h1>
ReactDOM.render(element, document.querySelector("#app"))
```

둘째, main.js는 자바스크립트 코드의 시작점일 뿐, 이후에 모듈별로 파일을 추가할 예정이다. 그때마다 import 키워드를 사용해서 파일을 로드한다. data-type="module"을 사용하면 바벨이 import 키워드를 사용할 수 있게 해준다.

헤더 부분에는 미리 만들어 놓은 스타일 시트도 로딩해 놓자.

```html
<link rel="stylesheet" href="./style.css" />
```

다음 장에는 지금까지 얻은 지식을 이용해 검색 화면 헤더를 만들어 보겠다.

## 헤더 구현

헬로 월드를 지우고 헤더를 만든다.

```js
const element = (
  <div>
    <header>
      <h2 className="container">검색</h2> // 1
    </header>
  </div>
)
```

JSX는 일반 HTML 코드처럼 엘리먼트 안에 자식 요소를 얼마든지 추가할 수 있다. 일반 HTML 문서를 작성 하듯이 코딩한다.

코드를 읽기 쉽게 하려고 JSX를 여러 줄로 나눴다. 그리고 자바스크립트 엔진이 자동으로 세미콜론을 넣어주는 과정을 피하기 위해 소괄호로 묶어주는 것을 권장하는 편이다.

JSX의 모양은 HTML이지만 실제로는 자바스크립트이기 때문에 사용하는 방법이 조금 다르다. 그 중 하나가 속성 이름인데 HTML은 소문자만 사용한 반면 JSX는 카멜 케이스를 사용한다. 예를 들어 tabindex → tabIndex, onclick → onClick 으로 사용하는 식이다.

스타일 클래스 이름을 지정하는 class는 조금 예외인데 자바스크립트에서 class는 예약어 이기 때문에 JSX는 className이란 속성을 따로 사용한다. 검색 타이틀에 미리 만들어둔 스타일 클래스를 지정하기 위해 className 속성을 사용했다(1).

이렇게 만든 리액트 엘리먼트는 ReactDOM에 의해 화면에 표시된다.

## ⭐중간 정리

리액트 헬로 월드 코드를 변경해서 실습에 맞는 프로젝트 구조를 만들었다. 웹팩 같은 번들러를 사용하지 않고 CDN에서 가져온 바벨과 리액트 라이브러리만 사용해서 최소한의 실습환경을 유지한다.

실습을 진행하면서 자바스크립트 코드가 많아질 것에 대비해서 HTML에 있던 자바스크립트 코드를 별도 파일로 분리했다.

지금까지 소개한 리액트 지식만으로 검색 페이지 상단에 위치한 헤더를 만들었다.

# 🌟최종정리

소개편에서는 리액트의 개념적인 부분을 설명했다. 이거 뭐 실습 위주라고 하더니만 서론이 너무 긴 것 아닌가라는 불만이 들지도 모르겠다. 미안하다. 사실 리액트를 시작하려면 짚고 넘어가야 하는 개념이 있는데 이걸 실습중에 다루는 건 좀 설명하기가 좀 어려웠다. 뭔가 조리있게 말하는건 건 참 어렵다는 걸 다시 한 번 실감한다.

그래도 헬로 월드 코드에서 시작해서 리액트로 코딩을 시작했다는 것에 의미를 두자. 간단한 헬로 월드 코드이지만 그 안에는 리액트 앨리먼트와 가상돔이 어떻게 화면에 표시되는지 흐름을 볼 수 있었다. 그리고 UI 코드를 읽기 쉽게 만들수 있는 JSX로 코드를 개선해 보기도 했다.

다음 편부터는 진짜로 리액트를 사용할 것이다. 진짜다. 순수 자바스크립트로 구현했던 부분을 다시 한 번 리액트로 만들어 볼 것이다. 기대하고 다음 장으로 넘어가자.

---

<a href="https://www.inflearn.com/course/만들면서-학습하는-리액트?inst=b59d75f4" target="_blank">
  "리액트 1부: 만들면서 학습하는 리액트" 수업 보러가기  
  <img width="400px" src="https://cdn.inflearn.com/public/courses/326905/cover/739f7b4b-1a9f-478f-a6a8-1a13bf58cae3/326905-eng.png" />
</a>
