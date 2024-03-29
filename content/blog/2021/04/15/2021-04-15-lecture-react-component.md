---
slug: "/series/2021/04/15/lecture-react-component.html"
date: 2021-04-15
title: "[리액트 1부] 만들면서 학습하는 리액트: 사용편2(컴포넌트편)"
layout: post
category: 연재물
series: "[리액트 1부] 만들면서 학습하는 리액트"
videoId: video-2021-05-04-inflearn-react
tags: [react]
---

# 리액트 컴포넌트 소개

## 컴포넌트를 사용하는 이유

사용 편에서 우리는 이미 컴포넌트를 사용하고 있었다. 어플리케이션 자체를 의미하는 App 컴포넌트가 그것이다. 어플리케이션의 전체 상태와 유저 인터페이스를 관리한다.

이 모습은 마치 큰 서랍장 안에 모든 물건을 넣은 것과 비슷하다. 나중에 뭔가를 서랍에서 찾으려면 복잡한 서랍 안을 한참 뒤져야 한다. 반면 서랍을 칸막이로 용도에 맞게 분류해서 수납해 놓으면 빠르고 쉽게 찾을 수 있을 것이다.

App 컴포넌트는 코드를 읽고 수정하는데 어려울 수 있다. 어플리케이션의 모든 상태와 UI을 하나의 컴포넌트가 전담하기 때문이다. 서랍을 용도에 맞게 칸막이로 나누듯 컴포넌트도 역할에 따라 더 작은 컴포넌트로 나눌 수 있다. 작은 컴포넌트는 비교적 읽기도 쉽고 수정도 안전하다.

프로그래밍 경험이 있다면 함수나 클래스로 추상화하는 것과 같다. 모든 코드를 절차적으로 작성하면 코드 양이 많아지고 전체 코드를 모두 머리속에 담고 있어야만 프로그램을 읽을 수 있다.
하지만 추상화 기법을 사용하면 하나의 역할을 수행하는 코드 덩어리에 이름을 부여하기 때문에 프로그램이 훨씬 잘 읽힌다.

특정 역할을 수행하는 코드를 함수로 분리하고 "Login"이라는 이름표를 붙여주면 이 때부터 이름만 보고도 코드의 내용을 알 수있다. 여러 속성과 동작을 표현하는 코드를 클래스로 분리하고 "User"라는 이름표를 붙여주면 이 때부터 이름표만 보고도 사용자를 기술한 코드인 것을 알 수 있다.

어플리케이션 상태와 유저 인터페이스 코드를 컴포넌트로 분리하고 "LoginComponent"라는 이름표를 붙이면 내부 코드를 모두 들여다보지 않고도 로그인 UI를 다루는 코드라는 것을 단번에 알아챌 수 있을 것이다. 이처럼 컴포넌트를 사용하면 개발자는 추상화를 통해 더 크고 복잡한 코드를 만들 수 있는 힘이 생기는 것이다.

## 작은 컴포넌트로 나누기

이 거대한 App 컴포넌트를 역할에 따라 잘게 쪼게어 보자. 다른 추상화 기법처럼 컴포넌트를 나누는 기준 중의 하나는 "단일 책임 원칙"이다. 컴포넌트는 하나의 역할만 가져야 한다. 먼저 App 컴포넌트의 역할을 나열해 보자.

- 헤더를 출력한다
- 검색폼에 검색어 입력을 받는다
- 엔터를 누르면 검색하고 결과를 보여준다
- 추천 검색어, 최근 검색어 탭이 있다
- 각 탭을 클릭하면 추천 검색어 목록, 최근 검색어 목록이 각 각 표시 된다

이 역할들을 각각의 컴포넌트로 나눠서 위임하도록 하자.

![컴포넌트 설계](split-components.png)

- **Header**는 상단에 제목을 보여준다 - _1 초록색_
- **SearchForm**은 검색어를 입력받는 받는다 - _2 빨간색_
- **SearchResult**는 불러온 검색 결과 목록을 보여준다 - _5 보라색_
- **Tab** 은 추천 검색어, 최근 검색어 탭을 보여주고 선택할 수 있다 - _3 주황색_
- **KeywordList**는 키워드 목록을 보여주고 선택할 수 있다 - _4 연두색_
- **HistoryList**로 대체될 수 있는데 최근 검색어 목록을 보이고 선택할 수 있다 - _6 파랙색_
- 모든 컴포넌트를 둘러싸는 **App**은 전체 컴포넌트를 관리한다- _7 검정색_

## 프로젝트 구조 변경하기

지금까지와는 달리 웹팩과 바벨로 구성된 개발 환경을 사용해야겠다. 컴포넌트를 하나의 파일에 만드는 것이 코드를 관리하는데 편리하고 리액트 개발의 관례이기도 하다. 여러 파일을 모듈로 서로 연결하려면 지금까지 사용한 바벨 스탠드얼론 버전으로는 한계다. 여러 파일을 다루기 위해 웹팩과 바벨을 이용해서 실습 환경을 바꾸었다. 아래 링크를 참고하라.

- [프론트엔드 개발환경의 이해 - 웹팩(기본)](/series/2019/12/10/frontend-dev-env-webpack-basic.html)
- [프론트엔드 개발환경의 이해 - 웹팩(심화)](/series/2020/01/02/frontend-dev-env-webpack-intermediate.html)

엔트리 포인트인 main.js는 루트 컴포넌트인 App을 ReactDOM에게 전달하는 로직만 남겨 둔다.

```js
import React from "react" // 1
import ReactDOM from "react-dom" // 2
import App from "./App.js" // 3

ReactDOM.render(<App />, document.querySelector("#app"))
```

CDN을 사용하지 않고 NPM 저장소에서 라이브러리를 다운로드 했기 때문에 ES6 모듈시스템으로 이를 가져온다. JSX를 사용하기 위해 react 패키지를 가져온다(1). ReactDOM의 render() 함수를 사용할 목적으로 react-dom 패키지도 가져온다(2). 앞으로 만들 부모 컴포넌트인 App 컴포넌트도 가져온다(3).

App.js 파일을 추가하자.

```js
class App extends React.Component {
  render() {
    return <>TODO: App 컴포넌트</>
  }
}

export default App
```

리액트 컴포넌트 클래스를 상속한 App은 리액트 앨리먼트를 반환하는 render() 메소드만 정의했다.

이전 구현에서 이 App 컴포넌트 하나로 전체 어플리케이션이 동작했다. 하지만 이제부터는 역할에 따라 작은 컴포넌트 여러개를 정의하고 이들을 관리하는 루트 컴포넌트의 역할을 하게될 것이다.

## Header: 함수 컴포넌트

그 동안 Component 클래스를 상속해 리액트 컴포넌트를 만들었는데 이것말고도 컴포넌트를 만들 수 있는 방법이 하나 더 있다. 바로 **함수 컴포넌트**다.

```js
const Hello = () => <>Hello world</>

<Hello />
```

일반 함수다. 단 리액트 앨리먼트를 반환하는 함수여야 리액트 컴포넌트가 될 자격을 가진다. 클래스 상속도 생성자도 render() 메소드도 없어서 클래스 컴포넌트에 비해 상대적으로 코드가 짧다. 가장 큰 차이는 state가 없다는 점이다. 내부 상태가 필요없는 컴포넌트라면 함수 컴포넌트를 사용할 수 있다.

Header가 바로 함수 컴포넌트로 만들면 적합한 경우다. 화면 상단에 있는 헤더 영역은 타이틀만 출력하는 정적인 엘리먼트라서 내부에서 관리할 상태가 없기 때문이다. Header.js 파일을 추가하자.

```js
const Header = () => (
  <header>
    <h2 className="container">검색</h2>
  </header>
)
```

인자도 없이 바로 "검색" 타이틀이 포함된 리액트 앨리먼트를 반환하는 함수다. App 컴포넌트에서는 단 한 줄로 헤더 코드가 대체될 수 있다.

```js
render() {
  return <Header />
}
```

컴포넌트로 분리하기 전에는 App 컴포넌트 안에서 헤더 엘리먼트를 구체적으로 기술했다. 반면 Header 컴포넌트를 사용한 버전은 내부 구현이 감추어져 있고 단순히 Header 컴포넌트만 선언했다. 우리는 아무리 복잡한 내용이라도 Header란 이름만으로 어떤 코드인지 바로 알 수 있게 되었다. 바로 이것이 컴포넌트의 추상화 능력이다.

## 재활용 가능한 컴포넌트로 개선하기

함수 컴포넌트와 클래스 컴포넌트의 차이는 상태의 유무다. 그러나 컴포넌트에 상태가 없다는 것은 그동안 우리가 누누히 말해왔던 리액티브 개념과 상반된다. 리액트브란 상태 변화가 UI에 자동으로 반영되는 것이기 때문이다.

리액트 컴포넌트에서 UI 상태로 사용할 수 있는 것은 state 말고도 **props**가 있다. State가 컴포넌트 내부에서 관리는 상태라면 props는 컴포넌트 외부에서 들어와 내부 UI에 영향을 줄 수 있는 녀석이다. 이 값에 의존한 리액트 앨리먼트를 만들면 props 변화에 따라 UI가 리액티브하게 반응한다.

```js
const Hello = ({ name }) => <>Hello {name}</>  // 1

<Hello name="world" /> // 2
```

Props는 객체 모양으로 컴포넌트로 전달된다. 이 값으로 리액트 앨리먼트를 만든다(1). 컴포넌트의 props는 속성 이름으로 전달한다(2). Hello 컴포넌트는 전달된 name 값에 따라 UI가 변경될 것이다.

우리가 만든 Header 컴포넌트는 다른 화면의 헤더로 사용할 가능성도 있다. 하지만 이미 타이틀 이름이 컴포넌트 안에 하드코딩 되어 있기 때문에 재활용이 불가능하다. 어떻게 하면 Header를 다른 곳에서도 다른 곳에서도 사용할 수 있을까?

프로그래밍에서 함수는 재활용할 수 있는 대표적인 개념이다. 함수 본연의 로직은 본문의 코드로 담고 있고 유동적인 값을 함수의 인자를 통해 전달받는 방식이다. 컴포넌트도 그럴 수 있는데 바로 props 인자를 통해 유동적인 값을 받을 수 있다.

Header를 조금만 더 수정해 보자.

```js
// 1
const Header = ({ title }) => (
  <header>
    <h2 className="container">{title}</h2> {/* 2 */}
  </header>
)

class App extends React.Component {
  render() {
    return <Header title={"검색"} /> // 3
  }
}
```

아무것도 없었던 인자에 props를 받도록 허용했다(1). 그리고 "검색"이라는 문자열 값으로 하드코딩되어 있던 부분에 props.title 값을 사용했다(2).

이 컴포넌트를 사용할 때는 title 속성에 "검색" 문자열을 전달했다(3). Header라는 컴포넌트에 title까지 정하고나니 '아 검색 헤더구나'라는 생각이 들기도 한다. 재활용뿐만 아니라 가독성 측면에서도 더 나아졌다.

## ⭐중간정리

리액트의 세번째 개념인 컴포넌트를 다루었다. 관련된 코드 덩어리를 모아 하나의 독립된 개념으로 추상화하는 기법은 프로그래밍에서 개발자의 사고력을 비약적으로 높여준다. 상태와 UI 코드로 이루어진 화면 개발에서도 컴포넌트라는 개념을 사용해 추상화 할 수 있다.

이미 우리는 App이란 컴포넌트를 사용하고 있었는데 어플리케이션의 모든 상태와 UI를 담고있다. 이것은 역할을 분리해 작은 컴포넌트로 나누는 것이 좋다. 더 쉽게 읽히고 안전하게 수정할 수 있기 때문이다.

컴포넌트는 클래스 컴포넌트와 함수 컴포넌트 이렇게 두 가지 종류가 있다. 스스로 상태 관리가 필요한 경우 클래스 컴포넌트를 사용하고, 그렇지 않으면 함수 컴포넌트로도 충분하다. 이전 편에서 전체 어플리케이션 상태를 관리하는 App을 사용했는데 이것이 바로 클래스 컴포넌트이다. 반면 내부 상태가 불필요한 Header는 함수 컴포넌트를 사용해서 구현했다.

컴포넌트 내부에 위치한 state가 UI와 밀접하게 반응하는데 외부로부터 전달받은 props도 UI 동일한 성질을 갖는다. 함수 컴포넌트에서는 props를 이용해 UI를 만들수 있기 때문에 리액티브 성질을 유지할 수 있다.

Header 컴포넌트의 타이틀을 props로 전달해 재활용할 수 있는 형태로 개선했다.

요구사항에는 없었지만 몸풀기 차원에서 Header 컴포넌트를 만들어 봤다. 다음 장부터 요구사항을 하나씩 구현해 보자.

# 컴포넌트로 구현하기 1

## SearchForm 1

컴포넌트를 이용해 검색폼 요구사항을 하나씩 구현해 보겠다.

- 💡요구사항: 검색 상품명 입력 폼이 위치한다
- 💡요구사항: 검색어를 입력하면 x 버튼이 보이고 없으면 x 버튼을 숨긴다

이전에는 App이라는 전체 어플리케이션을 담당하는 단일 컴포넌트 안에 검색폼을 구현했다. 검색어 입력 값을 저장하는 searchKeyword와 렌더 함수 안에 위치한 searchForm 엘리먼트 변수가 그것이다. 이를 App 컴포넌트에서 분리해 SearchForm으로 분리할 것이다.

SearchForm.js 파일을 만들자.

```js
// 1
class SearchForm extends React.Component {
  constructor() {
    super()
    this.state = { searchForm: "" } // 2
  }

  // 3
  handleChangeInput(event) {
    const searchKeyword = event.target.value
    this.setState({ searchKeyword })
  }

  render() {
    const { searchForm } = this.state
    return (
      <form>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          autofocus
          value={searchForm} {/* 4 */}
          onChange={event => this.handleChangeInput(event)} {/* 5 */}
        />
      </form>
    )
  }
}
```

사용자로부터 검색어를 입력받기 때문에 이를 저장할 상태가 필요하다. 따라서 state가 있는 클래스 컴포넌트를 상속해 만든다(1). Input 엘리먼트를 리액트 컴포넌트에서 제어하려고 이를 저장할 searchForm 상태를 추가했다(2). input에서 입력이 발생하면 처리할 메소드다. 입력 이벤트가 발생할 때마다 입력값을 가져와 searchKeyword 상태에 저장한다(3). searchKeyword와 handleChangeInput() 메소드를 이용해 제어된 input 컴포넌트를 만들었다(4, 5).

이 컴포넌트를 최상단 컴포넌트인 App에서 사용한다.

```js
class App extends React.Component {
  render() {
    return (
      <>
        <Header title={"검색"} />
        <SearchForm /> {/* 1 */}
      </>
    )
  }
}
```

헤더 컴포넌트 바로 아래 사용했다(1).

~~💡 요구사항: 검색 상품명 입력 폼이 위치한다~~

검색어 입력 여부에 따라 보이거나 숨겨지는 x 버튼도 추가한다.

```js
class SearchForm extends React.Component {
  render() {
    const { searchKeyword } = this.state
    return (
      <form>
        <input /* 생략 */ />
        {/* 1 */}
        {searchKeyword.length > 0 && (
          <button type="reset" className="btn-reset" />
        )}
      </form>
    )
  }
}
```

입력한 검색어를 searchKeyword가 저장하기 때문에 이를 이용해 버튼을 조건부 렌더링 했다(1).

~~💡요구사항: 검색어를 입력하면 x 버튼이 보이고 없으면 x 버튼을 숨긴다~~

## SearchForm 2

- 💡요구사항: 엔터를 입력하면 검색 결과가 보인다
- 💡요구사항: x 버튼을 클릭하거나 검색어를 삭제하면 검색 결과를 삭제한다

검색어어와 엔터를 입력하면 검색 결과를 보이게 한다. 기억나는가? MVC에서는 컨트롤러에게 역할을 위임했다. 그 통신 수단으로 뷰가 "@submit" 이벤트를 발행해 외부에 있는 컴포넌트가 이를 수신하도록 구현했다.

SearchForm 컴포넌트도 비슷하다. 검색어 입력만 담당하기 때문에 검색 결과는 제 알바 아니다. 그러면 검색어를 입력하고 엔터를 입력했다는 메세지를 부모 측으로 전달해 외부에서 처리하도록 위임해야 한다.

리액트 컴포넌트가 외부와 통신하는 유일한 통로는 바로 props 객체다. Header 컴포넌트를 사용할 때 title="검색"으로 문자열을 전달하면 컴포넌트에서는 props.title로 받은 걸 기억할 것이다. 리액트 컴포넌트에서 부모-자식 방향으로 데이터를 전달하는 것은 자연스럽다.

반면 SearchForm 컴포넌트는 엔터를 입력하면 폼이 제출된다는 것을 부모 측으로 알려야하는 상황이다. 짐짓 부모-자식 방향으로의 데이터 흐름과 어긋나는 것 같다. 하지만 이를 역전시킬 수 있는 방법이 있다. 바로 **콜백 함수**이다. props에는 어떠한 값이라도 사용할 수 있는데 함수도 전달할 수 있다. Props에 전달한 함수를 자식 컴포넌트에서 호출하면 부모로 메세지를 전달할 수 있다.

```js
class SearchForm extends React.Component {
  handleSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(this.state.searchKeyword) // 1
  }

  render() {
    return (
      // 2
      <form onSubmit={event => this.handleSubmit(event)}>{/* 생략 */}</form>
    )
  }
}
```

폼 submit 이벤트에 핸들러를 추가한다(2). handleSubmit() 메소드는 폼 제출 기본 동작을 막아 화면 리프레시를 차단한 뒤 외부에서 받은 onSubmit() 함수를 호출했다(1). searchKeyword를 콜백 함수로 전달하는 구조이다.

그럼 App에서 콜백 함수를 설정해 보자.

```js
class App extends React.Component {
  // 1
  search(searchKeyword) {
    console.log(searchKeyword)
  }

  render() {
    return (
      <>
        <Header title="검색" />
        {/* 2 */}
        <SearchForm onSubmit={searchKeyword => this.search(searchKeywrod)} />
      </>
    )
  }
}
```

onSubmit 속성에 함수를 연결했다. 함수가 호출되면 SearchForm으로부터 검색어를 인자를 받을 것이다. 이걸로 search() 메소드를 호출한다(2). 여기서는 인자가 제대로 넘어 왔는지 로그만 기록했다(1).

- ~~💡요구사항: 엔터를 입력하면 검색 결과가 보인다(App에게 위임)~~

SearchForm의 리셋 이벤트도 마찬가지로 콜백으로 해결한다.

```js
class SearchForm extends React.Component {
  render() {
    const { onReset } = this.props
    const { searchKeyword } = this.state
    return (
      <form
        onSubmit={searchKeyword => this.search(searchKeywrod)}
        onReset={() => onReset()} // 1
      >
        {/* 생략 */}
      </form>
    )
  }
}
```

x버튼을 클릭하면 reset 이벤트가 발생하는데 이때 form의 onReset의 핸들러 함수가 동작할 것이다. Props로 전달할 onReset() 콜백 함수를 호출했다(1).

- ~~💡요구사항: x 버튼을 클릭하거나 검색어를 삭제하면 검색 결과를 삭제한다~~

## State 끌어 올리기

SearchForm 컴포넌트를 조금 유심히 들여다 보자.

준비편에서는 MVC 모델을 사용했는데 SearchFormView가 비슷한 역할을 했다. 자신만의 역할을 수행한 뒤 "@submit"이나 "@reset" 이벤트로 외부에 알렸다. 컨트롤러는 이 이벤트를 구독하고 모델과 다른 뷰를 관리하는 구조다.

사용편에서 리액트로 다시 만들었는데 App 컴포넌트 하나로 만들었다. 검색어를 상태를 state.searchKeyword가 관리하고 render() 메소드에 선언한 searchForm 앨리먼트 변수가 UI를 관리했다. 인풋 입력 이벤트가 발생하면 searchKeyword가 변하고 이에 따라 어플리케이션이 반응하는 구조다. 하나의 App 컴포넌트로 동작하기 때문에 App이 모든 상태 변화와 모든 UI를 관리할 수 있었던 것이다.

한편 지금은 SearchForm이라는 작은 역할을 담당하는 컴포넌트로 쪼겠다. 가장 큰 변화는 searchKeyword를 컴포넌트 안으로 숨겼다는 점이다. 외부에서는 searchKeyword 값을 조회하거나 변경할 방법이 사라진다. props로 전달한 onSubmit 콜백 함수에 인자로 전달해 간접적으로 조회할 수 있는 방식은 있으나 검색어를 수정할 수 있는 방법은 없다. 앞으로 추천 검색어나 최근 검색어를 클릭하면 검색 폼에 이 검색어가 설정되어야 하는 요구사항도 있는데 SearchForm 외부에서는 컴포넌트 내부에 갖혀있는 searchKeyword를 변경할 수 없는 구조다.

이렇게 동일한 데이터에 여러 컴포넌트가 의존하는 경우가 생기는데 이럴 경우에는 가장 가까운 부모 컴포넌트로 **state를 끌어올리는 것**이 좋다.

> 종종 동일한 데이터에 대한 변경사항을 여러 컴포넌트에 반영해야 할 필요가 있습니다. 이럴 때는 가장 가까운 공통 조상으로 state를 끌어올리는 것이 좋습니다. - 출처: [주요개념 > State 끌어올리기](https://ko.reactjs.org/docs/lifting-state-up.html)

SearchForm 컴포넌트의 state를 부모 App 컴포넌트로 끌어 옮기자.

```js
class App extends React.Component {
  constructor() {
    super()
    this.state = { searchKeyword: "" } // 1
  }

  handleChangeInput(value) {
    this.setState({ searchKeyword: value }) // 2
  }

  render() {
    return (
      <>
        <Header title="검색" />
        <SearchForm
          value={this.state.searchKeyword}  // 3
          onChange={(value) => this.handleChangeInput(value)}  // 4
          onSubmit={() => this.search(searchKeyword)}
          onReset={() => this.handleReset()}
        />
      <>
    )
  }
}
```

SearchForm에서 관리했던 searchKeyword를 부모 컴포넌트인 App의 state로 끌어 올렸다(1). 이 값을 SearchForm의 props로 전달하고(3) 값을 갱신할 목적으로 onChange에 콜백 함수도 전달했다(4). 콜백함수는 handleChangeInput() 메서드를 호출하는데 변경값으로 상태를 갱신한다(2). SearchForm은 App 컴포넌트에 의해 제어된 컴포넌트인 셈이다.

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

부모 컴포넌트로 옮겨버렸린 state는 더 이상 사용하지 않기 때문에 함수 컴포넌트로 변경했다(1). input을 제어 컴포넌트로 만들 듯 SearchForm도 제어 컴포넌트로 만들기 위해 props.onChange() 함수로 입력한 값을 전달한다(2, 4). 이 값은 곧장 props.value로 들어와 input의 값으로 반영될 것이다(3).

## SearchResult

- 💡요구사항: 검색 결과가 검색폼 아래 위치한다. 검색 결과가 없을 경우와 있을 경우를 구분한다
- 💡요구사항: x버튼을 클릭하면 검색폼이 초기화 되고 검색 결과가 사라진다

검색 결과를 담당할 SearchResult 컴포넌트를 만들어 보자. 지금까지 searchResult 상태 변수로 검색 결과를 렌더링했다. MVC에서는 모델이 관리한 이 값을 뷰가 그렸고, 리액트에서는 App의 상태로 값을 저장하고 redner() 함수에서 그렸다.

SearchForm 컴포넌트는 어떻게 만들어야 할까? App에 있던 상태와 엘리먼트 변수를 가져오면 될까? 질문의 목적은 SearchForm을 개선한 이유와 같다. 만약 SearchForm이 검색 결과를 내부 상태로 가지고 있다면 외부에서는 이 값에 접근할 방법이 없다. App 컴포넌트에서는 검색어 키워드를 들고 있기 때문에 검색할 수 있고 그 결과도 알 수 있다. 따라서 검색 결과를 가진 App 컴포넌트가 자식 컴포넌트인 SearchResult 측으로 전달해 주는 구조가 맞겠다.

검색 결과를 props로 받아 리액트 앨리먼트를 반환하는 SearchResult 컴포넌트를 만들자. SearchResult.js 파일을 추가한다.

```js
// 1
const SearchResult = ({ data = [] }) => {
  // 2
  if (data.length <= 0) {
    return <div className="empty-box">검색 결과가 없습니다</div>
  }

  // 3
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

상태가 필요 없어 함수 컴포넌트로 만들었다(1). 검색 결과를 props의 data 변수로 받는다. 데이터가 없을 경우 검색 결과가 없는 메세지를 보일 것이고(2) 그렇지 않을 경우 리스트를 출력한다(3).

App 컴포넌트에서 사용해 보자.

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
        <SearchForm onSubmit={searchKeyword => this.search(searchKeyword)} />
        {/* 4 */}
        {submitted && <SearchResult data={searchResult} />}
      </>
    )
  }
```

검색 결과를 저장할 searchResult 상태를 추가하고 빈 배열로 초기화 했다(1). 첫 렌딩 시에는 검색 결과를 숨기고 폼이 제출된 다음 보이기 위한 submitted 플래그도 두었다(2). searchResult 배열만으로는 검색 여부를 알 수 없기 때문이다.

SearchForm 컴포넌트에서 submit 이벤트를 수신하면 search() 메소드가 호출되는데 이 때 스토어에서 검색 결과를 가져와 state를 갱신한다(3). 그럼 render()에서 의존하는 SearchResult 컴포넌트가 다시 그려질 것이다(4).

- ~~💡요구사항: 검색 결과가 검색폼 아래 위치한다. 검색 결과가 없을 경우와 있을 경우를 구분한다~~

SearchForm에서 x 버튼을 클릭하거나 검색어를 모두 지우면 reset 이벤트가 발생하는데 이 때 검색결과가 사라져야 한다.

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
        <SearchForm
          onSubmit={searchKeyword => this.search(searchKeyword)}
          onReset={()=>this.handleReset()} {/* 2 */}
        />
        {submitted && <SearchResult data={searchResult} />}
      </>
    )
  }
}
```

SearchForm의 reset 이벤트를 처리하는 handleReset() 메소드를 수정하면 된다(1). 검색 결과의 출력 여부를 submitted 상태가 관리하고 있기 때문에 이를 false로 설정한다. 검색어도 빈 문자열로 초기화하면 이를 사용하는 SearchForm의 input 값이 사라질 것이다. 검색 결과를 담은 searchResult도 빈 배열로 초기화 했다.

- ~~💡요구사항: x버튼을 클릭하면 검색폼이 초기화 되고, 검색 결과가 사라진다~~

## Tabs

- 💡요구사항: 추천 검색어, 최근 검색어 탭이 검색폼 아래 위치한다
- 💡요구사항: 기본으로 추천 검색어 탭을 선택한다
- 💡요구사항: 각 탭을 클릭하면 탭 아래 내용이 변경된다

탭을 담당하는 Tabs 컴포넌트도 만들자. 선택된 탭을 의미하는 state.selectedTab으로 상태 관리를 했다. 이것도 Tabs 컴포넌트로 숨기는 것 보다는 App 컴포넌트에 위치하는 것이 더 낫다. App 컴포넌트는 선택한 탭에 따라 추천 검색어나 최근 검색어 목록을 노출하기 때문이다. Tabs.js 파일을 추가하자.

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

상태가 필요 없기 때문에 함수 컴포넌트로 만들었다. 선택된 탭 selectedTab과 탭을 변경할 때 알려줄 onChange 콜백 함수을 props로 받는다(1). 선택된 탭일 경우 active CSS 클래스를 추가해 선택된 탭으로 표시한다(2). 탭을 클릭하면 이를 부모 컴포넌트로 전달한다(3).

App에서 사용해 보자.

```js
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      searchKeyword: "",
      searchResult: [],
      submitted: false,
      selectedTab: TabType.KEYWORD, // 1
    }

  render() {
    const { submitted, selectedTab } = this.state

    return (
      <>
        <Header title="검색" />
        <SearchForm onSubmit={/* 생략 */} onReset={/* 생략 */} />
        {submitted ? (
          <SearchResult />
        ) : (
          // 2
          <>
            <Tabs
              selectedTab={this.state.selectedTab} // 3
              onChage={slectedTab => this.setState({ selectedTab })} // 4
            />
            {selectedTab === TabType.KEYWORD && <>{`TODO: 추천 검색어`}</>}
            {selectedTab === TabType.HISTORY && <>{`TODO: 최근 검색어`}</>}
          </>
        )}
      </>
    )
  }
}
```

selectedTab을 두어 선택된 탭 상태를 관리한다(1). 초기값은 추천 검색어로 설정했다. Tabs는 폼이 제출되기 전에 SearchForm 아래에 놓았다(2).

- ~~💡요구사항: 추천 검색어, 최근 검색어 탭이 검색폼 아래 위치한다~~

기본 값인 추천 검색어가 selectedTab 속성으로 전달되어 화면 첫 렌딩시에는 추천 검색어 탭이 표시될 것이다(3).

- ~~💡요구사항: 기본으로 추천 검색어 탭을 선택한다~~

그리고 각 탭을 클릭하면 change 이벤트가 발생하는데 선택한 탭을 selectedTab 상태로 반영한다(3). 이 값에 따라 아래 내용이 변경될 것이다.

- ~~💡요구사항: 각 탭을 클릭하면 탭 아래 내용이 변경된다~~

## ⭐중간정리

이전 편에서 단일 컴포넌트로 만들었던 어플리케이션을 역할에 따라 더 작은 컴포넌트로 분리했다.

SearchForm은 검색 폼을 담당하는데 사용자부터 검색어를 입력을 받고 폼 제출과 리셋을 외부로 알리는 역할을 한다. 처음에는 사용자 입력을 직접 상태로 관리했는데 이 상태는 다른 컴포넌트에서도 의존하기 때문에 가까운 부모 컴포넌트인 App으로 state를 끌어 올렸다.

SearchResult도 마찬가지로 상태는 App에서 유지하고 엘리먼트 변수 값을 render()로 옮겼다. Tabs 컴포넌트도 같은 방법으로 분리했다.

이렇게 컴포넌트로 바꾸고 보니 App의 render() 메소드 안에 있던 앨리먼트 변수를 각 각 컴포넌트로 분리한 결과가 되었다. 여전히 state는 이동하지 않고 App 컴포넌트의 소유로 남아있는데 다음 장에서는 자신만의 고유한 state를 관리하는 컴포넌트로 분리해 보겠다.

# 컴포넌트로 구현하기 2

## KeywordList, HistoryList

추천 검색어

- 💡요구사항: 번호와 추천 검색어 이름이 목록 형태로 탭 아래 위치한다
- 💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어의 검색 결과 화면으로 이동한다

최근 검색어

- 💡요구사항: 최근 검색어 이름, 검색일자, 삭제 버튼이 목록 현태로 탭 아래 위치한다
- 💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어로 검색 결과 화면으로 이동한다
- 💡요구사항: 목록에서 x 버튼을 클릭하면 선택된 검색어가 목록에서 삭제된다
- 💡요구사항: 검색시마다 최근 검색어 목록에 추가된다

추천 검색어와 최신 검색어 요구사항이다. 둘은 비슷한 데이터와 모양을 가진다. 둘 다 검색어 목록이라는 배열 데이터를 가지고 있고 클릭에 반응한다. 리스트의 각 항목만 각자 다르게 표현한다. 추천 검색어는 순서와 검색어를 표시하는 반면 최근 검색어는 검색어, 날짜, 버튼을 표시한다. 최근 검색어의 버튼을 클릭하면 목록에서 삭제하는 기능도 다른 점이다.

공통의 요구사항을 코드 재사용으로 풀어 보겠다. 준비편에서 KeywordView를 상속해 HistoryView를 만들었던 것을 기억할 것이다. 컴포넌트도 코드를 재사용할 수 잇는 방법이 있다.

- 상속
- 조합: 컴포넌트 담기
- 조합: 특수화

상속부터 차근차근 알아보자.

## 상속

추천 검색어와 최근 검색어의 공통 로직은 리스트를 다루는 것이다. 배열로 리스트를 렌더링 하는 로직인데 이 기능을 가진 List 컴포넌트를 만들자. List.js 파일을 만든다.

```js
// 1
class List extends React.Component {
  constructor() {
    super()

    this.state = { data: [] } // 2
  }

  // 3
  renderItem(item, index) {
    throw "renderItem()을 구현하세요"
  }

  // 4
  render() {
    const { onClick } = this.props
    const { data } = this.state

    return (
      <ul className="list">
        {data.map((item, index) => (
          // 5
          <li key={item.id} onClick={() => onClick(item.keyword)}>
            {this.renderItem(item, index)} {/* 6 */}
          </li>
        ))}
      </ul>
    )
  }
}
```

배열 상태를 사용하기 때문에 클래스 컴포넌트를 사용했다(1, 2). render() 메소드에서는 이 상태 값으로 리스트 렌더링을 한다(4). 리스트를 클릭하면 외부의 콜백 함수를 호출해 선택한 키워드 문자열을 전달한다(5).

리스트 렌더링에 보면 renderItem()이란 추상 메서드를 호출해서 각 아이템을 그리고 있다(6). List 클래스를 구현한 자식 클래스에서는 이 renderItem()을 오버라이딩해서 각자에 맞는 형태로 리스트를 그릴수 있도록 열어둔 것이다(3).

List 클래스를 상속해 키워드 목록을 위한 컴포넌트를 만들어 보겠다. KeywordList.js 파일을 추가하자.

```js
// 1
class KeywordList extends List {
  // 2
  componentDidMount() {
    const data = store.getKeywordList()
    this.setState({ data })
  }

  // 3
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

List 클래스를 상속했다(1). renderItem()을 오버라이딩해 키워드 목록을 그리는데 순서와 키워드를 출력한다(3). 이 메서드는 부모 클래스의 render() 메소드에서 호출되어 리액트 앨리먼트를 만들 때 사용될 것이다. state.data에는 빈 배열이 초기값인데 외부에서 데이터를 가져오기 위해 생명 주기 메소드 componentDidMount()를 사용했다. 컴포넌트가 돔에 마운트 된 직후에 실행되는데 스토어에서 키워드 목록을 가져와 컴포넌트 상태를 갱신할 것이다(2). State 변화를 감지한 리액트는 다시 render() 메소드로 화면을 다시 그리고 renderItem()도 호출 되어 번호와 추천 검색어 이름을 출력할 것이다.

- ~~💡요구사항: 번호와 추천 검색어 이름이 목록 형태로 탭 아래 위치한다~~

App 컴포넌트에서 사용하는건 간단하다.

```js
class App extends React.Component {
  search(searchKeyword) {
    const searchResult = store.search(searchKeyword);
    this.setState({
      searchKeyword, // 1
      searchResult,
      submitted: true,
    });
  }

  render() {
    return (
      <>
        <Header />
        <SearchForm />
        {submitted ? (
          <SearchResult>
        ) : (
          <>
            <Tabs>
            {selectedTab === TabType.KEYWORD && (
              // 2
              <KeywordList onClick={(keyword) => this.search(keyword)} />
            )}
            {selectedTab === TabType.HISTORY && <>{`TODO: 최근 검색어`}</>}
          </>
        )}
      </>
    )
  }
}
```

이전에 텍스트 출력으로 남겨두었던 부분을 KeywordList로 바꾸었다(2). KeywrodList에서 클릭 이벤트가 발생하면 전달된 추천 키워드를 이용해 search() 메소드를 호출한다. 이전처럼 검색 후 검색 결과로 상태를 갱신한다. 이때 App 컴포넌트가 관리하는 searchKeyword 상태도 갱신해서 SearchForm의 input에 선택한 키워드가 설정되도록 했다(1)

- ~~💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어의 검색 결과 화면으로 이동한다~~

최신 검색어도 List 클래스를 상속해서 만들어 보자. HistoryList.js 파일을 추가한다.

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

  // 5
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

List 클래스를 상속하고(1), renderItem() 메소드를 오버라딩 한다(5). 컴포넌트가 돔에 마운트 된 후 데이터를 불러오기위해 fetch() 함수를 호출한다(2, 3). 스토어에서 데이터를 불러와 컴포넌트 상태로 갱신하면 리액트는 상태 변화를 감지하고 리액트 앨리먼트를 다시 만들 것이다. 그리고 x 버튼 클릭을 처리하는 handleClickRemove() 메소드도 추가했다(4). 스토어에서 검색 이력을 삭제하고 다시 불러오는 역할이다.

이것도 App에서 사용한다.

```js
class App extends React.Component {
  render() {
    const { submitted, selectedTab } = this.state
    return (
      <>
        <Header />
        <SearchForm />
        {submitted ? (
          <SearchResult />
        ) : (
          <>
            <Tabs />
            {selectedTab === TabType.KEYWORD && (
              <KeywordList onClick={keyword => this.search(keyword)} />
            )}
            {selectedTab === TabType.HISTORY && (
              // 1
              <HistoryList onClick={keyword => this.search(keyword)} />
            )}
          </>
        )}
      </>
    )
  }
}
```

최근 검색어를 보여주는 부분을 텍스트에서 HistoryList 사용으로 대체했다. KeywordList를 사용한 방식과 동일하다. App은 selectedTab에 따라 KeywordList나 HistoryList를 렌더링한다. 각 컴포넌트는 생겼다 사라졌다 하는데 매번 componentDidMount() 메서드에 기술한 로직이 실행될 것이다. 이 때 외부 데이터를 가져오고 자신만의 리스트를 렌더링하는 방식으로 각자의 화면을 그린다.

- ~~💡요구사항: 최근 검색어 이름, 검색일자, 삭제 버튼이 목록 현태로 탭 아래 위치한다. (List에서 일부 구현)~~
- ~~💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어로 검색 결과 화면으로 이동한다 (List에서 구현)~~
- ~~💡요구사항: 목록에서 x 버튼을 클릭하면 선택된 검색어가 목록에서 삭제된다~~
- ~~💡요구사항: 검색시마다 최근 검색어 목록에 추가된다~~

## 조합: 컴포넌트 담기

하지만 리액트는 클래스 상속으로 컴포넌트 재활용하는 것을 권장하지는 않는다.

> Facebook에서는 수천 개의 React 컴포넌트를 사용하지만, 컴포넌트를 상속 계층 구조로 작성을 권장할만한 사례를 아직 찾지 못했습니다. - 출처: [리액트 문서](https://ko.reactjs.org/docs/composition-vs-inheritance.html#so-what-about-inheritance)

대신 props를 통해 컴포넌트를 합성하는 방법을 권장한다.

List 컴포넌트를 조합할수 있는 방식으로 변경하고 이를 활용해 KeywordList, HistoryList 컴포넌트를 조합해 만들어 보면서 이 방식의 장점을 알아보자.

List 컴포넌트를 조합할 수 있는 형태로 변경하자.

```js
// 1
const List = ({ data = [], onClick, renderItem }) => {
  return (
    <ul className="list">
      {data.map((item, index) => (
        <li key={item.id} onClick={() => onClick(item.keyword)}>
          {renderItem(item, index)} {/* 2 */}
        </li>
      ))}
    </ul>
  )
}
```

클래스를 사용하지 않고 함수 컴포넌트로 만들었다(1). 외부에서 렌더링에 필요한 데이터를 주입 받겠다는 의도이다. 키워드 목록과 검색 목록을 props.data로 받았다. 리스트 출력까지만 담당하고 리스트를 구성하는 각 항목을 출력하는 함수는 props.renderItem이란 이름으로 전달 하도록 했다. renderItem() 함수에 아이템과 인덱스를 전달해 List 컴포넌트를 사용하는 측에서 구체적으로 그리도록 역할을 위임한 셈이다(2).

참고로 props에 함수를 전달할 수 있다고 했다. 이러한 함수 중 리액트 앨리먼트를 반환하는 함수를 [render props](https://ko.reactjs.org/docs/render-props.html)라고 부른다. 전달된 함수로 UI 렌더링을 하기 때문이다. renderItem이 render props이다.

이제 이걸 사용한 KeywrodList를 만들어 보자.

```js
// 1
class KeywordList extends React.Component {
  constructor() {
    super()
    this.state = { keywordList: [] } // 2
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

키워드 목록을 내부 상태로 갖기 위해 클래스 컴포넌트로 선언했다(1). state.keywordList란 이름으로 빈 배열로 초기화했다(2). 이 값은 render() 메소드에서 사용하는데 List 컴포넌에 전달했다(4). 배열을 보고 List 컴포넌트가 목록을 그리도록 renderItem 함수도 함께 전달해 세부사항을 그리도록 했다(5). 돔이 마운트 된 후 스토어에서 키워드 목록을 가져오고 상태로 갱신되면 목록을 그릴 것이다(3).

추천 검색어

- ~~💡요구사항: 번호와 추천 검색어 이름이 목록 형태로 탭 아래 위치한다.~~
- ~~💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어의 검색 결과 화면으로 이동한다.~~

List가 공통 로직과 UI를 담는 컴포넌트이고 이걸 이용해서 KeywordList와 HistoryList를 다시 만들었다. 클래스 상속과는 달리 List안에 renderItem이란 render props를 전달해서 List가 컴포넌트를 그리도록 한 점이 차이다. 이 뿐만 아니라 컴포넌트 자체로 props로 전달할수 있다. 이렇게 props로 컴포넌트를 전달하거나 렌더하는 방법을 전달하는 방식을 **컴포넌트 담기**라고 부른다.

HistoryList도 List 컴포넌트를 사용해서 만들어 보자.

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

  //  5
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
              // 7
              onClick={event => this.handleClickRemove(event, item.keyword)}
            />
          </>
        )}
      />
    )
  }
}
```

최근 검색어 데이터를 상태로 관리하기 위해 클래스 컴포넌트로 만들고(1) state.historyList를 빈 배열로 초기화 했다(2). 이 값을 render() 메소드에서 List 컴포넌트와 함께 사용했다(6). 돔이 마운트되면 데이터를 불러와 historyList 상태를 갱신하고(4) 리스트를 다시 그릴 것이다.

최근 검색어

- ~~💡요구사항: 최근 검색어 이름, 검색일자, 삭제 버튼이 목록 현태로 탭 아래 위치한다~~
- ~~💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어로 검색 결과 화면으로 이동한다~~
- ~~💡요구사항: 검색시마다 최근 검색어 목록에 추가된다~~

render() 메소드를 다시보면 히스트리 리스트의 각 항목을 그릴 수 있도록 renderItem 함수도 전달했는데 이 부분이 KeywordList와 다른 점이다. 키워드 옆에 날짜와 삭제 버튼을 추가했다. 삭제 버튼을 클릭하면 handleClickRemove() 함수를 호출하는데(7) 이벤트 전파을 막고 검색 이력에서 삭제한 뒤 데이터를 다시 불러온다(5).

최근 검색어

- ~~💡요구사항: 목록에서 x 버튼을 클릭하면 선택된 검색어가 목록에서 삭제된다~~

KeywordList가 리액트 앨리먼트를 만들 때 List 컴포넌트를 사용한 것처럼 다른 컴포넌틀 조합하는 방식은 중복 코드를 줄일 수 있다. 다른 컴포넌트를 담는 방법 외에도 특수화라는 방식의 조합 방법도 살펴보자.

## 조합: 특수화

컴포넌트를 조합하는 또 다른 방식도 있다. 바로 **특수화**라는 것인데 List 컴포넌트를 다시 만들면서 알아보자.

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
          {/* 3 */}
          {hasIndex && <span className="number">{index + 1}</span>}
          <span>{keyword}</span>
          {hasDate && <span className="date">{formatRelativeDate(date)}</span>}
          {/* 4 */}
          {!!onRemove && (
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

List 컴포넌트가 외부에서 받는 props 갯수가 늘었다(1). props 어떻게 설정하느냐에 따라 조금씩 다른 모양과 행위를 하는 컴포넌트를 만드는데 사용할 것이다. hasIndex를 설정하면 좌측에 순서를 표시하도록 했다(3). KeywordList 컴포넌트에서 사용할 옵션이다.

hasDate와 remove 값에 따라 날짜와 삭제 버튼을 보이도록 했다(4). 최근 검색어를 위한 옵션이다.

이걸 조합해서 KeywrodList를 만들어 보자.

```js
class KeywordList extends React.Component {
  render() {
    const { onClick } = this.props
    const { keywordList } = this.state

    return <List hasIndex data={keywordList} onClick={onClick} />
  }
}
```

순서와 키워들 표시하기 때문에 hasIndex 속성을 전달했다. KeywordList는 순서가 있는 List의 특수한 경우라고 생각하기 때문이다.

HistoryList도 만들어 보자.

```js
class HistoryList extends React.Component {
  render() {
    const { onClick } = this.props
    const { historyList } = this.state

    return (
      <List
        hasDate
        data={historyList}
        onClick={onClick}
        onRemove={keyword => this.handleRemove(keyword)}
      />
    )
  }
}
```

HistoryList는 날짜와 삭제버튼이 있는 List의 특수한 경우라고 생각한다.

## ⭐중간 정리

코드를 줄이는 방법은 공통 로직을 하나로 만들고 이를 재사용하는 것이다. 공통 로직을 부모 클래스에게 올려버리고 이를 상속해 코드를 재활용하거나 단일 역할의 함수를 조합해 또 다른 일을 하는 함수를 만들어 함수를 재활용 할 수 있다. 컴포넌트도 재활용할 수 있는 방법이 있는데 이 장에서는 3가지 방법을 알아 보았다.

상속. 공통 로직을 부모 클래스가 갖도록 했다. 리스트 상태를 가지고 이를 리스트 렌더링한다. 전통적인 OOP 스타일의 상속 구조를 활용할 수 있다는 점에서는 익숙한 방식이다. 하지만 상속 단계가 많아지면 코드를 파악하는데 다소 어려울 수도 있다는 단점이 있다. 특히 state에 반응하는 UI 코드가 상속 구조에 가려 잘 보이지 않을 수도 있기 때문이다. 오히려 리액트 커뮤니티에서는 지양하는 분위기인 것 같다.

> React는 강력한 합성 모델을 가지고 있으며, 상속 대신 합성을 사용하여 컴포넌트 간에 코드를 재사용하는 것이 좋습니다. - 출처: [리액트 문서 > 합성 vs 상속](https://ko.reactjs.org/docs/composition-vs-inheritance.html)

조합: 컴포넌트 담기. 함수를 조합하듯 컴포넌트를 조합하는 방식으로 코드 재활용을 권장한다. 리액트의 props 에는 어떠한 자바스크립트 값도 전달할 수 있는데 props를 활용해서 컴포넌트를 조합한다. 여기서는 렌더링 용도의 render props를 전달했다. 이 외에도 리액트 컴포넌트 자체를 전달해 조합할 수도 있다.

조합: 특수화. 이것도 props를 사용하는 방식이라는 점에서는 같지만 접근의 차이라고 생각한다. KeywordList는 List 컴포넌트의 특수한 경우이다. List 컴포넌트에 좌측 순서가 있는 특수한 경우인 셈이다. HistoryList도 그러한데 우측에 날짜와 버튼이 위치한 List의 특수한 경우인 것이다.

# 🌟최종정리

리액트 라이브러리의 특성인 리액티브와 가상돔 그리고 마지막인 강력한 추상화 도구인 컴포넌트에 대해 알아 보았다. 상태와 UI로 관리되는 화면 코드를 컴포넌트라는 개념으로 추상화한 것이다. 상태가 필요하면 클래스 컴포넌트로, 상태가 필요 없으면 함수 컴포넌트를 사용한다. 컴포넌트는 내부 state와 외부 props를 통해 리액티브한 UI를 만들 수 있다.

컴포넌트를 작게 쪼게면 서로 격리시킬수 있는 장점이 있지만 어떤 경우에는 하나의 상태를 다른 컴포넌트에서도 사용하는 경우가 빈번히 발생한다. 이럴 때는 가장 가까운 부모 컴포넌트로 state 끌어 올려 문제를 해결한다. SearchForm에서 입력 데이터를 부모로 이동해 다른 컴포넌트를 제어하도록 개선했다.

함수를 재활용하듯 컴포넌트도 재활용 할 수 있다. 전통적인 OOP기법 처럼 클래스 상속으로 코드를 재활용할 수 있는 방법과 함수를 조합하듯 컴포넌트를 조합해서 사용하는 방식이 있다. 리액트는 후자를 권장한다.

--

지금까지 총 4편의 연재물을 통해 리액트를 이용한 웹개발에 대해 알아 보았다. 혹자는 준비편에서 다룬 순수 자바스크립트에 대한 내용에 만족하지 못하거나 이해하기 어려워할지도 모르겠다. 리액트를 설명하는데 비교 대상이 있으면 좋겠다는 생각으로 내용이 다소 길긴 하지만 초반에 다루었다. 리액트의 장점을 부각하기 위한 의도라고 여겨 주었으면 좋겠다.

리액트의 세 가지 특징을 중심으로 알아보았다. 데이터 변화에 따라 UI가 반응하는 리액티브한 성질은 상태 관리만으로도 UI 관리를 할 수 있다. 상태와 UI를 모두 관리해야하는 MVC 패턴과 비교하면 장점이 드러난다. 돔 API를 최소화해 렌더링 성능을 높이기 위한 가상돔도 리액트의 특징이다. 우리는 가상돔만 다루기 때문에 성능에 신경 쓰지 않고 어플리케이션 로직에 집중할 수 있는 여유가 생긴다. 마지막으로 상태와 UI를 추상화한 컴포넌트를 지원한다. 이를 통해 화면 개발에 대한 사고 방식을 바꿀수 있고 재활용할 수 있는 코드도 더 많이 만들 수 있게 되었다.

리액트 공식 문서 위주로 내용을 다루었다. 여전히 고급 주제들은 더 학습해야할 대상이다. 컨텍스트, 훅 등. 뿐만 아니라 리액트와 함께 사용하는 라우터, 전역 상태 관리 솔루션 더 나아가 리액트기반의 웹 프레임워크를 탐구하는 것은 웹 기술을 익히는데 큰 도움이 될 것이라고 생각한다. 이것으로 연재를 마친다. 끝.
