---
slug: "/series/2021/04/12/lecture-react-usage.html"
date: 2021-04-12
title: "만들면서 학습하는 리액트: 사용편1"
layout: post
category: 연재물
series: 만들면서 학습하는 리액트
videoId: video-2021-05-04-inflearn-react
tags: [react]
---

준비편에서는 순수 자바스크립트로 검색 화면을 만들었다. 이 때 사용한 요구사항을 리액트 버전으로 만들어 보는 것이 이번편의 내용이다. 요구사항에 대해서는 이미 익숙하기 때문에 리액트의 특성과 장점에 대해 집중하자.

# 검색 폼 구현하기 1

## Input 요소 사용하기

검색 화면 상단에 위치할 검색 폼부터 만들어 보자.

- 💡요구사항: 검색 상품명 입력 폼이 위치한다.

앞으로 UI는 모두 JSX 문법으로 작성하겠다. 검색 폼을 위한 앨리먼트를 만든다.

```js
const element = (
  // 1
  <>
    <header>
      <h2 className="container">검색</h2>
    </header>
    <div className="container">
      {/* 2 */}
      <form>
        <input type="text" placeholder="검색어를 입력하세요" autoFocus />
      </form>
    </div>
  </>
)

// 3
ReactDOM.render(element, document.querySelector("#app"))
```

헤더 아래 검색 폼 앨리먼트를 추가했다(2). "검색어를 입력하세요"라는 플레이스 홀더 문구가 표시되는 텍스트 인풋이다.

트리 형태를 유지해야하기 때문에 최상단의 노드는 단 하나만 있어야 한다. 가장 많이 쓰이는 div 앨리먼트로 감싸 하나의 루트 노드를 유지할 수 있다. 만약 실제 돔에 상단의 노드가 필요하지 않다면 프래그먼트라고 불리는 태그를 사용해서 묶어줄 수 있다. 위에서 사용한 `<>` 문자가 바로 프래그먼트다(1).

element에 담긴 리액트 엘리먼트는 ReactDOM에게 전달해 가상돔을 만들고 화면에 출력하도록 했다(3).

이제 인풋 엘리먼트에 텍스트를 입력하면 입력한 값이 출력되어 나올 것이다. 이것은 브라우져의 기본 동작인데 리액트에서는 다루는 방식이 다르다.

리액트에서 인풋 엘리먼트를 제대로 다루려면 브라우져 상태 관리를 사용하지 않고 **리액트 방식의 상태 관리가 필요**하다. 입력한 값을 활용하려면(출력한다거나 API 호출 인자로 사용하려면) 어딘가에 저장해 두어야 한다.

리액트에서 상태를 관리하려면 다음에 소개할 "컴포넌트"를 사용해야 한다.

## 리액트 컴포넌트

리액트를 설명하는 내용이다.

> React는 ... "컴포넌트"라고 불리는 작고 고립된 코드의 파편을 이용하여 복잡한 UI를 구성하도록 돕습니다. - 출처: [자습서 > React란 무엇인가요](https://ko.reactjs.org/tutorial/tutorial.html#what-is-react)

엘리먼트가 리액트 앱을 구성하는 최소단위라면, **컴포넌트는 UI를 나타내는 엘리먼트와 어플리케이션 로직을 포함한 상위 개념**이다. 로직은 컴포넌트의 상태를 변경하면서 UI 엘리먼트를 제어한다. 우리가 하려는 것은 입력 값이라는 상태를 **기억**하려는 것이다. 컴포넌트가 적합하다.

코드를 컴포넌트를 사용한 버전으로 작성해 보자.

```js
// 1
class App extends React.Component {
  render() {
    // 2
    return (
      <>
        <header>
          <h2 className="container">검색</h2>
        </header>
        <div className="container">
          <form>
            <input type="text" placeholder="검색어를 입력하세요" />
          </form>
        </div>
      </>
    )
  }
}

ReactDOM.render(<App />, document.querySelector("#app")) // 3
```

리액트 컴포넌트는 React 라이브러리가 제공한 **[Component 클래스](https://ko.reactjs.org/docs/react-component.html)** 를 상속해서 만드는데 어플리케이션을 나타내는 App 컴포넌트로 이름 지었다(1). 리액트 컴포넌트 구성 요소 중 **render()** 메서드는 리액트 앱의 기본 구성 요소인 리액트 엘리먼트를 반환해서 돔을 만드는 역할을 한다(2).

App은 리액트 클래스일 뿐 아직 엘리먼트는 아니다. 앞서 언급했지만 ReactDOM.render() 함수는 리액트 엘리먼트를 인자로 받기 때문에 App 클래스를 엘리먼트로 전환해야한다. JSX 문법을 이용한 `<App />` 표현식이 바로 그것이다(3).

JSX 표현식으로 클래스 컴포넌트를 사용하면 리액트 엘리먼트를 반환하는 함수 호출로 코드가 바뀌기 때문이다.

```js
React.createElement(App, null)
```

## 입력 값을 기억하기: State

리액트 컴포넌트 구성요소 중 **state는 컴포넌트의 상태를 저장하기 위한 용도**이다. 이것은 컴포넌트가 유지해야 할 값으로서 컴포넌트 내부에서만 접근할 수 있는 속성을 가진다.

클래스에서 state를 사용하려면 생성자 함수에서 멤버 변수로 등록해 초기값을 설정한다.

```js
constructor() {
  super() // 1
  this.state = { searchKeyword: "" } // 2
}
```

App 클래스는 React.Component 클래스를 상속했기 때문에 생성 시점에 부모의 생성자 함수를 호출해야 한다(1). 그리고 나서 생성된 this에 state란 객체를 등록해 상태를 만들 수 있다(2). searchKeyword 라는 이름을 키로 갖는 객체를 초기 값으로 할당했는데 입력값이 빈 문자열이라는 의미다.

다음은 이 값을 인풋 엘리먼트에 연결할 차례다. 렌더 함수에서 반환하는 리액트 엘리먼트 중에 input에 연결한다.

```js
<input value={this.state.searchKeyword} />
```

value는 인풋 엘리먼트에 있는 속성인데 input에 값을 설정할 때 사용한다. 우리는 이걸 컴포넌트의 상태 값인 this.state.searchKeyword로 설정했다. 이처럼 JSX에서 엘리먼트 속성에 자바스크립트 표현식은 **중괄호**를 사용해 표현한다. 초기값이 빈 문자열이므로 화면에는 비어있는 input이 보일 것이다. 만약 생성자 함수에서 searchKeyword 를 "abc"로 바꾸면 인풋 요소에는 "abc"라는 문자열이 출력되는 셈이다.

하지만 무언가 입력하면 input이 반응하지 않는다. 브라우져에서 input 상태를 관리했던 것을 지금은 리액트 컴포넌트의 상태값으로 변경했기 때문이다. 사용자가 입력했을 때 상태를 변경하는 로직도 추가해야 온전히 리액트 컴포넌트로 상태 관리를 할 수 있다.

## 상태를 갱신하기: 이벤트 처리

인풋 요소에 문자를 입력하면 change 이벤트가 발생한다. 이 이벤트를 수신하면 입력한 값을 알 수 있는데 이걸로 상태를 갱신하면 되지 않을까? 컴포넌트의 state는 input 엘리먼트의 value에 연결되어 있기 때문에 입력한 값이 곧장 인풋 엘리먼트에 표시될 것이다.

리액트에서 이벤트를 처리하는 방식은 일반 자바스크립트를 사용하는 것과 유사하다. 다만 이벤트 핸들러 이름이 조금 다르다. 앞서 JSX에서도 소개 했듯이 HTML에서 change 이벤트를 처리하려면 onchange 라는 이름의 속성을 사용하지만 리액트에는 onChange로 카멜케이스를 사용한다.

인풋에서 발생하는 change 이벤트를 리액트로 처리해 보자.

```js
<input
  value={this.state.searchKeyword}
  onChange={event => this.handleChangeInput(event)} // 1
/>
```

change 이벤트가 발생하면 클래스의 handleChange 메서드가 처리하도록 연결했다. value 속성과 마찬가지로 onChange도 자바스크립트 표현식을 사용하려면 중괄호를 사용한다. 익명 함수를 사용했는데 객체로 받은 이벤트 객체를 곧장 handleChangeInput() 메서드에 전달한다. 이 메서드를 정의할 차례다.

```js
// 1
handleChangeInput(event) {
  const searchKeyword = event.target.value // 2
  this.searchKeyword = searchKeyword // 3
}
```

handleChangeInput() 이라는 이름으로 핸들러 이름을 정했다(1). handle\*로 시작하는 이벤트 핸들러 이름은 리액트 관례를 따랐다. 인자로 넘어온 이벤트 객체를 통해 입력한 값을 알 수 있는데 event.target.value가 바로 그것이다(2). 인풋 엘리먼트에 연결되어 있는 상태를 이 값으로 갱신하면 화면이 반응할 것이다. 하지만 위 코드처럼 직접 state 객체를 직접 수정하면 리액트 앨리먼트가 반응하지 않는다.

리액트 컴포넌트는 스스로 그려져야 할 때를 알고 있고 필요할 때만 render() 함수를 호출해서 컴포넌트를 다시 그린다. 만약 강제로 컴포넌트의 render() 함수를 호출하려면 클래스의 [forceUpdate()](https://ko.reactjs.org/docs/react-component.html#forceupdate) 메서드를 사용해야 한다.

```js
handleChangeInput(event) {
  const searchKeyword = event.target.value
  this.searchKeyword = searchKeyword
  this.forceUpdate() // 1
}
```

리액트 컴포넌트가 스스로 상태의 변화를 인지하고 render()를 호출하도록 하는 방법이 필요하다. 기억하자. **항상 컴포넌트의 상태를 갱신하려면 [setState()](https://ko.reactjs.org/docs/react-component.html#setstate) 메서드를 사용**하자!

```js
handleChangeInput(event) {
  const searchKeyword = event.target.value
  this.setState({ searchKeyword }) // 1
}
```

클래스가 제공하는 setState() 메서드로 상태를 변경했다. 이 메서드는 컴포넌트의 상태를 변화시키겠다는 컴포넌트와의 직접적인 약속이다. 이 메서드를 호출하면 비로소 컴포넌트는 상태 변화를 알 수 있고 다시 그려야할지 여부도 판단할 수도 있는 것이다.

이렇게 해서 첫 번째 요구사항을 구현했다.

- ~~💡요구사항: 검색 상품명 입력 폼이 위치한다.~~

## ⭐중간 정리

검색폼을 리액트 버전으로 만들었다.

브라우져는 기본적으로 input 앨리먼트의 사용자 입력값을 스스로 관리한다. 리액트에서 input을 제대로 다루려면 브라우져의 상태 관리를 리액트 안으로 가져와야 하는데 이 때 사용할 수 있는 것이 리액트 컴포넌트다.

클래스로 제공하는 리액트 컴포넌트는 상태 관리를 위한 내부 변수 state를 가지고 있다. 이 값을 input의 value로 지정하면 state가 변경될 때마다 input 엘리먼트가 반응한다. 상태를 변경하는 방법도 필요한데 Component 클래스의 setState() 메서드가 이 역할을 한다. 이 메서드를 통해 상태를 관리해야 컴포넌트는 상태의 변화를 인지할 수 있고 이 변화는 곧장 UI까지 영향을 미친다.

이렇게 input 앨리먼트 자체의 상태 관리를 사용하지 않고 리액트 컴포넌트가 관리하는 것을 [제어 컴포넌트(Controlled Component)](https://ko.reactjs.org/docs/forms.html#controlled-components)라고 부른다.

검색폼의 다음 요구사항으로 넘어가자.

# 검색폼 구현하기 2

## 조건부 렌더링

- 💡요구사항: 검색어를 입력하면 x 버튼이 보이고, 없으면 x 버튼을 숨긴다.

입력 요소에 무언가 입력하면 우측에 x 버튼을 추가한다. 반대로 입력한 문자를 삭제하면 버튼이 사라져야 한다. 조건에 따라 보이거나 숨겨야 하는 조건부 렌더링 기능을 사용해서 요구사항을 구현할 수 있겠다.

리액트에서 [조건부 렌더링](https://ko.reactjs.org/docs/conditional-rendering.html) 하는 방식은 세 가지다.

- 엘리먼트 변수를 사용하는 방식
- 삼항 연산자를 사용하는 방식
- && 연산자를 사용하는 방식

각 방식으로 구현해 보겠다. 먼저 x 버튼을 담아둘 resetButton **[엘리먼트 변수](https://ko.reactjs.org/docs/conditional-rendering.html#element-variables)**를 만들자.

```js
let resetButton = null // 1

// 2
if (this.state.searchKeyword.length > 0) {
  resetButton = <button type="reset" className="btn-reset" /> // 3
}
```

JSX는 표현식이기 때문에 값으로 평가되고 값은 변수에 담아 놓을 수 있다. 기본값은 아무것도 보여주지 않도록 null을 설정했다(1). 인풋 엘리먼트에 문자를 입력하기 시작하면 searchKeyword 상태에 입력한 값이 들어갈 것이고 문자열의 길이는 0 이상이 될 것이다(2). 이 경우 버튼 엘리먼트를 resetButton 변수에 할당하여 버튼을 보이도록 한다(3).

JSX 안에서 자바스크립트에 담긴 앨리먼트 변수를 출력하려면 중괄호(`{}`) 를 사용한다.

```js
<form>
  <input type="text" placeholder="검색어를 입력하세요" />
  {resetButton}
</form>
```

이제 입력을 시작하면 보이지 않던 x 버튼이 표시될 것이다.

**삼항 연산자**를 사용하면 엘리먼트 변수를 사용하지 않고도 동적으로 엘리먼트를 제어할 수 있다.

```js
<form>
  <input type="text" placeholder="검색어를 입력하세요" />
  {/* 1 */}
  {this.state.searchKeyword.length > 0 ? (
    <button type="reset" className="btn-reset" />
  ) : null}
</form>
```

JSX는 자바스크립트 표현식이기 때문에 JSX 코드 안에 삼항 연산자를 사용할 수 있다. 엘리먼트 변수를 사용한 조건과 동일하게 리액트 엘리먼트를 할당했다(1).

**논리연산자 &&**를 사용하면 더 간단한 코드를 만들 수 있다.

```js
<form>
  <input type="text" placeholder="검색어를 입력하세요" />
  {/* 1 */}
  {this.state.searchKeyword.length > 0 && (
    <button type="reset" className="btn-reset" />
  )}
</form>
```

&& 연산자는 왼쪽 피연산자가 참으로 평가되어야만 오른쪽 피연산자를 평가한다. 따라서 검색어가 있을 경우는 x 버튼을 표시할 것이다. 그렇지 않으면 false를 반환하고 리액트는 이를 무시한다.

앵귤러나 Vue.js는 조건부 렌더링을 위한 전용 디렉티브를 제공하는데 마크업 부분이 스크립트와 분리되어 있다. 반면 리액트는 자바스크립트와 JSX 코드 조각을 한 곳으로 모아 하나의 추상화된 컴포넌트를 만드는 점이 다르다. 컴포넌트가 단일 책임을 진다는 것 부각하기 위한 의도는 아닐까 생각해 본다.

- ~~💡요구사항: 검색어를 입력하면 x 버튼이 보이고, 없으면 x 버튼을 숨긴다.~~

## 폼 제출

- 💡요구사항: 엔터를 입력하면 검색 결과가 보인다.

검색어를 넣고 엔터를 입력하면 검색 결과가 보이도록 하는 기능이다. 폼에서 엔터를 입력하면 submit 이벤트가 발생하는데 이를 잡아서 처리하자. 변경 이벤트를 onChange 속성으로 받듯이 onSubmit 속성으로 폼 제출을 이벤트를 받을 수 있다.

```js
<form onSubmit={event => this.handleSubmit(event)}>
```

이벤트 처리기에서는 간단히 로그만 찍어 보았다.

```js
handleSubmit(event) {
  console.log('TODO: handleSubmit')
}
```

이제 인풋 엘리먼트에서 엔터키를 입력하면 로그가 찍힐 것이다. 브라우저는 폼 제출시 서버에 요청해서 현재 화면을 갱신하는데 이것도 우리가 원하는 동작이 아니기 때문에 차단하자.

```js
handleSubmit(event) {
  event.preventDefault() // 1
  console.log('TODO: handleSubmit')
}
```

preventDefault() 함수를 호출해 기본 동작을 막았다(1).

- ~~💡요구사항: 엔터를 입력하면 검색 결과가 보인다.~~

검색 결과를 처리하는 것은 검색 결과 구현하기 장에서 다룰 예정이다. 폼 처리는 여기까지 남겨두고 검색폼의 마지막 요구사항마저 구현하자.

## 폼 초기화

- 💡요구사항: X 버튼을 클릭하거나 검색어를 삭제하면 검색 결과를 삭제한다.

x 버튼을 클릭하면 type="reset" 속성에 의해 폼에 reset 이벤트가 발생한다. 지금까지 사용한 이벤트 처리기와 마찬가지로 onReset 속성으로 이벤트를 처리하자.

```js
<form onReset={() => this.handleReset()}>
```

handleReset() 메서드는 아래처럼 만든다.

```js
handleReset() {
  this.setState({ searchKeyword: "" }) // 1
  console.log("TODO: handleResset")
}
```

input 엘리먼트에 입력한 검색어를 삭제하려면 어떻게 해야할까? input은 제어 컴포넌트 방식을 사용하고 있어서 컴포넌트의 state로 관리하고 있다. State를 변경할 때마다 input 값에 반영되는 것이다. 따라서 검색어를 지우려면 state 값을 초기화 하면 된다(1). State를 바꿀 때는 직접 값을 할당하지 말고 setState() 사용을 잊지 말자.

입력한 검색어를 지울 때도 검색 결과를 숨겨야 한다. Input 엘리먼트에서 발생한 change 이벤트를 처리하는 handleChangeInput() 메서드도 조금 수정하자.

```js
handleChangeInput(event) {
  const searchKeyword = event.target.value
  if (searchKeyword.length === 0) return this.handleReset() // 1
  this.setState({ searchKeyword })
}
```

입력한 문자열이 없을 경우는 폼이 리셋되는 것과 같다고 판단해 handleReset() 메서드를 호출했다(1). 입력 문자열을 모두 삭제했을 때의 처리를 handleReset() 메서드에게 위임한 셈이다. 이 메서드는 searchKeyword를 빈 문자열로 변경하고 연결된 UI의 x 버튼이 사라질 것이다.

- ~~💡요구사항: X 버튼을 클릭하거나 검색어를 삭제하면 검색 결과를 삭제한다.~~

## ⭐중간 정리

검색어 입력에 따라 보이고 안보이는 x 버튼을 만들었다. 이를 조건부 렌더링이라고 부르는데 엘리먼트 변수를 이용해 조건에 따라 리액트 엘리먼트나 null을 담아 표현할 수 있다. 좀 더 간단하게 삼항 연산자나 && 연산자를 이용해서 직접 JSX 코드 안에 표현할 수도 있다.

폼 제출 시점을 onSubmit 속성으로 잡았고 지금은 간단히 로그만 찍어 두었다. 자세한 기능은 이후 요구 사항을 개발하면서 추가할 예정이다.

폼이 초기화 되거나 검색어를 삭제하면 x 버튼을 숨기는 기능도 만들었다. 직접 돔을 수정하거나 뷰 메서드를 호출하지 않고 UI를 관리했다는 점에 주목했으면 좋겠다. 리액트 state.searchKeyword가 x 버튼의 노출 로직에 연결되 있기 때문에 우리는 상태 값만 관리하면 자동으로 UI에 반영된다.

이것으로 검색폼을 구현했다. 검색 결과로 넘어가자

# 검색 결과 구현하기

## 검색 결과가 없을 경우

- 💡요구사항: 검색 결과가 검색폼 아래 위치한다. 검색 결과가 없을 경우와 있을 경우를 구분한다.

검색어와 엔터를 입력하고 나면 검색 결과 목록이 나타나는 기능이다. 검색결과가 없을 경우도 구분해야 한다. X 버튼의 노출 여부를 searchKeyword라는 상태에 의존했듯이 검색 결과도 같은 방법으로 구현할 수 있겠다.

```js
constructor() {
  super()
  this.state = {
    searchKeyword: "",
    searchResult: [], // 1
  }
}
```

컴포넌트 생성시 state 객체를 만드는데 searchResult를 추가해 검색 결과가 없다는 의미의 빈 배열값으로 설정했다(1).

리액트 앨리먼트를 반환하는 render() 메서드에서는 이 searchResult 상태에 따라 검색결과 유무를 판단할 수 있을 것이다. 먼저 검색 결과가 없는 경우 적당한 메세지를 화면에 보이도록 하자.

```js
render() {
  return (
    <>
      <header>{/* 생략 */}</header>
      <div className="container">
        <form>{/* 생략 */}</form>
        <div className="content">
          {this.state.searchResult.length <= 0 // 1
            ? <div>검색 결과가 없습니다</div> // 2
            : <div>TODO: 검색결과 목록 표시하기</div> /* 3 */}
        </div>
      </div>
    </>
  )
}

```

searchResult 배열 길이에 따라 검색 결과를 노출한다(1). 초기값처럼 빈 배열일 경우 검색 결과를 찾을 수 없다는 메세지를 보여준다(2). 검색 결과가 있다면 목록을 노출하도록 했는데(3) 다음 장에서 이어서 구현하자.

- ~~💡요구사항: 검색 결과가 검색폼 아래 위치한다. 검색 결과가 없을 경우와 있을 경우를 구분한다.~~

## 검색 결과가 있을 경우

검색결과가 있을 경우는 searchResult 배열의 길이가 0보다 클 때다. 이 배열을 가지고 검색결과를 표현하는 리액트 엘리먼트를 만들면 되겠다.

```js
render() {
  return (
    <>
      <header>{/* 생략 */}</header>
      <div className="container">
        <form>{/* 생략 */}</form>
        <div className="content">
          {searchResult.length <= 0 ? (
            <div>검색 결과가 없습니다</div>
          ) : (
            // 1
            <ul>
              {/* 2 */}
              {searchResult.map(item) => (
                // 3
                <li>
                  <img src={item.imageUrl} />
                  <p>{item.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

```

ul 태그를 이용해 리스트 앨리먼트를 만든다(1). 배열로 리스트 렌더링할 때는 Array.prototype.map() 함수를 사용한다(2). JSX가 표현식이기 때문에 map() 함수에 전달한 콜백함수도 JSX를 반환할 수 있다(3). 이미지와 상품명을 포함한 li 앨리먼트가 검색 결과 갯수만큼 생성될 것이다.

searchResult는 생성자에서 초기값만 설정했기 때문에 검색결과를 제대로 확인할 수 없는 상태다. 검색어를 입력하고 엔터키를 입력했을 때 우리는 검색결과가 나올 것을 기대한다. 폼을 제출할 때 실행되는 handleSubmit() 메서드에서 search()메서드를 호출하도록 하자.

```js
handleSubmit(event) {
  event.preventDefault()
  this.search(this.state.searchKeyword) // 1
}

search(searchKeyword) {
  const searchResult = store.search(searchKeyword) // 2
  this.setState({ searchResult }) // 3
}
```

입력한 검색어를 검색 용도인 search() 메서드로 전달한다(1). 이전 편에서 사용했던 store.search() 함수로 검색 결과를 얻는다(2). 곧장 이 값을 컴포넌트의 상태로 갱신하기 위해 setState()를 사용한다(3). searchResult 배열이 변화함에 따라 UI도 반응하게 될 것이다.

생성자 함수에서 만든 state는 searchKeyword와 searchResult로 구성된 객체이다. setState로 이 객체를 변경할 때 searchResult 필드만 설정했는데 설정하지 않은 searchKeyword는 어떻게 되는걸까? setState()로 변경한 state는 기존 객체를 대체하지 않고 병합한다. 변경한 필드만 반영되고 그렇지 않은 필드는 기존 값을 유지하는 방식으로 상태를 관리하는 것이다. 따라서 searchKeyword는 기존에 입력한 값을 유지하고 searchResult만 변경되는 효과가 있다.

이제 검색어와 엔터키를 입력하면 검색 결과가 나올 것이다. 하지만 리액트 라이브러리는 브라우져 콘솔에 아래와 같이 경고한다.

- Warning: Each child in a list should have a unique "key" prop.

## 리스트와 키

보통 라이브러리는 API를 잘못 사용했을 때 경고나 오류 메세지로 알려준다. 브라우져 콘솔에 나오는 경고 문구의 링크를 열어보면 [리스트와 Key](https://ko.reactjs.org/docs/lists-and-keys.html)라는 리액트 문서로 연결된다. 무척 친절하다. 문서를 읽어 보자.

> Key는 엘리먼트에 안정적인 고유성을 부여하기 위해 배열 내부의 엘리먼트에 지정해야 합니다.

searchResult 배열을 이용해서 li 엘리먼트를 여러 개를 만들었는데 이 때 li 엘리먼트에 key 속성을 추가해야 한다는 것이다.

여기서 다시 가상돔이 나온다. 리액트 앨리먼트를 가상돔으로 만들고 이전 가상돔과 차이가 있는 부분만 계산해 실제 돔에 반영하면서 렌더링 성능을 올린다고 했다. 트리 비교이기 때문에 O(n^3)만큼의 계산 복잡도를 가진다. 화면을 그릴 때마다 이러한 계산은 비효율적이고 화면 렌더링을 오히려 느리게 만들 수도 있겠다.

그래서 두 가지 가정하에 [재조정(Reconciliation)](https://ko.reactjs.org/docs/reconciliation.html) 알고리즘을 사용한다. (1) 앨리먼트 타입이 다를 경우와 (2) Key 값이 다를 경우, 각 각 화면을 조정하도록 하는데 O(n)으로 계산 복잡도가 확연하게 줄어든다고 한다.

리스트 앨리먼트는 li를 여러 개 사용하기 때문에 앨리먼트 타입으로 차이를 판단할 수는 없고 이 경우 유일한 값을 key 속성에 사용함으로써 리액트가 이전 가상돔과 차이를 계산하도록 알려야 한다. 보통 데이터의 아이디 값을 사용하기를 권장하는데 여기서도 그렇게 설정하겠다.

```js
<li key={item.id}>
```

검색 결과 항목의 식별자인 id를 리스트 앨리먼트의 key로 사용했다.

배열 메서드인 map()을 사용해서인지 메서드의 두번 째 인자인 index를 사용하기도 한다. 그러나 이것은 고유한 값이 없을 경우 최후의 수단으로 고려하고 지양하는 것이 옳다. 성능 저하나 화면이 갱신되지 않는 문제를 내포하기 때문이다.

이제는 검색어를 입력하고 엔터를 입력하면 검색 결과가 리스트 형식으로 출력되어 나온다.

검색 전 초기 화면에서도 검색 결과 없음 메세지가 노출된다. searchResult에 의존하기 때문이다. 폼을 제출 후 검색 여부에 따라 검색 결과를 보여주어야 더 자연스럽겠다. 이것도 조건부 렌더링으로 구현할 수 있는데 폼 전송 여부를 기억하는 submitted 라는 state를 추가하자.

```js
constructor() {
  super()
  this.state = {
    searchKeyword: "",
    searchResult: [],
    submitted: false, // 1
  }
}

search(searchKeyword) {
  const searchResult = store.search(searchKeyword)
  this.setState({
    searchResult,
    submitted: true, // 2
  })
}
```

초기값을 false로 설정하고(1) search() 메서드를 호출할때 true로 설정했다(2). 이 상태를 가지고 조건부 렌더링을 하자.

```js
render() {
  return (
    <>
      <header>{/* 생략 */}</header>
      <div className="container">
        <form>{/* 생략 */}</form>
        <div className="content">
          {/* 1 */}
          {this.state.submitted && /* 생략 */}
        </div>
      </div>
    </>
  )
}
```

submitted 상태에 따라 검색 결과 엘리먼트를 보이도록 했다(1).

- ~~💡요구사항: 검색 결과가 검색폼 아래 위치한다. 검색 결과가 없을 경우와 있을 경우를 구분한다.~~

render() 함수를 좀 정리해야겠다. 반환하는 앨리먼트가 늘어나서 좀 읽기 어려워지기 시작했기 때문이다.

```js
render() {
  // 1
  const searchForm = <form>{/* 생략 */}</form>

  // 2
  const searchResult = searchResult.length <= 0 ? /* 생략 */ : /* 생략 */

  return (
    <>
      <header>{/* 생략 */}</header>
      <div className="container">
        {searchForm} {/* 3 */}
        <div className="content">
          {this.state.submitted && searchResult} {/* 4 */}
        </div>
      </div>
   </>
  )
}
```

searchForm과 searchResult 앨리먼트 변수로 각 각 구분지었다(1, 2). 그리고 앨리먼트를 반환할때 변수를 사용해서(3, 4) 코드의 가독성을 높였다.

## 검색결과 초기화

- 💡요구사항: x 버튼을 클릭하면 검색폼이 초기화 되고, 검색 결과가 사라진다.

검색 폼에 타이핑을 시작하면 나타나는 x 버튼을 클릭하면 입력한 검색어를 지우는것 뿐만 아니라 아래 있는 검색 결과도 삭제해야 한다. 검색 결과는 searchResult 상태에 의존하기 때문에 적절한 시점에 빈 배열로 초기화하면 간단하다.

```js
handleReset() {
  this.setState({
    searchKeyword: '',
    searchResult: [],
    submitted: false,
  })
}
```

상태값을 변경한 것이 전부다. 하나씩 생각해보자

1. x 버튼을 클릭하면 onReset 속성에 연결된 handleReset() 핸들러가 실행된다.
1. searchKeyword를 빈 문자열로 설정하면 이를 사용하는 input 엘리먼트의 value가 바뀌고 입력한 문자가 사라진다.
1. searchResult를 빈 배열로 변경하면 여기에 의존하는 검색 결과 리스트가 사라지고
1. submitted 값이 false로 바뀌면서 검색 결과 앨리먼트가 사라질 것이다.

이렇게 상태를 잘만 관리하면 돔 조작없이도 UI를 예측 가능하게 관리할 수 있다.

- ~~💡요구사항: x 버튼을 클릭하면 검색폼이 초기화 되고, 검색 결과가 사라진다.~~

## ⭐중간 정리

검색 폼에 이어 검색 결과 요구사항을 구현했다.

스토어에서 검색한 결과를 배열로 받아 이를 리스트로 렌더링했다. 리액트는 가상돔의 전/후를 비교해서 최소한의 돔 조작을 하면서 성능을 높인다. 문제는 트리 자료구조를 사용하는 가상돔을 비교하는 것은 꽤 무거운 계산이다. 리액트는 이 계산 복잡도를 줄이기 위한 몇가지 제약사항을 두는 데 리스트일 경우 key 속성을 사용하는 것이 한 방법이다. key에 유일한 값을 할당해 이 값의 변화로 가상돔 차이를 계산하겠다는 의도다.

검색결과 초기화도 구현했는데 단순히 state만 조절했다. 모든 UI가 state에 의존하기 때문에 잘 설계된 state만 관리하면 UI를 예측하기 쉽게 제어할 수 있다.

이제 리액트로 사고하는 것이 좀 익숙해졌을지도 모르겠다. 아직 그렇지 않다면 다음 장에 나올 탭 구현하기를 통해 반복하며 익혀보자.

# 탭 구현하기

## 탭 보여주기

- 💡요구사항: 추천 검색어, 최근 검색어 탭이 검색폼 아래 위치한다.

준비편에서 그러했듯이 출력할 탭 정보를 미리 준비하자.

```js
const TabType = {
  KEYWORD: "KEYWORD",
  HISTORY: "HISTORY",
}

const TabLabel = {
  [TabType.KEYWORD]: "추천 검색어",
  [TabType.HISTORY]: "최근 검색어",
}
```

TabType은 탭을 식별하기 위한 고유한 키 역할을 한다. 탭 리스트 형식으로 출력하거나 선택된 탭을 판단하기 위한 역할로 활용될 것이다. 탭 이름은 화면에 표시할 때 사용하는데 키 값과 매칭되는 탭 이름을 TabLabel란 객체로 정의했다.

먼저 탭 리스트 출력을 위한 엘리먼트 변수 tabs를 render() 함수 안에 만들자.

```js
const tabs = (
  <ul className="tabs">
    {/* 1 */}
    {Object.values(TabType).map(tabType => (
      // 2
      <li key={tabType}>{TabLabel[tabType]}</li>
    ))}
  </ul>
)
```

탭 키를 뽑아서 배열을 얻기 위해 Object.values() 함수에 TabType 객체를 인자로 전달했다. 그 결과 ["KEYWORD", "HISTORY"]란 문자열 배열을 얻는데 map() 함수로 하나씩 반복 처리 했다(1). li 엘리먼트를 반환하는데 리스트 렌더링에 필요한 키 값으로 이 문자열을 사용했다. 그리고 li의 자식 엘리먼트에 TabLabel 객체를 이용하여 화면에 출력될 이름을 조회했다(2).

폼을 제출하기 전, 즉 submitted가 false일 경우 탭을 출력하도록 render() 함수의 반환 값을 수정하자.

```js
render() {
  const tabs = <ul>{/* 생략 */}</ul>

  return (
    <>
      <header>
        <h2 className="container">검색</h2>
      </header>
      <div className="container">
        {searchForm}
        <div className="content">
          {this.state.submitted ? searchResult : tabs} {/* 1 */}
        </div>
      </div>
    </>
  )
}
```

&& 연산자로 조건부 렌더링하던 것을 삼항 연산자 사용으로 바꾸었다(1). 이전 장에서는 submitted가 false일 경우 아무것도 보이지 않았지만 이제는 첫 화면 로딩시 검색 폼 아래 두 개의 탭이 보일 것이다.

- ~~💡요구사항: 추천 검색어, 최근 검색어 탭이 검색폼 아래 위치한다.~~

## 기본 탭 설정하기

- 💡요구사항: 기본으로 추천 검색어 탭을 선택한다.

미리 만들어둔 active CSS 클래스를 li 엘리먼트에 추가하면 선택된 UI를 표시할 수 있다. 문제는 어떤 탭에 CSS 클래스를 추가할 것인가 하는 것이다. 상태로 UI를 관리한다는 지금까지의 원칙처럼 선택된 탭을 state로 관리하면 되겠다.

```js
constructor() {
  super()
  this.state = {
    searchKeyword: "",
    searchResult: [],
    submitted: false,
    selectedTab: TabType.KEYWORD, // 1
  }
}
```

selectedTab이란 필드를 state에 추가하고 추천 검색어를 기본값으로 설정했다(1). 이 값을 탭 UI에 연결할 차례다. render() 메서드에 있는 엘리먼트 변수 tabs를 보자.

```js
const tabs = (
  <ul className="tabs">
    {Object.values(TabType).map(tabType => (
      <li
        key={tabType}
        className={this.state.selectedTab === tabType ? "active" : ""} // 1
      >
        {TabLabel[tabType]}
      </li>
    ))}
  </ul>
)
```

JSX에서 CSS 클래스 이름을 동적으로 지정할 때는 삼항 연산자를 사용한다. TabKey로 구성된 배열을 탐색하다가 selectedTab과 일치할 경우 active CSS 클래스를 추가했다(1).

이제 기본으로 "추천 검색어"가 선택되어 보인다.

- ~~💡요구사항: 기본으로 추천 검색어 탭을 선택한다.~~

## 탭 선택하기

- 💡요구사항: 각 탭을 클릭하면 탭 아래 내용이 변경된다.

각 탭을 클릭할 때 selectedTab 상태가 변경되고 이에따라 CSS active 클래스가 li 엘리먼트를 옮겨가는데 이것을 클릭 이벤트에 연결하자.

```js
<li
  key={tabType}
  className={this.state.selectedTab === tabType ? "active" : ""}
  onClick={() => this.setState({ selectedTab: tabType })} // 1
>
  {TabLabel[tabType]}
</li>
```

클릭 이벤트를 수신하기 위해 onClick 속성에 함수를 할당했다. 클릭 이벤트가 발생하면 클릭한 탭을 selectedTab으로 설정한다(1).

선택에 따라 아래에 선택된 탭 이름을 출력해 두자.

```js
const tabs = (
  <>
    <ul className="tabs">{/* 생략 */}</ul>
    {this.state.selectedTab === TabType.KEYWORD && <>{`TODO: 추천 검색어`}</>}
    {this.state.selectedTab === TabType.HISTORY && <>{`TODO: 최근 검색어`}</>}
  </>
)
```

이제 탭을 선택할 때마다 아래 선택한 탭 이름이 노출된다.

- ~~💡요구사항: 각 탭을 클릭하면 탭 아래 내용이 변경된다~~

## ⭐중간 정리

탭 구현은 새로운 내용보다는 이전에 학습했던 내용을 반복하는 내용이다. 어렵지 않게 따라왔을 것이라 믿는다.

혹자는 탭 UI를 만드는데 왜 굳이 TabType이나 TabLabel 만들어 사용했는지 궁금할지도 모르겠다. 항상 같은 모습의 정적인 탭일 경우는 직접 UI에 탭 이름을 표시하면 되겠지만 지금은 선택한 탭을 저장하고 동적으로 표시해야하는 경우다. 선택된 탭을 식별해야 하는데 변경 가능성이 있는 이름보다는 고유한 키를 정의하는 것이 코드 유지보수면에서 더 낫다고 생각한다.

어느덧 사용편의 마지막 단계인 추천/최근 검색어 구현이다.

# 추천/최근 검색어 구현하기

## 추천 검색어 1

추천 검색어 탭이 기본 선택되었고 그 아래 "추천 검색어"라는 텍스트만 있는 상황이다. 이 부분에 대한 구체적인 요구사항을 들여다 보자.

- 💡요구사항: 번호와 추천 검색어 이름이 목록 형태로 탭 아래 위치한다.

번호와 추천 검색어가 리스트 형식으로 보여야 한다. 리스트 렌더링을 위해 상태 변수를 추가해 추천 검색어 목록을 저장하자.

```js
constructor() {
  super()
  this.state = {
    searchKeyword: "",
    searchResult: [],
    submitted: false,
    selectedTab: TabType.KEYWORD,
    keywordList: [], // 1
  }
}
```

추천 검색어 목록을 상태로 관리하기 위해 keywordList 필드를 추가해 빈배열을 기본값으로 설정했다(1).

화면이 로딩되는 중 추천 검색어 데이터를 가져와 이 값을 갱신해야 화면에 리스트를 그릴 수 있을 것이다.

리액트 컴포넌트는 생성부터 소멸까지 일련의 **생명 주기**를 갖는다.

- 컴포넌트 상태 등 초기화 작업을 완료하면 컴포넌트 객체가 생성된다(constructor)
- 그리고 리액트 앨리먼트를 이용해 가상돔을 그리고 이걸 실제 돔에 반영한다(render)
- 돔에 반영되는 것을 마운트된다라고 표현하는데 마운트가 완료되면(componentDidMount) 이벤트를 바인딩하거나 외부 데이터를 가져오는 등의 작업을 수행한다
- 컴포넌트가 사라지기 전에 즉 마운트 직전에는(compoentWillUnmount) 이벤트 핸들러를 제거하는 등 리소스 정리 작업을 한다
- 마지막으로 컴포넌트는 본인의 삶을 마감하는 순서를 따른다

각 시점별로 컴포넌트의 메서드가 호출되는데 괄호안의 함수명을 사용한다.

키워드 목록을 가져오는 작업은 컴포넌트가 돔에 마운트 되었을 시점인 componentDidMount() 메서드에서 기술하면 되겠다.

```js
componentDidMount() {
  const keywordList = store.getKeywordList() // 1
  this.setState({ keywordList }) // 2
}
```

검색 결과처럼 키워드 데이터도 스토어에서 불러 온다(1). 이 데이터를 곧장 컴포넌트 state로 업데이트했다(2).
render() 함수에서 화면을 그릴 차례다. keywrodList 앨리먼트 변수에 리액트 앨리먼트를 정의하자.

```js
// 1
const keywordList = (
  <ul className="list">
    {/* 2 */}
    {this.state.keywordList.map((item, index) => (
      {/* 3 */}
      <li key={item.id}>
        {/* 4 */}
        <span className="number">{index + 1}</span>
        {/* 5 */}
        <span>{item.keyword}</span>
      </li>
    ))}
  </ul>
)
```

앨리먼트 변수 keywordList를 만들어 여기에 리액트 엘리먼트를 담아둔다(1). 상태 변수인 keywordList 배열로 리스트를 렌더링 한다(2). li 엘리먼트의 key는 각 항목을 식별할 수 있는 id를 사용했다(3). 순서를 표시하기 위해 map() 함수의 콜백함수 두번째 인자인 index를 이용해서 1, 2, 3 .. 순서대로 표시했다(4). 마지막으로 키워드 이름을 출력했다(5).

추천 검색어를 선택한 경우 렌더링하는 부분을 keywordList 앨리먼트 변수 값으로 대체하자.

```js
const tabs = (
  <>
    <ul className="tabs">{/* 생략 */}</ul>
    {this.state.selectedTab === TabType.KEYWORD && keywordList} {/* 1 */}
    {this.state.selectedTab === TabType.HISTORY && <>TODO: 최근 검색어</>}
  </>
)
```

텍스트만 표시한 부분을 리스트 엘리먼트로 대체했다. 이제 번호와 키워드 이름으로 구성된 목록이 탭 아래 표시되어 나온다.

- ~~💡요구사항: 번호와 추천 검색어 이름이 목록 형태로 탭 아래 위치한다.~~

## 추천 검색어 2

- 💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어의 검색 결과 화면으로 이동한다.

입력한 검색어를 search() 메서드에 인자로 전달하면 컴포넌트는 검색 결과를 보여준다. 추천 검색어 목록으로 검색하려면 클릭한 추천 검색어를 search() 메서드로 전달하면 된다. 매우 간단하다.

먼저 추천 검색어 리스트 엘리먼트에 클릭 이벤트를 수신하는 코드를 추가한다.

```js
const keywordList = (
  <ul className="list">
    {this.state.keywordList.map((item, index) => (
      <li
        key={item.id}
        onClick={() => this.search(item.keyword)} // 1
      >
      {/* 생략 */}
```

onClick 속성을 이용해 search() 메서드를 호출하는 핸들러를 할당했다(1).

클릭한 추천 검색어를 검색폼에 설정하기 위해 search() 메서드도 조금 수정한다.

```js
search(searchKeyword) {
  const searchResult = store.search(searchKeyword);
  this.setState({
    searchResult,
    submitted: true,
    searchKeyword, // 1
  })
}
```

setState()를 이용해 searchKeyword의 상태를 변경하면 여기에 의존하는 input 앨리먼트의 value도 변경되어 입력창에 선택한 추천 검색어가 보인다.

- ~~💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어의 검색 결과 화면으로 이동한다.~~

## 최근 검색어 1

- 💡요구사항: 최근 검색어, 목록이 탭 아래 위치한다.
- 💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어로 검색 결과 화면으로 이동한다.

추천 검색어 목록과 마찬가지로 최근 검색어 목록도 state로 관리하자.

```js
constructor() {
  super()
  this.state = {
    searchKeyword: "",
    searchResult: [],
    submitted: false,
    selectedTab: TabType.KEYWORD,
    keywordList: [],
    historyList: [], // 1
  }
}
```

historyList 필드를 추가해 빈 배열로 기본값을 설정했다(1). 추천 검색어와 마찬가지로 어디선가 최근 검색어 데이터를 가져와 여기에 저장해 둘 단계가 필요하다. render() 함수에서는 이 상태를 보고 리액트 엘리먼트를 생성할 것이기 때문이다.

```js
componentDidMount() {
  const keywordList = store.getKeywordList()
  const historyList = store.getHistoryList() // 1
  this.setState({
   keywordList,
   historyList, // 2
 })
}
```

돔이 마운트된 직후에 스토어에서 최근 검색어 목록을 가져와(1) 컴포넌트 상태로 갱신한다(2). 이제 이 데이터를 가지고 render() 함수에서 화면을 그릴 차례다. historyList 앨리먼트 변수를 정의한다.

```js
// 1
const historyList = (
  <ul className="list">
    {/* 2 */}
    {this.state.historyList.map(({ id, keyword, date }) => (
      {/* 3 */}
      <li key={id} onClick={() => this.search(keyword)}>
        <span>{keyword}</span>
        {/* 4 */}
        <span className="date">{formatRelativeDate(date)}</span>
        {/* 5 */}
        <button className="btn-remove" />
      </li>
    ))}
  </ul>
)
```

엘리먼트 변수 historyList를 만들고(1) 추천검색어 목록을 그리는 리액트 앨리먼트를 만들었다. State로 저장한 historyList 배열로 리스트를 렌더링 한다(2). 각 리스트에 key를 설정하고 클릭시 검색 결과가 보이도록 search() 메서드를 호출하는 핸들러를 달아 놓았다(3).

추천 검색어 목록과 거의 비슷한 방식으로 그렸다. 다만 좌측에 번호가 없고 우측에 검색 날짜와 검색어 삭제 버튼이 추가된 것이 다른점이다(4, 5).

최근 검색어 탭을 클릭하면 탭 아래 부분에 최근 검색어 목록이 보이도록 하자.

```js
const tabs = (
  <>
    <ul className="tabs">{/* 생략 */}</ul>
    {this.state.selectedTab === TabType.KEYWORD && keywordList}
    {this.state.selectedTab === TabType.HISTORY && historyList} {/* 1 */}
  </>
)
```

기존에 "최신 검색어"라고 임시로 만들어 두었던 부분을 리스트 엘리먼트로 대체했다. 이제 최근 검색어 탭을 클릭하면 검색어 이름과 검색 일자 그리고 삭제 버튼이 있는 리스트가 탭 아래 표시되어 나온다.

- ~~💡요구사항: 최근 검색어, 목록이 탭 아래 위치한다.~~

- ~~💡요구사항: 목록에서 검색어를 클릭하면 선택된 검색어로 검색 결과 화면으로 이동힌다.~~

## 최근 검색어 2

추천 검색어와 달리 최근 검색에는 두 가지 요구사항이 더 있다. 그 중 첫번째 요구사항을 보자.

- 💡요구사항: 목록에서 x 버튼을 클릭하면 선택된 검색어가 목록에서 삭제된다.

최근 검색어 목록에 있는 x 버튼을 클릭하면 목록에서 항목을 제거하는 기능이다. 먼저 x 버튼에 클릭 핸들러 함수를 추가하자.

```js
const historyList = (
  // 생략
    <button
      className="btn-remove"
      onClick={event => this.handleClickRemoveHistory(keyword)} {/* 1 */}
    />
  // 생략
/>
```

x 버튼을 클릭하면 이벤트 객체와 클릭한 검색어를 handleClickRemoveHistory() 메서드로 전달해 히스토리 삭제 처리를 부탁한다.

```js
handleClickRemoveHistory(event, keyword) {
  store.removeHistory(keyword) // 1
  const historyList = store.getHistoryList() // 2
  this.setState({ historyList }) // 3
}
```

스토어에서 해당 키워드를 삭제한 뒤(1) 전체 최근 검색어 목록을 다시 받아와 컴포넌트 상태에 반영했다(2, 3). state에 의존하는 최근 검색어 목록이 갱신되어 선택한 최근 검색어가 목록에서 제거될 것이다.

이벤트 처리에서 유념해야할 것이 있다. 최근 검색어에서 이벤트 처리하는 부분을 다시 보자.

```js
const historyList = (
  // 생략
  <li onClick={() => this.search(keyword)}>
    <button onClick={() => this.handleClickRemoveHistory(keyword)} />
  </li>
  // 생략
)
```

button에서 click 이벤트가 발생하면 handleClickRemoveHistory() 메서드가 호출되는 것은 의도된 행동이다. 하지만 이벤트는 부모인 li 엘리먼트까지 버블링 되어 올라 간다. li 엘리먼트에 연결된 핸들러까지도 실행되는데 이것은 의도한 것이 아니다. 검색어를 삭제하려고 했는데 검색 결과 화면으로 이동할 것이기 때문이다.

이러한 이벤트 버블링 현상을 차단하려면 handleClickRemoveHistory() 메서드에서 이벤트 버블링을 차단해야하는데 이를 위해 이벤트 객체도 핸들러 메서드로 전달하겠다.

```js
handleClickRemoveHistory(event, keyword) {
  event.stopPropagation() // 1
 // 생략
}
```

핸들러 함수에서는 본연의 로직을 수행하기에 앞서 이벤트 객체의 stopPropagation() 함수로 이벤트 전파를 차단했다.

- ~~💡요구사항: 목록에서 x 버튼을 클릭하면 선택된 검색어가 목록에서 삭제된다.~~

## 최근 검색어 3

- 💡요구사항: 검색시마다 최근 검색어 목록에 추가된다

텍스트를 입력해서 검색하거나 추천 검색어 목록을 선택할 때는 최근 검색어 목록에 기록을 추가해야 한다.

검색할 때마다 스토어의 search() 메서드를 호출하는데 이전 편에서 이미 스토어 로직으로 추가해 두었다. 확인만 하고 지나가자.

```js
class Store {
  search(keyword) {
    this.addHistory(keyword) // 1
    return this.storage.productData.filter(product =>
      product.name.includes(keyword)
    )
  }
  addHistory(keyword = "") {
    // 2
    // this.storage.historyData에 keyword를 추가한다
  }
}
```

스토어의 search() 메서드는 addHistory() 메서드를 호출하는데(1) 내부에서 관리하는 스토리지에 데이터를 기록한다(2). 컴포넌트에서는 검색 후에 변경된 historyData를 불러와 state로 갱신하면 되겠다.

```js
search(searchKeyword) {
  const searchResult = store.search(searchKeyword)
  const historyList = store.getHistoryList(); // 1
  this.setState({
    searchKeyword,
    searchResult,
    submitted: true,
    historyList // 2
  })
}
```

스토어에서 검색 결과를 가져온 직후 스토어에 의해 업데이트된 최근 검색어도 가져온다(1). 그리고 state에 업데이트 한다(2).

이제 검색할 때마다 최근 검색어도 스토어게 기록되고 이 데이터는 컴포넌트 상태로 반영되어 화면에 보여지게 될 것이다.

- ~~💡요구사항: 검색시마다 최근 검색어 목록에 추가된다~~

## ⭐중간 정리

탭 아래 위치한 추천 검색어 목록과 최근 검색어 목록을 구현했다. 외부 데이터와 연결된 UI를 관리하기 위해 컴포넌트 생명 주기에 대해 알아 보았다. 컴포넌트가 돔에 마운트되었을 때 실행되는 componentDidMount() 메서드에서 데이터를 가져오는 로직을 추가해 리스트 렌더링까지 연결했다.

추천/최근 검색어 구현은 크게 보면 거의 비슷한 순서다. 스토어에서 데이터를 가져오고 이를 컴포넌트 state로 저장해 UI를 그린다. 스토어 데이터는 컴포넌트와 분리되어 있는 반면, 컴포넌트의 state는 UI와 밀접하게 연결되어 있기 때문에 스토어 데이터를 state로 불러왔다.

이전 순수 자바스크립트의 모델과 지금의 모델을 비교해 보자. 전자는 스토리지 데이터 뿐만 아니라 어플리케이션 상태를 나타내는 데이터도 모델이 관리했었다. selectedTab, searchKeyword, searchResult 같은 변수들이 그렇다. 한편 후자의 모델은 스토리지 데이터만 다룬다. 어플리케이션 상태를 담고 있는 역할은 컴포넌트로 옮겨왔다. 정확히는 컴포넌트의 state로 말이다.

리액트의 state로 UI 상태를 관리하고 이를 기반으로 리액트 엘리먼트를 만듦으로서 데이터와 UI가 서로 연결되게 하는 것이다. 소개편에서 언급한 리액티브라는 것이 이를 두고 하는 표현이었다. 상태를 변경하는 것만으로도 연결된 UI에게까지 변화를 파생시킬수 있는 것은 선언적인 UI 코드를 사용해서 읽기 쉽게 만드는 비법이 되는 것이다.

# 🌟최종정리

사용편에서는 본격적으로 리액트를 이용해서 검색 화면을 만들어 보았다.

검색폼 구현에서 input 엘리먼트의 상태 관리를 브라우져가 아닌 리액트가 다루도록 하기 위해 Component 클래스를 사용했다. 컴포넌트 state에 의해 입력 값이 제어되는 input을 제어 컴포넌트라고 한다.

검색 결과와 탭 구현부터는 리스트 렌더링을 사용했다. 리액트는 돔 접근을 최소화 함으로써 성능을 올리기 위해 가상돔을 사용하는데 가상돔의 재조정 알고리즘이 성능을 좌우한다. 이를 위해 리스트 엘리먼트에 key라는 유일한 식별값을 전달해 리액트가 빠르게 변경점을 찾도록 했다.

추천/최근 검색어 구현에서는 초기화한 state의 값을 외부에서 불러오는 방법을 다루었다. 컴포넌트 생명주기 중 돔에 마운트된 직후에 호출되는 componentDidMount() 메서드에서 데이터를 불러와 UI에 반영했다.

순수 자바스크립트로 구현한 소개편과 지금의 구현 결과를 비교해 보자.
전자의 모델과 뷰는 서로 독립적으로 각자의 역할을 수행한다. 모델은 모든 데이터를 관리하고 뷰는 돔과 밀접하게 움직이면서 화면을 그린다. 컨트롤러는 이 둘을 관리하면서 어플리케이션 상태와 이에 따를 UI를 수시로 변화시킨다.

한편 리액트로 구현한 후자는 어떤가? 모델은 스토리지만 갖고 있고 다른 어플리케이션 상태는 컴포넌트로 위임한다. 컴포넌트의 state로 관리되는 상태는 render() 함수가 반환하는 리액트 엘리먼트와 유기적으로 연결되어 화면에 출력된다. 즉 state의 변화가 UI까지 자동으로 영향을 끼치는 것이다.

어플리케이션 상태가 변할 때마다 수시로 돔을 조작했던 뷰와 달리 리액트는 돔 앞단에 가상돔 계층을 추가해 가상돔을 수정하게끔 한다. 수시로 변경 요청을 받은 가상돔은 최소한의 돔 API만을 사용해 화면을 효율적으로 렌더링한다.

이번 편에서는 리액트를 사용해 리액티브 프로그래밍과 가상돔을 이용한 성능 개선 방법에 대해 알아 보았다.

이제 리액트의 강력한 추상화 개념인 **컴포넌트**가 남았다. 다음 편은 컴포넌트를 이용해서 결과물을 다시 만들어 보는 내용을 다루겠다.
