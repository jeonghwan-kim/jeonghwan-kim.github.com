---
title: "styled-component로 리액트 컴포넌트 만들기"
layout: post
category: dev
tags: [react]
---

이번에 스타일드 컴포넌츠([styled-components](https://styled-components.com))를 사용해 보고 기존 방식과의 차이점, 그리고 왜 이것이 더 나은지를 정리해 보고자 한다.

# 기존 방식의 문제점

기존에는 사스(sass)를 사용해서 스타일 요소를 관리했다.
리액트 컴포넌트로 예를 들자면 컴포넌트 이름과 동일한 CSS 클래스네임을 정의해서 컴포넌트의 클래스명으로 지정하는 방식이다.
이렇게 두 개의 파일 button.tsx, button.scss을 같은 폴더에서 관리하면 얼핏 괜찮은 구조라고 생각할 수 있는데 이게 그렇지가 않았다.

먼저는 컴포넌트 규모에 따라 사스 코드의 양이 변경되는데 서로 문법적으로 연결되어 있지 않는 것이 문제다.
가령 CSS 클래스만 변경하고 컴포넌트 코드를 고치지 않더라도 빌드는 성공한다.
변경된 스타일이 컴포넌트에 적용되지 않더라도 모를 수 있는 여지가 있다는 것이다.

CSS 클래스 이름이 충돌할 가능성도 있다.
규칙을 정해 유일한 이름을 사용하면 되지만 범용적인 이름을 사용하는 경우도 이따금 발생한다.
가령 ".header" 클래스가 그러한데, 서비스 전체의 헤더, 혹은 컴포넌트의 헤더를 지칭하는 경우에 쓰인다.
같은 이름의 클래스 이름을 사용하는 순간 CSS 중첩 구조에 따라 정의한 순서대로 영향을 받게된다.

사스만의 특별한 현상도 있는데 노드 버전에 의존적이라는 것이다.
노드 주 버전을 올리면 항상 사스의 버전도 올려야하기 때문에 처음 이런 문제에 부딪히면 적잖게 당황한다.

- 관련글: https://jeonghwan-kim.github.io/dev/2020/06/27/node-sass.html

이 외에도 문서에서 나열한 걸 보면 대부분 공감가는 문제들이다. (https://styled-components.com/docs/basics#motivation)

- 클래스 이름 버그 (No class name bugs)
- CSS를 삭제하기 쉽다 (Easier deletion of CSS)
- 동적 스타일링이 간단하다 (Simple dynamic styling)
- 유지보수가 쉽다 (Painless maintenance)
- 벤더 프리픽스를 자동으로 붙여준다 (Automatic vendor prefixing)

# 기본원리

스타일드 컴포넌츠는 리액트 컴포넌트를 생성한다.
스타일드 컴포넌트로 버튼 컴포넌트를 만들어 보자.

```js
const StyledButton = styled.button`
  background-color: blue;
`
```

이렇게 만든 컴포넌트를 사용하면 라이브러리가 만들어 놓은 CSS 클래스와 이를 사용한 코드를 확인할 수 있다.

```html
<style>
  .hswyuV {
    background-color: blue;
  }
</style>
<body>
  <button class="hswyuV">Blue Button</button>
</button>
```

이렇게 랜덤한 방식으로 클래스 이름을 사용하기 때문에 클래스명 출동 문제를 줄일수 있다.
(완전히 없앨수 있는 것인지는 모르겠다. 랜덤도 중복 될 수 있으니깐)

사스나 CSS를 사용해서 UI를 개발할 때 동적으로 스타일을 조절하려면 서로 다른 스타일의 CSS 클래스명을 자바스크립트로 바꿔주는 방식을 사용했다.
스타일드 컴포넌트는 자바스크립트로 만들기 때문에 직접 변수로 제어할 수 있다.
리액트 컴포넌트인만큼 프롭스로 값을 받는다.

```tsx
const StyledButton = styled.button<{ color?: string }>`
  background-color: ${props => props.color || "blue"};
`
```

이전에 사스를 사용했을 때을 떠올려 보면 이러한 방식이 얼마나 유용한지 모른다.

# 사용하는 방식: Tagged Template Literal

눈에 띄는 것이 styled 함수의 사용 방식이다.
이것은 일반적인 함수 호출이 아니다.
템플릿 문자열과 결합한 함수 호출인데 이것을 "Tagged Template Liternal" 이라고 한다.

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals

- 템플릿 리터럴의 발전된 형태

간단하게 심볼 뒤에 백틱을 이용해 함수로 호출할 수 있다.
빈 문자열을 인자로 전달한 함수 호출과 같은 모습이다.

```js
function foo() {
  console.log("invoked", arguments, arguments.length)
}

foo`` // "invoked", {0: [""]}, 1
```

빈 문자열을 전달한 셈이니 길이가 있는 문자열도 예상대로 동작한다.

```js
foo`hello` // invoked, {0: ["hello"]}, 1
```

템플릿 문자열은 문자열과 변수를 합해 문자열을 만드는데 이게 좀 재밌게 동작한다.

```js
const name = "world"
foo`hello ${name}` // invoked, {0: ["hello ", ""], 1: "world"}, 2
```

첫번째 인자로 문자열 "hello "와 빈문자열이 들어오고, 두 번재 인자로 name 변수 값인 "world"가 넘어온다.

물론 일급 객체인 함수도 전달할 수 있다.

```js
const name = "world"
foo`foo ${name} ${() => "I am alice"}`
// invoded
// {0: ["hello ", ". ", ""], 1: "world", "function greeting(){}}
// 3
```

이런 특성을 이용해서 문자열을 출력하는 foo 함수 본체를 만들어 보자.

```js
function foo() {
  const result = arguments[0].reduce((acc, str, idx) => {
    const arg = arguments[idx + 1]
    if (str) {
      acc += `${str}${typeof arg === "function" ? arg() : arg || ""}`
    }
    return acc
  }, "")

  console.log(result)
}

foo`Hello ${name}.` // "Hello world."
foo`Hello ${name}. ${greeting}` // Hello world. I am Alice"
```

여기에 css 문자열을 전달해 보자.

```js
foo`backgorund-color: ${() => "blue"};` // background-color: blue;
```

이제 버튼 예제를 다시 떠올려 보자.
배경색에 함수값을 전달해서 사용한다.

```js
const StyledButton = styled.button<{color?: string}>`
  background-color: ${props => props.color || 'blue'};
`
```

방금 만든 foo() 함수와 비슷하지 않은가?
리액트 컴포넌트이기 때문에 props 인자를 전달하는 것 말고는 똑같다.

# 주요 api

자주 사용했던 api만 좀 추려보면 이렇다.

**styled()``**

기본 팩토리 함수다. 스타일 입힐 컴포넌트를 인자로 전달하고 스타일 정의 문자열을 템플릿 문자열로 전달해서 함수를 호출한다.

**styled.div**

styled(div)의 약어다. html 요소별로 메소드가 있다. styled.button, styled.h1, style.input, style.div ...

**createGlobalStyle()**

styled() 함수로 정의한 컴포넌트에는 CSS 클래스명 충돌을 예방할 목적으로 랜덤으로 생성한 클래스 이름이 붙는다.
어플리케이션 전반에 적용할 스타일을 지정할 수 있어야하는데 crateBlobalStyle()이 그 열할 을 한다.
나는 `<GlobalStyle>` 컴포넌트을 하나 만들어 어플리케이션 최상이 컴포넌트에서 사용했다.

```js
const Layout: FC = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      {childrend}
    </>
  )
}
```

**css()**

컴포넌트가 아니라 스타일 정의만 하는 유틸리티인데 템플릿 문자열을 반환한다.
이건 컴포넌트 간에 공통으로 사용할 스타일을 정의하고 가져다 쓸때 사용했다.

```js
export const container = css`...`

export const containerSm = css`
  ${container};
  max-width: 1000px;
`

export const Container = styled.div<{ small?: boolean }>`
  ${props => (props.small ? containerSm : container)}
`

```

# 정리

기존에 사스로 만들었던 코드를 스타일드 컴포넌츠로 모두 대체했다.
물론 이것이 사스트의 모든 기능을 지원하는 것은 아니다.
darken(), lighten() 는 색상을 정할때 자주 사용했었는데 이런건 스타일드 컴포넌츠에서 지원하질 않는다.
그렇다고 대안이 없는 것은 아니다.
[polish](https://github.com/styled-components/polished)라는 유틸리티의 도움을 받아 사용할 수 있었다.
스타일드 컴포넌트 계정에서 관리하는 라이브러리다.

스타일드 컴포넌트가 공식문서에서 말하는 모티베이션에 정말 효과가 있는 방법일까?
사용하지 않은 스타일 코드는 비교적 쉽게 관리할수 있을 것 같다.
이전에는 CSS 클래스 이름을 찾아서 일일이 지웠는데 이제는 심볼로 관리할수 있기 때문이다.

이름 충돌 문제도 발생하지 않을 것 같다.
이전에 뷰(vue.js) 단일 파일 컴포넌트 구성요소에도 비슷한게 있었다.
컴포넌트 안에 스타일을 정의하는 영역이 별도로 있는데 scope 속성을 추가할 수 있다.
스타일드 컴포넌츠와 유사하게 CSS 클래스 이름을 랜덤으로 생성해 다른 이름과 충돌하지 않도록 예방하는 기능이다.
그 때는 이게 너무 오버스펙 아닌가라는 생각을 했는데 몇차례 이름충돌 문제를 겪고보니 이제는 필수로 해야할 것 같다.

스타일드 컴포넌트를 좀 더 사용해 보면서 문서에서 말하는 문제들을 정말로 해결할 지는 운영하면서 지켜볼 일이다.

참고

- 소스코드: https://codesandbox.io/s/post-styled-components-qieqm
