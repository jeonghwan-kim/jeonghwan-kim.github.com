---
title: "styled-component로 리액트 컴포넌트 만들기"
layout: post
category: dev
tags: [react]
---

이번에 스타일드 컴포넌츠(styled-components) 를 사용해 보고 기존 방식과의 차이점 그리고 왜 이것이 더 나은지를 정리해 보고자 한다.

# 기존 방식의 문제점

기존에는 사스(sass)를 사용해서 스타일 요소를 관리했다.
리액트 컴포넌트로 예를 들자면 컴포넌트 이름과 동일한 CSS 클래스네임을 정의해서 컴포넌트의 클래스명으로 지정하는 방식이다.
이렇게 두개의 파일 button.tsx, button.scss을 동일한 폴더에 위치하면 짐짓 괜찮은 구조라고 생각할 수 있는데 이게 그렇지가 않았다.

예를 들어 컴포넌트 규모에 따라 사스 코드의 규모도 늘어나거나 줄어든다.
컴포넌트와 사스코드가 문법적으로 연결되어 있지 않는 것이 문제다.
가령 클래스 이름이 다르더라도 빌드는 성공한다.
결국 변경된 스타일이 컴포넌트에 적용되지 않아도 모를수 있는 여지가 있는 것이다.

클래스 이름과 관련해서는 이름 충돌의 가능성도 있다.
유일한 이름을 사용하면 된다지만 범용적인 이름을 사용하는 경우는 빈번히 발생한다.
.header 클래스가 그러한다.
서비스 전체의 헤더를 가리키는 경우도 있고 컴포넌트의 헤더 부분을 나타내는 경우도 있다.
CSS 중첩 구조에 따라 동일한 이름의 클래스 이름을 사용하면 스타일을 정의한 순서대로 영향을 받는다.

이것은 사스를 사용하면서 발생하는 이슈인데 노드 버전에 의존적이라는 것이다.
노드 주 버전을 올리면 항상 사스의 버전도 올려야하기 때문에 처음 이런 문제에 부딪히면 적잖게 당황한다.

- https://jeonghwan-kim.github.io/dev/2020/06/27/node-sass.html

이 외에도 문서에서 나열한 걸 보면 대부분 공감가는 문제들이다. (https://styled-components.com/docs/basics#motivation)

- 자동화된 크리티컬 패스 (Automatic critical CSS) ? 크리티컬 패스?
- 클래스 이름 버그 (No class name bugs)
- CSS를 삭제하기 쉽다 (Easier deletion of CSS)
- 동적 스타일링이 간단하다 (Simple dynamic styling)
- 유지보수가 쉽다 (Painless maintenance)
- 벤더 프리픽스를 자동으로 붙여준다 (Automatic vendor prefixing)

# 기본원리

스타일드 컴포넌트는 리액트 컴포넌트다.
가령 버튼 컴포넌트를 만들려명 간단히 팩토리 함수를 호출하면 된다.

```js
const StyledButton = styled.button`
  background-color: blue;
`
```

이렇게 만든 컴포넌트를 들여다 보면 라이브러리가 만들어 놓은 css 클래스명을 확인할 수 있다.

![캡쳐]()

이런 방식으로 클래스 이름을 사용하기 때문에 클래스명 출동 문제가 발생할 수 없다.

동적으로 스타일을 조절할수도 있다.
리액트 컴포넌트이기 때문에 프롭스로 값을 받을 수 있겠다.

```js
const StyledButton = styled.button<{color?: string>`
  background-color: ${props => props.color || ‘blue’};
`
```

스타일드 컴포넌트를 만드는 코드는 여전히 자바스크립트 안에 위치하기 때문에 자바스크립트 변수를 바로 가져다 사용할 수 있는 것이다.
이전에 사스를 사용했을 때을 떠올려 보면 이러한 방식이 얼마나 유익한지 수 있을 것이다.

# 사용하는 방식: Tagged Template Literal

눈에 띄는 것이 styled 함수의 사용 방식이다.
일반적인 함수 호출이 아니다.
템플릿 문자열과 결합한 함수 호출인데 이것을 “Tagged Template Liternal” 이라고 한다.

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals

- 템플릿 리터럴의 발전된 형태

간단하게 심볼 뒤에 백틱을 이용해 함수로 호출할 수 있다.

```js
function foo() {
console.log(‘invoked’, arguments, arguments.length) // “invoked”, …., 0
}

foo`` // foo()
```

길이가 있는 문자열을 전달하면 어떨가?

```js
foo`hello` // invoked, hello, 1
```

템플릿 문자열은 변수 인자를 넣을 수 있다.

```js
const name = world’
foo`hello ${name}` // invoked, hello, 2?
```

물론 일급 객체인 함수도 인자로 절달할 수 잇다.

```js
const name=’world’
const greeting = () => ‘I’am alice”
foo`foo ${name} ${() => ‘I’am alice}`` // invoded, hello…..? 3?
```

Tagged Template Liternal의 이런 특성을 유심히 보고 있으면 스타일드 컴포넌트의 동작을 가늠할 수 있다.
버튼 예제를 떠올려 보자.
배경색에 함수값을 전달해서 사용한다.
이게 되려면 스타일드 컴포넌트 함수에서는 인자로 받은 값중에 함수를 적절히 처리할 수 있어야할 것이다.

```js
const StyledButton = styled.button<{color?: string> `background-color: ${props => props.color || ‘blue’};`
```

아마도 이런 코드가 아닌까?

```js
styled.button<T> = (str: string, func: () => void) {
return StyledButton: FC<T> = ({color, children})=> {

    // todo:
    const style: CSSStyleProperty = str과 func()의 조화

    return <button style={style}>{childrend}</button>

}
}
```

확인해보니 거의 유사하다.
// todo: 확인 필요

# 주요 api

자주 사용했던 api만 좀 추려보면 이렇다.

styled()``

기본 팩토리 함수다. 스타일을 입힐 컴포넌트를 인자로 전달하고 스타일 정의 문자열을 템플릿 문자열로 전달해서 함수를 호출한다.

styled.div …

styled(div)의 약어다. html 요소별로 메소드가 있다. styled.button, styled.h1, style.input, style.div

createGlobalStyle()

styled() 함수로 정의한 컴포넌트에는 css 클래스명 충돌을 예방할 목적으로 랜덤으로 생성한 클래스 이름이 붙는다. 어플리케이션 전반에 적용할 스타일을 지정할 수 있어야하는데 crateBlobalStyle()이 그 열할 을 한다. 나는 <GlobalStyle> 컴포넌트을 하나 만들어 어플리케이션 최상이 컴포넌트에서 사용했다.

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

css()

컴포넌트가 아니라 스타일 정의만 하는 함수인데 CSSPropperty 타입을 반환한다.
// 확인 필요

이건 컴포넌트 간에 공통으로 사용할 스타일을 정의하고 가져다 쓸때 사용했다.

```js
const normalize = css()

const <Normalize />
```

css props

css 함수와 다르게 css 속성도 사용할 수 있다. 리액트 컴포넌트의 style 속성과 유사한데 이런 차이가 있다.

// todo 차이점을 찾아라

// todo css가 이런 점에서 더 사용하기 편했다.

# 정리

기존에 사스로 만들었던 코드를 스타일드 컴포넌트로 모두 대체했다. 물로 이것이 사스트의 모든 기능을 지원하는 것은 아니다. darken(), lighten() 는 색상을 정할때 자주 사용했었는데 이런건 스타일드 컴포넌트에서 지원하질 않는다. 그렇다고 대안이 없는 것은 아니다. polish라는 유틸리티의 도움을 받아 사용할 수 있었다.

공식문서에서 말하는 모티베이션이 정말 효과가 있을까? 사용하지 않은 스타일 정의는 수월하게 관리할수 있을 것 같다. 이전에는 css 클래스이름을 찾아서 일일이 지웠는데 이제는 심볼로 관리할수 있기 때문이다.

이름 충돌 문제도 발생하지 않을 것 같다. 이전에 뷰(vue.js) 단일 파일 컴포넌트 구성요소에도 비슷한게 있었다. 컴포넌트 안에 스타일을 정의하는 영역이 별도로 있었는데 scope 속성을 추가하면 스타일드 컴포넌트와 유사하게 css 클래스 이름을 랜덤으로 생성해서 다른 이름과 충돌하지 않도록 하는 기능이 있었다. 그때는 이게 너무 오버스펙 아닌가라는 생각을 했는데 수차레 이름충돌 문제를 겪고보니 이제는 필수로 해야할 것 같다.

좀 더 사용해 보면서 문서에서 말하는 문제들을 정말로 해결할 지는 운영하면서 지켜볼 일이다.

참고

- 소스코드: https://codesandbox.io/s/post-styled-components-qieqm
