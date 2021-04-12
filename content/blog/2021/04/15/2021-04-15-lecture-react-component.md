---
title: "만들면서 학습하는 리액트: 컴포넌트편"
layout: post
category: series
seriesId: 3f5eff34-efcf-5aa0-b770-b7a01e329ae7
tags: [react]
---

# 리액트 컴포넌트 소개

## 컴포넌트를 사용하는 이유

사실 이전 편에서 우리는 이미 컴포넌트를 사용하고 있었다. 어플리케이션 자체를 의미하는 App 컴포넌트가 그것이다. 전체 어플리케이션의 상태와 유저 인터페이스를 관리하는데 사용했다.

이 모습은 마치 큰 서랍장 안에 모든 물건을 넣어 놓은 것과 비슷하다. 나중에 뭔가를 서랍에서 찾으려고 할 때 복잡한 서랍 안을 한참 뒤져야할 수도 있기 때문이다. 반면 서랍을 칸막이로 분할해서 용도에 맞게 분류해서 수납해 놓으면 빠르고 쉽게 찾을 수 있을 것이다.

지금의 거대한 App 컴포넌트는 코드를 읽고 수정하는데 어려울 수 있다. 어플리케이션의 모든 상태와 UI을 하나의 컴포넌트가 전담하기 때문이다. 서랍을 용도에 맞게 칸막이로 나누듯 컴포넌트도 역할에 따라 더 작은 컴포넌트로 나눌 수 있다. 작은 컴포넌트는 비교적 읽기도 쉽고 수정하기도 안전하다.

프로그래밍을 경험이 있다면 함수나 클래스로 추상화하는 것과 같다. 모든 코드를 절차적으로 작성하다보면 코드양이 많아지고 전체 코드를 모두 머릿속에 담고 있어야만 프로그램을 알 수 있다.
하지만 추상화 기법을 사용하면 하나의 역할을 수행하는 코드 덩어리에 이름을 부여하기 때문에 프로그램 파악하는 것이 비약적로 매우 쉬워진다.

특정 역할을 수행하는 코드를 함수로 분리하고 "Login" 이라는 이름표를 붙여주면 이때부터 이름만 보고도 코드의 내용을 알 수 있게 되는 것이다. 여러 속성과 동작을 표현하는 코드를 클래스로 분리하고 User 라는 이름표를 붙여주면 이때부터 이름표만 보고도 사용자를 기술한 코드인 것을 알 수 있다.

어플리케이션 상태와 유저 인터페이스 코드를 컴포넌트로 분리하고 LoginComponent 라는 이름표를 붙이면 내부 코드를 모두 들여다보지 않고도 로그인 UI를 다루는 코드라는 걸 쉽게 알 수 있다. 이처럼 컴포넌트를 사용하면 개발자는 추상화된 코드를 비약적으로 암기할 수 있고 개발자는 더 크고 복잡한 코드를 만들 수 있는 힘이 생기는 것이다.

## 작은 컴포넌트로 나누기

이 거대한 App 컴포넌트를 역할에 따라 잘게 분할해 보자. 다른 추상화 기법처럼 컴포넌트를 나누는 기준 중의 하나는 "단일 책임 원칙"이다. 컴포넌트는 하나의 역할만 가져야 한다. 먼저 App 컴포넌트의 역할을 나열해 보자.

헤더를 출력한다
검색폼에 검색어 입력을 받는다
엔터를 누르면 검색하고 결과를 보여준다
추천 검색어, 최근 검색어 탭이 있다
각 탭을 클릭하면 추천 검색어 목록, 최근 검색어 목록이 각 각 표시 된다.

이 역할들을 각각의 컴포넌트로 나눠서 위임하도록 하자.

![컴포넌트 설계]()

Header는 상단에 제목을 보여준다
SearchForm은 검색어를 입력받는 받는다. SearchResult는 불러온 검색 결과 목록을 보여준다.
Tab 은 추천 검색어, 최근 검색어 탭을 보여주고 선택할 수 있다.
KeywordList는 키워드 목록을 보여주고 선택할 수 있다. HistoryList로 대체될 수 있는데 최근 검색어 목록을 보이고 선택할 수 있다.
모든 컴포넌트를 둘러싸는 App은 전체 컴포넌트를 관리한다.

## 프로젝트 구조 변경하기

지금까지와는 달리 웹팩과 바벨로 구성된 개발 환경을 사용해야겠다. 컴포넌트를 하나의 파일에 만드는 것이 코드를 관리하는데 편리하고 리액트 개발의 관례이기도 하다. 여러 파일을 모듈로 서로 연결하려면 지금까지 사용한 바벨 스탠드얼론 버전으로는 한계다. 여러 파일을 다루기 위해 웹팩과 바벨을 이용해서 실습 환경을 바꾸었다. 이 부분은 별도 내용이므로 지나가겠다. 아래 링크를 참고하라.

- [프론트엔드 개발환경의 이해 - 웹팩(기본)](/series/2019/12/10/frontend-dev-env-webpack-basic.html)
- [프론트엔드 개발환경의 이해 - 웹팩(심화)](/series/2020/01/02/frontend-dev-env-webpack-intermediate.html)

시작점이기도 하고 이전 편에서 전체코드를 담고 있는 main.js는 루트 컴포넌트인 App을 ReactDOM에게 전달하는 로직만 남겨 둔다.

```js
import React from "react" // 1
import ReactDOM from "react-dom" // 2
import App from "./App.jsx" // 3

ReactDOM.render(<App />, document.querySelector("#app"))
```

CDN을 사용하지 않고 NPM 저장소에서 프로젝트로 라이브러리를 가져왔기 때문에 ES6 모듈시스템으로 이를 가져오는 방식으로 변했다. JSX를 사용하기 위해 react 패키지를 가져온다(1). ReactDOM의 render() 함수를 사용할 목적으로 react-dom 패키지도 가져온다(2). 앞으로 만들 부모 컴포넌트인 App 컴포넌트도 가져온다(3). jsx를 사용하는 컴포넌트 코드가 있는 파일은 jsx 확장자를 사용한다.

이어서 App.jsx 파일을 추가하자

```js
class App extends React.Component {
  render() {
    return <>TODO: App 컴포넌트</>
  }
}

export default App
```

리액트 컴포넌트를 만들어 리액트 앨리먼트를 반환하는 render() 메소드만 정의했다.

이전 구현에서는 이 App 컴포넌트 하나로 동작했다. 하지만 이제부터는 각 컴포넌트를 정의하고 그것 들을 잘 이용해서 관리하는 루트 컴포넌트가 될 것이다.

## Header 구현하기: 함수 컴포넌트

그동안 우리는 Component 클래스를 상속한 App 클래스로 컴포넌트를 만들었다. 하지만 리액트에서는 이것 말고도 컴포넌트를 만들 수 있는 방법이 하나 더 있는데 "함수 컴포넌트"이다. 이런 모양새다.

```js
const Hello = () => <>Hello world</>

<Hello />
```

일반 함수다. 단 리액트 앨리먼트를 반환하는 함수여야 한다. 클래스 컴포넌트에 비해 비교적 코드가 적다. 클래스 컴포넌트와 가장 큰 차이는 state가 없다는 점이다. 내부 상태가 필요없는 컴포넌트라면 함수 컴포넌트를 사용한다.

가장 먼저 만들 Header 컴포넌트가 바로 함수 컴포넌트로 만들면 적합한 경우다. 내부에서 관리할 상태가 없기 때문이다. 화면 상단에 있는 헤더 영역은 타이틀만 출력하는 정적 엘리먼트이기 때문에 바로 만든다면 이렇게 할 수 있다.

```js
const Header = () => (
  <header>
    <h2 className="container">검색</h2>
  </header>
)
```

인자도 없이 바로 검색 타이틀 문자를 포함한 리액트 앨리먼트를 반환하는 함수다. App 컴포넌트에서는 단 한줄로 헤더 코드가 대체될 수 있다.

```js
<Header />
```

컴포넌트로 분리하기 전에는 App 컴포넌트 안에서 헤더 엘리먼트를 구체적으로 기술했다. 반면 Header 컴포넌트를 사용한 후에는 내부 구현이 감추어져 있고 단순히 Header 컴포넌트를 선언해 놓기만 했다. 바로 이것이 컴포넌트의 추상화 능력이다.

## 재활용 가능한 컴포넌트로 개선하기

함수 컴포넌트와 클래스 컴포넌트의 차이는 상태의 유무다. 하지만 상태가 없다는 것은 그동안 우리가 누누히 말해왔던 리액티브 개념과 대치된다. 이 개념은 상태 변화를 UI에 자동으로 반영하는 것이기 때문이다.

리액트 컴포넌트에서 UI 상태로 사용할 수 있는 것이 State 말고도 Props가 있다. State가 컴포넌트 내부에서 관리는 상태라면 Props는 컴포넌트 외부에서 전달받는 상태다. 컴포넌트를 사용하는 측에서 속성에 값을 전달하고 이를 수신한 컴포넌트가 이 값에 의존에 리액트 앨리먼트를 만들면 Props 변화에 따라 UI도 반응한다.

```js
const Hello = ({ name }) => <>Hello {name}</>  // 1

<Hello name="world" /> // 2
```

Props는 객체로 컴포넌트에게 전달된다. 이 값을 리액트 앨리먼트 생성시 사용한다(1). 프롭스를 전달할 적에는 속성 이름으로 전달한다(2). Hello 컴포넌트는 전달된 name 값이 변하면 다시 렌더링한다.

우리가 만든 Header 컴포넌트는 다른 화면의 헤더로 사용할 가능성이 충분하다. 하지만 이미 타이틀이 컴포넌트 안에 하드코딩 되어 있기 때문에 지금으로서는 재활용이 불가능하다. 어떻게 하면 Header 컴포넌트를 다른 화면에서도 다른 타이틀을 가지고 쓸수 있을까?

프로그래밍에서 함수는 재활용할 수 있는 대표적인 개념이다. 함수 본연의 로직을 함수 본체 코드로 담고 있고 유동적인 코드만 함수의 인자를 통해 전달하는 방식이다. 컴포넌트도 마찬가지다. 바로 Props 인자를 통해 재활용할 수 있다.

Header 컴포넌트를 조금만 더 수정해 보자.

```js
// 1
const Header = ({ title }) => (
  <header>
    <h2 className="container">{title}</h2> // 2
  </header>
)

class App extends React.Component {
  render() {
    return <Header title={“검색"}  />
  }
}
```

아무것도 없었던 인자에 props를 받도록 허용했다(1). 그리고 “검색"이라는 문자열 값으로 하드코딩되어 있던 부분에 인자로 받은 title 값을 사용했다(2).

컴포넌트를 사용할 때는 title 속성에 “검색" 문자열을 전달한다. Header라는 컴포넌트에 title까지 정하고나니‘아 검색 헤더구나'라는 생각이 들기도 한다. 가독성 측면에서도 더 나아졌다.

## ⭐중간정리

리액트의 세번째 개념인 컴포넌트를 다루었다. 관련된 코드 덩어리를 모아 하나의 독립적인 개념으로 만드는 추상화 기법은 프로그래밍에서 개발자의 사고력을 비약적으로 높여준다. 상태와 UI 코드로 이루어진 화면 개발에서도 컴포넌트라는 개념을 사용해서 추상화 할 수 있다.

사실 이미 우리는 App이란 거대한 컴포넌트를 사용하고 있었다. 어플리케이션의 모든 상태와 UI를 담고있는 컴포넌트이다. 이러한 컴포넌트는 좀 더 세밀하게 역할을 분리해서 작은 컴포넌트로 나누는 것이 좋다. 더 쉽게 읽히고 안전하게 수정할 수 있기 때문이다.

컴포넌트는 클래스 컴포넌트와 함수 컴포넌트 이렇게 두 가지 종류가 있다. 컴포넌트 스스로 상태 관리가 필요한 경우 클래스 컴포넌트를 사용하고 그렇지 않으면 함수 컴포넌트로도 충분하다. 이전 편에서 전체 어플리케이션 상태를 관리하는 단 하나의 App 컴포넌트를 사용했는데 이것이 바로 클래스 컴포넌트이다. 내부 상태가 불필요한 Header 컴포넌트는 함수 컴포넌트를 사용해서 구현했다.

컴포넌트의 state 변화는 컴포넌트가 렌더링하는 UI에 영향을 준다. 컴포넌트는 외부로부터 값을 수신하기도 하는데 이것을 props라고 한다. Props의 값을 UI 에서 사용하면 state와 마찬가지로 리액티브하게 동작한다. 함수 컴포넌트에서는 props를 이용해 UI를 만들수 있기 때문에 리액티브 성질을 유지할 수 있다.

Header 컴포넌트의 타이틀을 props로 전달해 재활용할 수 있는 형태로 개선했다.

이전 편과는 달리 요구사항이 없었지만 몸풀기 차원에서 Header 컴포넌트를 만들어 봤다. 다음 장부터는 요구사항을 하나씩 구현해 보도록 하겠다.

# 컴포넌트로 구현하기 1

## SearchForm 컴포넌트 1

컴포넌트를 이용해 검색폼 요구사항을 하나씩 구현해 보겠다.

**💡요구사항: 검색 상품명 입력 폼이 위치한다.**

**💡요구사항: 검색어를 입력하면 x 버튼이 보이고 없으면 x 버튼을 숨긴다**

이전에는 App이라는 전체 어플리케이션을 담당하는 단일 컴포넌트 내에 검색폼을 구현했다. 검색어 입력 값을 저장하는 searchKeyword와 렌더 함수 안에 위치한 searchForm 엘리먼트 변수가 그것이다. 이를 App 컴포넌트에서 분리해 SearchForm 컴포넌트로 분리할 것이다.

앞으로 컴포넌트 파일을 components 란 폴더에 만들겠다. components/SearchForm.js 파일을 만들자.

```js
// 1
class SearchForm extends React.Component {
  constructor() {
    super()
    // 2
    this.state = { searchForm: "" }
  }

  // 3
  handleChangeInput(event) {
    const searchKeyword event.target.value
    this.setState({ searchKeyword })
  }

  render() {
    const {searchForm} = this.state
    return (
      <form>
        // 4
        <input type="text' placeholder="검색어를 입력하세요" autofocus value="searchForm" onChange=(event => this.handleChangeInput(event)} />
      </form>
    )
  }
}
```

사용자로부터 검색어를 입력받기 때문에 이를 저장할 상태가 필요하다. 따라서 state가 있는 클래스 컴포넌트를 상속해서 만든다(1). input 엘리먼트를 리액트 컴포넌트가 제어하려고 입력값을 저장할 searchForm 상태를 추가했다(2). input에서 입력이 발생하면 처리할 메소드다. 입력 이벤트가 발생할 때마다 입력값을 가져와 searchKeyword 상태에 저장한다(3). searchKeyword와 handleChangeInput() 메소드를 이용해 제어된 input 컴포넌트를 만들었다(4).

이 컴포넌트를 최상단 컴포넌트인 App에서 사용한다.

```js
class App extends React.Component {
  render() {
    return (
      <>
        <Header title={“검색"}  />
        <SearchForm /> // 1
      </>
    )
  }
}
```

헤더 컴포넌트 바로 아래 사용했다(1).

~~💡 요구사항: 검색 상품명 입력 폼이 위치한다.~~

검색어 입력 여부에 따라 보이는 취소 버튼을 추가한다.

```js
class SearchForm extends React.Component {
  render() {
    const {searchKeyword} = this.state
    return (
        <form>
          <input type="text' placeholder="검색어를 입력하세요" autofocus value="searchForm" onChange=(event => this.handleChangeInput(event)} />
          // 1
          {searchKeyword.length > 0 && <button type="reset className="btn-reset" />
        </form>
    )
  }
}
```

입력한 검색어는 searchKeyword 에 저장되어 있기 때문에 이를 이용해 버튼을 조건부 렌더링 한다(1).

~~💡요구사항: 검색어를 입력하면 x 버튼이 보이고 없으면 x 버튼을 숨긴다~~

## SearchForm 컴포넌트 2

**💡요구사항: 엔터를 입력하면 검색 결과가 보인다**

**💡요구사항: x 버튼을 클릭하거나, 검색어를 삭제하면 검색 결과를 삭제한다**

검색어를 입력한 뒤 엔터를 입력하면 검색 결과를 보이게 한다. 기억나는가? MVC에서는 컨트롤러에게 역할을 위임 했었다. 그 통신 수단으로 뷰가 @submit 이벤트를 발행해 외부에서 이를 수신하도록 했다.

SearchForm 컴포넌트도 비슷하다. 검색어 입력만 담당하기 때문에 검색 결과는 제 알바 아니다. 그러면 검색어를 입력하고 엔터를 쳤다는 메세지를 부모 측으로 전달해서 외부에서 처리하도록 위임해야 한다.

리액트 컴포넌트가 외부와 통신하는 유일한 통로는 바로 props 객체다. Header 컴포넌트에 제목을 외부에서 전달할 때 title 속성으로 전달하면 이를 props.title로 받은걸 기억할 것이다. 리액트 컴포넌트는 부모 - 자식 방향으로 데이터를 전달하는 것은 자연스럽다.

반면 SearchForm 컴포넌트는 엔터를 입력하면 폼이 제출된다는 것을 부모 측으로 알려야하는 상황이다. 짐짓 부모-자식 방향으로 props 보내는 것과 어긋나는 것 같다. 하지만 이를 역전시킬 수 있는 방법이 있다. 바로 콜백이다. props에는 어떠한 값이라도 사용할 수 있는데 함수도 전달할 수 있다. props에 함수를 전달하면 자식 컴포넌트에서 이를 호출해 부모로 메세지를 전달할 수 있다.

```js
class SearchForm extends React.Component {
  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.searchKeyword); // + 2
  }

  render() {
    return (
      // 1
      <form onSubmit={event => this.handleSubmit(event)}>
    )
  }
}
```

폼에서 submit 이벤트에 핸들러를 추가한다(1). handleSubmit() 는 폼제출 기본동작을 막아 화면 리프레시를 차단한 뒤 외부에서 받은 onSubmit() 함수를 호출하여 컴포넌트에서 입력 받은 searchKeyword를 전달한다(2).

이를 사용하는 App 측을 보자.

```js
class App extends React.Component {
  // 2
  search(searchKeyword) {
    console.log(searchKeyword)
  }

  render() {
    return (
      <>
        <Header title="검색" />
        // 1
        <SearchForm onSubmit=((searchKeyword) => this.search(searchKeywrod)} />
     </>

    )
  }
}
```

onSubmit이란 이름으로 정의했으므로 이 속성에 함수를 연결했다. 함수가 호출되면 SearchForm 으로부터 검색어를 인자로 수신하게 될것이다. 이걸로 search() 메소드를 호출한다(1). 여기서는 인자가 제대로 넘어 왔는지 로그만 기록했다(2).

~~💡요구사항: 엔터를 입력하면 검색 결과가 보인다 (App에게 위임)~~

SearchForm의 리셋버튼도 마찬가지이다.

```js
class SearchForm extends React.Component {
  render() {
    return (
      // 1
      <form>
        <input />
        {this.state.searchKeyword.length > 0 && (
          <button
            type="reset"
            className="btn-reset"
            onSubmit=((searchKeyword) => this.search(searchKeywrod)}
            onClick={() => this.props.onReset()} // 1
          />
        )}
    )
  }
}
```

reset 버튼 클릭시 props로 전달할 onReset() 콜백 함수를 호출했다(1)

~~💡요구사항: x 버튼을 클릭하거나, 검색어를 삭제하면 검색 결과를 삭제한다~~

## State 끌어 올리기

SearchForm 컴포넌트를 조금 유심히 들여다 보자.

준비편에서는 MVC 모델을 사용했는데 SearchView가 비슷한 역할을 했다. 자신만의 역할을 수행한 뒤 @submit이나 @reset 이벤트로 외부에 알렸다. 컴트롤러는 이벤트를 수신해서 스토어와 다른 뷰를 관리하는 방식으로 개발했다.

사용편에서는 리액트로 다시 만들었는데 App 컴포넌트 하나로 만들었다. state.searchKeyword로 관리하고 render() 메소드에 선언한 searchForm 앨리먼트 변수로 UI를 관리했다. 인풋 입력 이벤트가 발생하면 searchKeyword가 변하고 이에 따라 어플리케이션이 반응하는 구조다. 하나의 App 컴포넌트로 동작하기 때문에 App이 모든 변화와 UI를 관리할 수 있었던 것이다.

한편 지금 컴포넌트 편에서는 SearchForm이라는 별도의 역할을 수행하는 컴포넌트로 쪼개 었다. 가장 큰 변화는 searchKeyword를 컴포넌트 안으로 숨겼다는 점이다. 외부에서는 searchKeyword 값을 조회하거나 변경할 방법이 사라진다. props로 전달한 onSubmit 콜백함수에 인자로 전달해 간접적으로 조회할 수 있는 방식은 있으나 수정할 수 있는 방법은 없다. 요구사항 중 추천 검색어나 최근 검색어를 클릭하면 검색 폼에 이 검색어가 설정되어야 하는 것이 있다. SearchForm 외부에서 이 동작을 수행하게 될텐데 컴포넌트 내부에 searchKeyword가 막혀 있어서 설정할 수 없다.

이렇게 동일한 데이터를 여러 컴포넌트가 의존하는 경우가 생긴다. 이럴 경우에는 가장 부모 컴포넌트로 state를 끌어올리는 것이 좋다.

> 종종 동일한 데이터에 대한 변경사항을 여러 컴포넌트에 반영해야 할 필요가 있습니다. 이럴 때는 가장 가까운 공통 조상으로 state를 끌어올리는 것이 좋습니다. - 출처: 리액트 공식 사이트

SearchForm 컴포넌트의 State를 부모 App 컴포넌트로 끌어 옮기자.

```js
class App extends React.Component {
  constructor() {

    this.state = {
      // 1
      searchKeyword: "",
     }
  }

  handleChangeInput(value) {
    this.setState({ searchKeyword: value }); // 4
  }

  render() {
    return (
      <>
        <Header title="검색" />
        <SearchForm
          value="this.state.searchKeyword"  // 2
          onChange={(value) => this.handleChangeInput(value)}  // 3
          onSubmit={() => this.search(searchKeyword)}
          onReset={() => this.handleReset()}<>
    )
  }
}
```

SearchForm에서 관리했던 searchKeyword를 부모 컴포넌트인 App으로 끌어 올렸다(1). 이 값을 SearchForm에 전달하고(2) 변화함에 따라 값을 갱신할 목적으로 onChange에 콜백을 전달했다(3). 변경값을 상태에 갱신한다(4).

SearchForm 컴포넌트도 변경하자.

```js
// 1
const SearchForm = ({ value, onChange, onSubmit, onReset }) => {
  // 2
  const handleChange = event => {
    onChange(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()
    onSubmit()
  }

  const handleReset = () => {
    onReset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        autoFocus
        value={value} // 3
        onChange={handleChange} // 4
      />
      {value.length > 0 && (
        <button type="reset" className="btn-reset" onClick={handleReset} />
      )}
    </form>
  )
}
```

상태를 옮겼으니 state가 필요없는 함수 컴포넌트로 변경했다(1). input을 제어 컴포넌트로 만들 듯 SearchForm도 제어 컴포넌트로 만들기 위해 props.onChange() 함수로 입력한 값을 전달한다(2, 4). 이 값은 곧장 props.value로 들어와 input의 값으로 반영될 것이다(3).

## SearchResult 컴포넌트

**💡요구사항: 검색 결과가 검색폼 아래 위치한다. 검색 결과가 없을 경우와 있을 경우를 구분한다.**

**💡요구사항: x버튼을 클릭하면 검색폼이 초기화 되고, 검색 결과가 사라진다.**

검색 결과를 담당할 SearchResult 컴포넌트를 만들어 보자. 지금까지 검색결과는 searchResult란 배열의 상태 변수로 화면을 그렸다. MVC에서는 스토어에 이값을 저장하고 뷰가 그렸다. React에서는 App의 상태로 값을 저장하고 redner() 함수에서 리스트 렌더링으로 그렸다.

SearchForm 컴포넌트는 어떻게 만들어야할까? App에 있던 상태와 엘리먼트 변수를 가져오면 될까? 질문의 목적은 SearchForm을 개선한 이유와 같다. 만약 SearchForm이 검색 결과를 상태로 가지고 있다면 외부에서는 이 값에 접근할 방법이 없다. App 컴포넌트가 검색어 키워드를 들고 있기 때문에 검색하고 그 결과도 가지고 있을 수 있다. 따라서 검색 결과를 가진 App 컴포넌트가 SearchResult 컴포넌트에게 이를 전달해 주는 구조가 맞겠다.

검색결과를 props로 받아 리액트 앨리먼트를 반환하는 SearchResult 컴포넌트를 만들자.

```js
const SearchResult = ({ data = [] }) => {
  if (data.length <= 0) {
    return <div className="empty-box">검색 결과가 없습니다</div>
  }

  return (
    <ul className="result">
      {data.map(item => (
        <li key={item.id}>
          <img src={item.imageUrl} />
          <p>{item.name}</p>
        </li>
      ))}
    </ul>
  )
}
```

상태가 없는 함수 컴포넌트로 만들었다. 검색결과를 props의 data 변수로 받는다. 기본값 빈 배열을 할당해 아무것도 입력하지 않을 때를 대비한 방어 코드를 만들었다. 데이터가 없을 경우 검색 결과가 없는 메세지를 보일 것이고 그렇지 않을 경우 리스트를 출력한다.

이를 App 컴포넌트에서 사용해보자.

```js
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      searchKeyword: "",
      searchResult: [], // 1
      submitted: false, // 2
    }
  }

  search(searchKeyword) {
    const searchResult = store.search(searchKeyword);
    // 3
    this.setState({
      searchResult,
      submitted: true,
    });
  }

  render() {
    return (
      <>
        <Header title="검색" />
        <div className="container">
          <SearchForm onSubmit={searchKeyword => this.search(searchKeyword) />
          <div className="content">
         {submitted && <SearchResult data={searchResult} />} // 4
    )
  }
```

검색결과를 저장할 searchResult 상태를 추가하고 빈 배열로 초기화 했다(1). 첫 화면 렌딩에는 검색 결과를 숨기고 폼이 제출된 다음 보이기 위한 submitted 플래그도 두었다(2). searchResult 배열만으로는 검색 여부를 알수 없기 때문이다.

SearchForm 컴포넌트에서 submit 이벤트를 수신하면 search() 메소드가 호출되는데 이때 스토어에서 검색 결과를 가져와 state를 갱신한다(3). 그럼 render()에서 의존하는 SearchResult 컴포넌트가 렌더링될 것이다(4).

~~💡요구사항: 검색 결과가 검색폼 아래 위치한다. 검색 결과가 없을 경우와 있을 경우를 구분한다.~~

SearchForm에서 x 버튼을 클릭하거나 검색어를 모두 지우면 reset 이벤트가 발생할 것인데 이때 검색결과가 사라져야한다.

```js
class App extends React.Component {
  // 1
  handleReset() {
    this.setState({
      searchKeyword: "",
      searchResult: [],
      submitted: false,
    });
  }

  render() {
    return (
      <>
        <Header title="검색" />
        <div className="container">
          <SearchForm onReset={()=>this.handleReset()}

}
```

SearchForm의 reset 이벤트를 처리하는 handleReset() 메소드를 수정하면 된다(1). 검색 결과의 출력 여부를 submitted 상태가 관리하고 있기 때문에 이를 false로 설정한다. 검색어도 빈 문자열로 초기화하면 이를 사용하는 SearchForm의 input 값이 사라질 것이다. 검색 결과를 담은 searchResult도 빈 배열로 초기화 했다.

~~💡요구사항: x버튼을 클릭하면 검색폼이 초기화 되고, 검색 결과가 사라진다.~~

## Tabs 컴포넌트

**💡요구사항: 추천 검색어, 최근 검색어 탭이 검색폼 아래 위치한다**

**💡요구사항: 기본으로 추천 검색어 탭을 선택한다**

**💡요구사항: 각 탭을 클릭하면 탭 아래 내용이 변경된다**

탭을 담당하는 Tabs 컴포넌트도 만들자. 탭도 선택된 탭을 의미하는 selectedTab 상태를 사용했다. 이 상태도 Tabs 컴포넌트로 숨기는 것 보다 App 컴포넌트에 위치하는 것이 낫다. App 컴포넌트는 선택한 탭에 따라 추천검색어나 최근 검색어를 보여주게될 것이기 대문이다.

```js
const TabType = {
  KEYWORD: "KEYWORD",
  HISTORY: "HISTORY",
}

const TabLabel = {
  [TabType.KEYWORD]: "추천 검색어",
  [TabType.HISTORY]: "최근 검색어",
}

// 1
const Tabs = ({ selectedTab, onChange }) => (
  <ul className="tabs">
    {Object.values(TabType).map(tabType => (
      <li
        key={tabType}
        className={selectedTab === tabType ? "active" : ""} // 2
        onClick={() => onChange(tabType)} // 3
      >
        {TabLabel[tabType]}
      </li>
    ))}
  </ul>
)
```

상태가 불필요하기 때문에 함수 컴포넌트로 만들었다. 선택된탭 selectedTab과 탭을 변경할 때 알려줄 onChange 콜백함수을 props로 받는다(1). 선택된 탭일 경우 active 스타일 클래스를 추가해서 선택된 탭인 것을 표시한다(2). 탭을 클릭하면 탭 정보를 부모 컴포넌트에게 알린다(3).

이 컴포넌트를 App에서 사용해 보자.

```js
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedTab: TabType.KEYWORD,
    }

  render() {
    return (
      <Header />
      <SearchForm />
      {this.state.submitted ?
        <SearchResult /> :
        // 1
        <><Tab
          selectedTab={this.state.selectedTab} // 2
          onChage={slectedTab => this.setState({ selectedTab })} // 3
        />
        {selectedTab === TabType.KEYWORD && <>추천 검색어</>}
        {selectedTab === TabType.HISTORY && <>최근 검색어</>}
    )
  }
}
```

selectedTab을 두어 선택된 탭 상태를 관리한다(1). 초기값은 추천검색어로 설정했다. render() 함수에서 검색 폼 아래에 탭을 위치 시켰다(2).

~~💡요구사항: 추천 검색어, 최근 검색어 탭이 검색폼 아래 위치한다~~

선택된 탭을 selectedTab 속성으로 전달했다. 초기에는 기본값인 추천 검색어 탭이 선택되어 나올 것이다(3).

~~💡요구사항: 기본으로 추천 검색어 탭을 선택한다~~

각 탭이 클릭하며 change 이벤트가 발생하는데 선택한 탭으로 상태를 갱신한다(3). 이 값에 따라 아래 내용이 변경될 것이다.

~~💡요구사항: 각 탭을 클릭하면 탭 아래 내용이 변경된다~~

## ⭐중간정리

이전편에서 App이란 단일 컴포넌트로 만들었던 어플리케이션을 역할에 따라 더 작은 컴포넌트로 분리했다.

먼저 검색폼을 담당하는 부분을 SearchForm 컴포넌트로 분리했다. 사용자부터 텍스트 입력을 받는 부분을 처리하고 폼 제출과 리셋을 외부로 알리는 역할을 한다. 처음에는 사용자 입력을 직접 상태로 관리했는데 이는 다른 컴포넌트에서도 의존하기 때문에 가까운 부모 컴포넌트인 App으로 옮겼다. 이를 state 끌어 올리기라고 한다.

검색폼을 담당하는 부분을 SearchResult 컴포넌트로 분리했다. 마찬가지로 상태는 App에 유지하고 리액트 앨레먼트를 만드는 render() 함수의 앨리먼트 변수를 이쪽으로 옮겼다. Tabs 컴포넌트도 같은 방법으로 분리했다.

이전 편에서 render() 함수안에 있던 앨리먼트 변수를 각 각 컴포넌트로 분리한 결과가 되었다. 여전히 state는 이동하지 않고 App 컴포넌트의 소유로 남아있다. 다음 장에서는 자신만읜 고유한 state를 관리하는 방법으로 컴포넌트를 구현해 보겠다.

계속해서 요구사항 구현을 이어가자.

# 컴포넌트로 구현하기 2

## KeywordList, HistoryList 컴포넌트

추천 검색어

- **💡요구사항: 번호와 추천 검색어 이름이 목록 형태로 탭 아래 위치한다.**
- **💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어의 검색 결과 화면으로 이동한다.**

최근 검색어

- **💡요구사항: 최근 검색어 이름, 검색일자, 삭제 버튼이 목록 현태로 탭 아래 위치한다.**
- **💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어로 검색 결과 화면으로 이동한다.**
- **💡요구사항: 목록에서 x 버튼을 클릭하면 선택된 검색어가 목록에서 삭제된다**
- **💡요구사항: 검색시마다 최근 검색어 목록에 추가된다.**

추천 검색어와 최신 검색어 요구사항이다. 둘은 비슷한 데이터와 모양을 가진다. 둘다 검색어 목록이라는 배열 데이터를 가지고 있고 목록을 클릭에 반응한다. 리스트의 각 항목만 각자 다르게 관리한다. 추천 검색어는 순서와 검색어를 표시하는 반면 최근 검색어는 검색어, 날짜, 버튼을 표시한다. 최근 검색어는 버튼을 클릭하면 목록에서 삭제하는 기능이 있다.

공통의 요구사하은 코드를 재활용하는 방식으로 풀어 보겠다. 준비편에서 KeywordView를 상속해 HistoryView를 만들어 코드를 재활용했던 것을 기억할 것이다. 컴포넌트도 이런식으로 코드를 재활용할 수 있는 방법이 있다.이래야만 중복을 줄일 수 있기 때문이다.

세 가지 방법을 이용해 보겠다.

- 상속
- 조합: 컴포넌트 담기
- 조합: 특수화

먼저 상속구조를 만들어 보자.

## 상속

추천 검색어와 최근 검색어의 공통 로직은 리스트다. 배열 상태를 가지고 리스트 렌더링 하는 로직이다. List 컴포넌트를 만들자.

```js
// 1
class List extends React.Component {
  constructor() {
    super()

    // 2
    this.state = {
      data: [],
    }
  }

  // 5
  renderItem(item, index) {
    throw "renderItem()을 구현하세요"
  }

  render() {
    // 3
    return (
      <ul className="list">
        {this.state.data.map((item, index) => (
          // 4
          <li key={item.id} onClick={() => this.props.onClick(item.keyword)}>
            {this.renderItem(item, index)}
          </li>
        ))}
      </ul>
    )
  }
}
```

배열 상태를 사용하기 때문에 클래스 컴포넌트를 사용했다(1, 2). render() 메소드에서는 이 상태 값으로 리스트 렌더링을 한다. 리스트를 클릭하면 외부의 콜백함수를 호출해서 선택한 키워드 문자열을 전달해준다(3, 4). 리스트 렌더링은 renderItem()이란 추상 메서드를 호출해서 각 아이템을 그리도록 했다. List 클래스를 구현한 자식 클래스에서는 renderItem()을 오버라이딩해서 각자에 맞는 형태로 리스트를 그리도록 변경을 열어둔 것이다.

이걸 이용해서 먼저 키워드 목록을 위한 컴포넌트를 만들어 보겠다.

```js
// 1
class KeywordList extends List {
  // 3
  componentDidMount() {
    const data = store.getKeywordList()
    this.setState({ data })
  }

  // 2
  renderItem(item, index) {
    return (
      <>
        <span className="number">{index + 1}</span>
        <span>{item.keyword}</span>
      </>
    )
  }
}
```

List 클래스를 상속했다(1). renderItem()을 오버라이딩해서 키워드 목록을 그린다. 순서와 키워드를 출력하도록 했다(2). 이 메서드는 부모 클래스의 render() 메소드에서 호출되어 리액트 앨리먼트를 만들게 될 것이다. state.data에 빈배열이 초기값이므로 아무것도 그리지 않을 텐데 데이터를 가져오기 위해 생명 주기 메소드인 componentDidMount()를 사용했다. 컴포넌트가 돔에 마운트 된 직후에 실행되는데 스토어에서 키워드 목록을 가져와 컴포넌트 상태를 갱신했다(3). state 변화를 감지한 리액트는 다시 render() 메소드를 그려 가상돔을 다시 그리게 될 것이다.

~~💡요구사항: 번호와 추천 검색어 이름이 목록 형태로 탭 아래 위치한다.~~

이걸 App 컴포넌트에서 사용할 차례다.

```js
class App extends React.Component {
  search(searchKeyword) {
    const searchResult = store.search(searchKeyword);
    this.setState({
      searchKeyword, // 2
      searchResult,
      submitted: true,
    });
  }

render() {
return (
  // 1
  {selectedTab === TabType.KEYWORD && (
                  <KeywordList onClick={(keyword) => this.search(keyword)} />
                )}
)
}
}
```

KeywrodList에서 클릭 이벤트가 발생하면 전달된 추천 키워드를 이용해 search() 메소드를 호출한다(1). 이전처럼 검색한뒤 검색 결과로 상태를 갱신한다. 이때 App 컴포넌트가 관리하는 searchKeyword 상태도 갱신해서 SearchForm의 input에 선택한 키워드가 설정되도록 한다.

~~💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어의 검색 결과 화면으로 이동한다.~~

최신 검색어도 List 클래스를 상속해서 만들어 보자.

```js
// 1
class HistoryList extends List {
  // 2
  componentDidMount() {
    this.fetch()
  }

  // 3
  fetch() {
    const data = store.getHistoryList()
    this.setState({ data })
  }

  // 4
  handleClickRemove(event, keyword) {
    event.stopPropagation()
    store.removeHistory(keyword)
    this.fetch()
  }

  // 2
  renderItem(item) {
    return (
      <>
        <span>{item.keyword}</span>
        <span className="date">{formatRelativeDate(item.date)}</span>
        <button
          className="btn-remove"
          onClick={event => this.handleClickRemove(event, item.keyword)}
        />
      </>
    )
  }
}
```

List 클래스를 상속하고(1), renderItem() 메소드를 오버라딩 한다(2). 컴포넌트가 돔에 마운트 된 후 데이터를 불러오는데 fetch() 함수를 호출한다(3). 스토어에서 데이터를 불러와 컴포넌트 상태로 갱신하면 리액트는 상태 변화를 감지하고 리액트 앨리먼트를 다시 만들 것이다. 그리고 x 버튼 클릭을 처리하는 handleClickRemove() 메소드를 추가했다(4). 스토어에서 검색 이력을 삭제하고 다시 불러오는 역할이다.

이것도 App에서 사용한다.

```js
class App extends React.Component {
  render() {
    return (
{selectedTab === TabType.HISTORY && (
                  <HistoryList onClick={(keyword) => this.search(keyword)} />
                )}
```

~~💡요구사항: 최근 검색어 이름, 검색일자, 삭제 버튼이 목록 현태로 탭 아래 위치한다. (List에서 일부 구현)~~

~~💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어로 검색 결과 화면으로 이동한다.(List에서 구현)~~

~~💡요구사항: 목록에서 x 버튼을 클릭하면 선택된 검색어가 목록에서 삭제~~

~~💡요구사항: 검색시마다 최근 검색어 목록에 추가된다~~

## 조합: 컴포넌트 담기

리액트는 클래스의 상속구조로 코드를 재활용하는 걸 권장하지 않는다.

> Facebook에서는 수천 개의 React 컴포넌트를 사용하지만, 컴포넌트를 상속 계층 구조로 작성을 권장할만한 사례를 아직 찾지 못했습니다. - 출처: 리액트 공식 문서

대신 props와 합성을 사용하길 권장한다.

클래스 상속으로 구현한 List, KeywordList, HistoryList를 조합 방식으로 다시 만들어 보면서 이 방식의 장점을 알아보자.

List 컴포넌트를 만들자.

```js
// 1
const List = ({ data = [], onClick, renderItem }) => {
  return (
    <ul className="list">
      {data.map((item, index) => (
        <li key={item.id} onClick={() => onClick(item.keyword)}>
          {renderItem(item, index)} // 2
        </li>
      ))}
    </ul>
  )
}

export default List
```

클래스를 사용하지 않고 함수 컴포넌트로 만들었다(1). 외부에서 렌더링할 데이터를 주입 받겠다는 의도다. 키워드 목록과 검색 목록을 data props로 받아 리액트 엘리먼트를 만드는 단순한 함수로 줄었다. 리스트 형식만 출력하는 것 까지만 담당하고 각 항목을 그리는 함수도 외부에서 주입받았다. renderItem() 함수에 아이템과 인덱스를 전달해서 List 컴포넌트를 사용하는 측에서 알아서 그리도록 권한을 위임한 셈이다(2). 참고로 props에 함수를 전달할 수 있다고 했다. 이러한 함수 중 리액트 앨리먼트를 반환하는 함수를 render props라고 부른다. 전달된 함수로 UI 렌더링을 하기 때문이다.

이제 이걸 사용한 KeywrodList를 보자

```js
// 1
class KeywordList extends React.Component {
  constructor() {
    super()
    // 2
    this.state = {
      keywordList: [],
    }
  }

  // 3
  componentDidMount() {
    const keywordList = store.getKeywordList()
    this.setState({ keywordList })
  }

  render() {
    const { onClick } = this.props
    const { keywordList } = this.state

    return (
      // 4
      <List
        data={keywordList}
        onClick={onClick}
        // 5
        renderItem={(item, index) => (
          <>
            <span className="number">{index + 1}</span>
            <span>{item.keyword}</span>
          </>
        )}
      />
    )
  }
}
```

List 컴포넌트를 상속하지 않았다. 함수 컴포넌트라서 어차피 상속할 수 도 없다. 키워드 목록 데이터를 내부 상태로 갖기 위해 클래스 컴포넌트로 선언했다(1). keywordList란 이름으로 빈 배열로 초기화했다(2). 이 값은 render() 메소드에서 사용하는데 List 컴포넌에 전달했다(4). 배열을 보고 List가 리스트를 그리도록 renderItem 함수도 함께 전달해 세부사항을 그리도록 했다(5). 돔이 마운트 된 후 스토어에서 키워드 목록을 가져오고 상태로 갱신되면 목록을 그릴 것이다(3).

추천 검색어

- ~~💡요구사항: 번호와 추천 검색어 이름이 목록 형태로 탭 아래 위치한다.~~
- ~~💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어의 검색 결과 화면으로 이동한다.~~

최근검색어도 List 컴포넌트를 사용해서 만들어 보자.

```js
// 1
class HistoryList extends React.Component {
  constructor() {
    super()
    this.state = { historyList: [] } // 2
  }

  // 3
  componentDidMount() {
    this.fetch()
  }

  // 4
  fetch() {
    const historyList = store.getHistoryList()
    this.setState({ historyList })
  }

  handleClickRemove(event, keyword) {
    event.stopPropagation()
    store.removeHistory(keyword)
    this.fetch()
  }

  render() {
    const { onClick } = this.props
    const { historyList } = this.state

    return (
      // 6
      <List
        data={historyList}
        onClick={onClick}
        renderItem={item => (
          <>
            <span>{item.keyword}</span>
            <span className="date">{formatRelativeDate(item.date)}</span>
            <button
              className="btn-remove"
              onClick={event => this.handleClickRemove(event, item.keyword)}
            />
          </>
        )}
      />
    )
  }
}
```

최근 검색어 데이터를 상태로 관리하기 위햇 클래스 컴포넌트로 만들고(1) historyList 상태를 빈배열로 초기화 했다(2). 이 값을 render() 메소드에서 List 컴포넌트와 함께 사용했다(6). 히스트리 리스트의 각 항목을 그릴수 있도록 렌더 prop 도 전달했다. KeywrodList의 것과 다른 부분이다. 돔이 마운트되면 데이터를 불러와 historyList 상태를 갱신하고(4) 리스트를 다시 그릴 것이다.

최근 검색어

- ~~💡요구사항: 최근 검색어 이름, 검색일자, 삭제 버튼이 목록 현태로 탭 아래 위치한다.~~
- ~~💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어로 검색 결과 화면으로 이동한다.~~
- ~~💡요구사항: 목록에서 x 버튼을 클릭하면 선택된 검색어가 목록에서 삭제~~
- ~~💡요구사항: 검색시마다 최근 검색어 목록에 추가된다~~

KeywordList가 리액트 앨리먼트를 만들 때 List 컴포넌트를 사용한 것 처럼 다른 컴포넌틀 조합하는 방식은 중복 코드를 줄일 수 있다. 다른 컴포넌트를 담는 방법 외에도 특수화라는 방식의 조합법도 하나 더 소개하겠다.

## 조합: 특수화

List 컴포넌트를 다시 만들어 보자.

```js
// 1
const List = ({
  data = [],
  hasIndex = false,
  hasDate = false,
  onClick,
  onRemove,
}) => {
  const handleClickRemove = (event, keyword) => {
    event.stopPropagation()
    onRemove(keyword)
  }

  // 2
  return (
    <ul className="list">
      {data.map(({ id, keyword, date }, index) => (
        <li key={id} onClick={() => onClick(keyword)}>
          {hasIndex && <span className="number">{index + 1}</span>} // 3
          <span>{keyword}</span> // 4
          {hasDate && <span className="date">{formatRelativeDate(date)}</span>}{" "}
          // 5
          {!!onRemove && ( // 6
            <button
              className="btn-remove"
              onClick={event => handleClickRemove(event, keyword)}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
```

List가 좀 더 많은 역할을 하는 것 같다. 외부에서 받는 props 갯수가 늘어났기 때문이다(1). props 설정 값에 따라 조금 다른 UI를 만드는 기능을 한다. hasIndex를 설정하면 좌측에 순서를 표시하도록했다(3). keyword는 반드시 보인다. hasDate와 remove 값에 따라 날짜와 삭제 버튼을 보이도록 했다(5, 6). 최근 검색어를 위한 옵션이다.

이걸 사용해보자. 먼저 KeywrodList 다.

```js
class KeywordList extends React.Component {
  render() {
    const { onClick } = this.props
    const { keywordList } = this.state

    return (
      <List hasIndex data={keywordList} onClick={onClick} /> // 1
    )
  }
}
```

순서와 키워들 표시하기 때문에 hasIndex 속성을 전달했다. KeywordList는 순서가 있는 List의 특수한 경우라고 생각하기 때문이다.

한편 HistoryList는 어떨까?

```js
class HistoryList extends React.Component {
  render() {
    const { onClick } = this.props
    const { historyList } = this.state

    return (
      <List
        hasDate // 1
        data={historyList}
        onClick={onClick}
        onRemove={keyword => this.handleRemove(keyword)} // 2
      />
    )
  }
}
```

HistoryList는 날짜와 삭제버튼이 있는 List의 특수한 겨우라고 생각한다.

## ⭐중간 정리

코드를 줄이는 방법은 공통 로직을 하나로 만들고 이를 재사용하는 것이다. 공통 로직을 부모 클래스에게 올려버리고 이를 상속해서 코드를 재활용하거나 단일 역할의 함수를 조합해서 또다른 일을 하는 함수를 만들어 함수를 재활용 할 수 있다. 컴포넌트도 재활용할 수 있는 방법이 있는데 이 장에서는 3가지 방법을 알아 보았다.

상속. 공통 로직을 부모 클래스가 갖도록 했다. 리스트 상태를 가지고 이를 리스트 렌더링한다. 전통적인 OOP 스타일의 상속 구조를 활용할 수 있다는 점에서는 익숙한 방식이다. 하지만 상속 단계가 많아지면 코드를 파악하는데 다소 어려울 수도 있다는 단점이 있다. 특히 state에 반응하는 UI 코드가 잘 보이지 않을 수도 있기 때문이다. 오히려 리액트 커뮤니티에서는 지양하는 분위기인 것 같다.

> React는 강력한 합성 모델을 가지고 있으며, 상속 대신 합성을 사용하여 컴포넌트 간에 코드를 재사용하는 것이 좋습니다. - 출처: 리액트 문서 > 합성 vs 상속

조합: 컴포넌트 담기. 반면 함수를 조합하듯 컴포넌트를 조합하는 방식으로 코드 재활용을 권장한다. 리액트의 props 에는 어떠한 자바스크립트 값도 전달할 수 있는데 props를 활용해서 컴포넌트를 조합한다. 여기서는 렌더링 용도의 render props를 전달했다. 이 외에도 리액트 컴포넌트를 전달해서 조합할 수도 있다.

또 다른 조합 방법은 특수화다. 이것도 props를 사용하는 방식이라는 점에서는 같지만 접근의 차이라고 생각한다. KeywordList는 List 컴포넌트의 특수한 경우이다. List 컴포넌트에 좌측 순서가 있는 특수한 경우인 셈이다. HistoryList도 그러한데 우측에 날짜와 버튼이 위치한 List의 특수한 경우인 것이다.

# 🌟최종정리

리액트 라이브러리의 특성인 리액티브와 가상돔 그리고 마지막인 강력한 추상화 도구인 컴포넌트에 대해 알아 보았다. UI와 상태로 관리되는 화면을 컴포넌트라는 개념으로 추상화한 것이다. 클래스 컴포넌트로 구현하면 상태가 불필요할 때는 함수 컴포넌트로 구현한다. 컴포넌트가 리액티브하게 동작할 수 있는것은 state 때문인데 외부에서 전달한 props도 마찬가지다.

여러 컴포넌트를 사용하게되면서 서로 코드를 격리시킬수 있는 장점이 있지만 어떤 경우에는 하나의 상태를 다른 컴포넌트에서도 사용하는 경우가 빈번히 발생한다. 이럴 때는 가장 가까운 부모 컴포넌트로 state 끌어 올려 문제를 해결한다. SearchForm 컴포넌트에서 입력 데이터를 부모로 이동해서 다른 컴포넌트 에도 데이터 변화를 사용했다.

함수를 재활용하듯 컴포넌트도 재활용 할 수 있다. 전통적인 OOP기법 처럼 클래스 상속으로 코드를 재활용할 수 있는 방법과 함수형 처럼 컴포넌트를 조합해서 사용하는 방식이 있다. 리액트는 후자를 권장한다.

--

지금가지 총 4 편의 연재물을 통해 리액트를 이용한 웹개발에 대해 알아 보았다. 혹자는 준비편에서 다룬 순수 자바스크립트에 대한 내용에 만족하지 못하거나 이해하기 어려워할지도 모르겠다. 리액트를 설명하는데 비교 대상이 있으면 좋겠다는 생각으로 내용이 다소 길긴 하지만 초반에 다루었다. 리액트의 장점을 부각하기 위한 의도라고 여겨 주었으면 좋겠다.

리액트의 세 가지 특징을 중심으로 알아보았다. 데이터 변화에 따라 UI가 반응하는 리액티브한 성질은 상태 관리만으로도 UI 관리를 할 수 있다는 점이 있다. 상태와 UI를 모두 관리해야하는 MVC 모델과 비교하면 더욱 장점이 드러난다. 돔 API를 최소화해서 렌더링 성능을 높이기 위한 가상돔도 리액트의 특징이다. 우리는 가상 돔만을 다루기 때문에 성능에 신경 쓰지 않고 어플리케이션 로직에 집중할 수 있는 여유가 생긴다. 마지막으로 상태와 UI를 추상화한 컴포넌트를 지원한다. 이를 통해 화면 개발에 대한 사고 방식을 바꿀수 있고 재활용할 수 있는 코드도 더 많이 만들 수 있게 되었다.

리액트 공식 문서 위주로 내용을 다루었다. 여전히 고급 주제들은 더 학습해야할 대상이다. 컨텍스트, 훅 등. 뿐만 아니라 리액트와 함께 사용하는 라우터, 전역 상태 관리 솔루션 더 나아가 리액트기반의 웹 프레임워크도 더 학습하는 것이 유용할 것이라 생각한다. 이것으로 연재를 마친다. 끝.
