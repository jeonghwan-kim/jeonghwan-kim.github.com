---
slug: "/2022/05/31/react-ref"
title: "리액트 Ref"
date: 2022-05-31
layout: post
tags:
  - react
featuredImage: wash-car.jpg
---

![출처: unsplash.com](./wash-car.jpg)

컴포넌트 상태와 프롭에 따라 리액트 엘리먼트를 동기화하는 것이 리액트로 UI 개발하는 기본 방향이다.
대부분 경우 이 구조로 개발하는 것이 엘리먼트를 직접 다루는 방법보다 더 낫다.
돔을 직접 수정하다보면 자칫 장황한 코드가 될 여기가 많기 때문이다.

그럼에도 불구하고 돔에 직접 접근할 수 밖에 없는 상황이 생긴다.
리액트는 이런 경우에 대비해 ref라는 특별한 객체를 제공한다.

특별한 기능인만큼 그동안 잘 사용해 보지 않았다.
몰랐을 때는 document.querySelector() 를 사용해서 직접 엘리먼트를 찾기도 했다.
아주 가끔 사용해 봤는데 그 때마다 사용법이 일관되지 않은 것 같았다.
crateRef, useRef, 콜백 ref, 문자열 ref.
사용하다보니 이런 용어가 머릿속에 정리되지 않은채 남아있다.

이 글에서는 머릿속에 아무렇게나 둥둥 떠다니는 ref 용어의 개념을 정리하고 올바로 사용하는 방법을 알아보겠다.

# 언제 사용하는가?

리액트 컴포넌트로 UI를 만드는 것은 선언적이다.
상태을 정의하고 이것을 UI에 반영.
말하자면 이런 코드다.

```jsx
const MyComponent extends React.Component {
  state = {value: true}

  render() {
    return (
      <div>value: {value}</div>
    )
  }
}
```

한편 버튼을 포커싱하면?
어떤 상태를 두어야 앨리먼트를 포커싱할 수 있을까?
앨리먼트에 focused 같은 속성이 있는 것도 아닌데 선언적으로 프로그래밍한다는 것이 가능할까?
앨리먼트의 focus() 함수를 직접 호출해야 하는데 마땅히 방법이 떠오르지 않는다.

Ref는 이렇게 선언적으로 문제를 해결할 수 없을 경우 찾을 수 있는 후보다.
이런 경우에 사용할 수 있다. (참고: [Ref를 사용해야 할 때](https://ko.reactjs.org/docs/refs-and-the-dom.html#when-to-use-refs))

- 포커스, 텍스트 선택영역, 미디어 재생 관리
- 애니메이션 직접 실행
- 써드 파트 DOM 라이브러리 사용

# ref 객체 만들기

ref는 current 속성을 가지는 객체다.
직접 만들어도 되지만 ({current: null}로 생성해도 되는 것 같다) 리액트 API를 사용하지 않을 이유가 없다.

React.createRef() 함수를 호출하면 ref 객체를 얻을 수 있다.
이 객체를 리액트 앨리먼트의 ref 속성에 전달하면 돔을 직접 제어할 수 있다.

```jsx{2-3,6-7,11-14}
class MyComponent extends React.Component {
  // ref 객체를 클래스 멤버 변수에 저장해 둔다.
  this.divRef = React.createRef();

  render() {
    // this.ref로 리액트 엘리먼트를 가리킨다.
    return <div ref={this.divRef}>;
  }

  componentDidMount() {
    // ref 객체의 current 속성에 돔 엘리먼트가 저장된다.
    const divElement = thir.divRef.current;
    // DOM api를 사용할 수 있다.
    divElement.style.backgroundColor = 'red';
  }
}
```

컴포넌트 생성시 divRef에 ref 객체를 만들었다.
이 객체를 render 메서드에서 반환한 리액트 앨리먼트의 ref 속성에 전달했다.
이렇게만 해주면 리액트는 이 객체에 div 앨리먼트를 할당해 줄 것이다.

컴포넌트가 마운트되면 그 앨리먼트는 ref 객체의 current 속성을 통해 접근할 수 있다.
여기서는 스타일을 직접 변경하는 코드다.

# 앨리먼트 접근하기

이처럼 ref는 current 필드를 통해 값에 접근할 수 있다.
그러나 이 값이 항상 존재하는 것은 아니다.
createRef()로 만든 current 객체는 이런 모양이다.

```js
{
  current: null
}
```

초기값 null이 언제 앨리먼트로 채워진 것일까?
우리는 리액트 앨리먼트에 ref 속성에 객체만 전달했을 뿐이다.
리액트가 특정 시점에 뭔가 작업한 것 같다.

라이프사이클 메소드마다 로깅해보자.

```jsx{5,9,14}
class MyComponent extends React.Component {
  divRef = React.createRef();

  constructor() {
    console.log(this.divRef); // {current: null}
  }

  render() {
    console.log(this.divRef)// {current: null}
    return <div ref={this.divRef}>
  }

  componentDidMount() {
    console.log(this.divRef) // {current: div}
  }
}
```

컴포넌트가 생성될 때는 아직 null 이다.
리액트 앨리먼트를 반환할 때도 여전히 값은 null.
그러다가 돔에 마운트된 이후에는 div 앨리먼트로 채워졌다.
이후에 콜백 ref의 특성처럼 componentDidMount나 componentDidUpdate 메소드를 실행하기 전에 값이 채워지는 것 같다.

이 값은 노드 유형에 따라 다르다.
이 예제처럼 앨리먼트의 ref 속성에 전달하면 돔 앨리먼트가 저장된다.
컴포넌트의 ref속성에 전달하면 인스턴스 값을 저장할 것이다.

```jsx{9,16-17}
class MyComponent extedns React.Component {
  divRef = React.createRef();
  fooRef = React.createRef();

  render() {
    return (
      <>
        <div ref={this.divRef} />
        <Foo ref={this.fooRef} />
      <>
    )
  }

  componentDidMount() {
    console.log(this.difRef); // {current: div}
    console.log(this.fooRef); // {current: {...}}
    console.log(this.fooRef instanceof Foo); // true
  }
}
```

참고로 함수 컴포넌트는 인스턴스가 없기 때문에 ref 속성을 사용할 수 없다.

# 함수 컴포넌트에서 사용

표현에 미묘한 차이가 있다.
함수 컴포넌트는 인스턴스가 없기 때문에 ref 속성을 사용해 전달할 수 없는 것은 방금까지 확인한 사실이다.
한편 함수 컴포넌트 안에서 반환하는 리액트 앨리먼트에 ref를 사용하려면 어떻게 할까?

여기서 내가 그동안 리액트 api를 잘못사용한 부분이다.
함수 본체에서도 createRef를 호출한 점이다.

이것은 렌더 메소드 안에서 createRef를 사용한 것과 같다.
함수가 리액트 앨리먼트 반환할 때마다 ref 객체도 다시 만들 것이다.
매번 생성된 ref 객체의 current에는 컴포넌트 생애 주기 동안 유지되어야할 값이 매번 초기화되는 부작용이 생긴다.

지금까지 운좋게 잘 동작하기는 했지만 잘못 사용하고 있었다.
언젠가는 문제가 생길 것이고 원인을 찾기 어려웠을 것이다.

함수 컴포넌트는 렌더함수라 생각하고 접근해야 하는 것 같다.
함수 본체는 언제든지 호출될 수 있기 때문에 어떤 값을 유지하기 위해서는 특별히 신경써서 코딩해야한다.

리액트 훅에는 [useRef](https://ko.reactjs.org/docs/hooks-reference.html#useref)가 있는데 이것이 바로 함수 컴포넌트에서 ref 객체를 다루는 방법이다.

useRef는 전달된 인자로 ref 객체를 만들어 반환한다.
반환된 객체는 컴포넌트 전 생애주기 동안 유지될 것이다.

다시 사용한다면 이렇게 될 것이다.

```jsx{2-3}
const MyComponet = () => {
  // 처음에만 {current: null} 이후 이 객체는 유지될 것이다.
  const divRef = React.useRef(null)

  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.style.background = "red"
    }
  }, [])

  return <div ref={divRef} />
}
```

# 결론

자동 세차장을 이용하는 편이다.
차 안으로 물이 들어오지 않게 창문을 닫고 중립 기어만 놓으면 기계가 알아서 차를 닦아 준다.
기계 밖으로 나온 뒤에 햇살에 비추어 보면 군데군데 얼룩이 남아있다.
휠 안쪽, 라이에이터 그릴 사이, 번호판 숫자.
이런 부분은 걸레를 들고 손수 닦을 수 밖에 없다.

선언적 방식으로 코딩하면 신속하게 UI를 만들어 낼수 있다.
하지만 자동 포커스, 애니매이션 같은 디테일이 필요한 것은 직접 엘리먼트에 접근할수 밖에 없다.
직접 돔을 다루어야한다.
이런 과정을 거처야 비로소 쓸만한 어플리케이션을 만들 수 있는 것 같다.
완벽하게 세차한 뒤 반짝이는 차를 보면서 만족하는 것 처럼 디테일을 챙겨만든 제품을 사용할 때 개발자로서 뿌듯함을 느낀다.

## 참고

- [샘플코드](https://github.com/jeonghwan-kim/psot-react-ref)
- [Ref와 DOM | 리액트 고급 안내서](https://ko.reactjs.org/docs/refs-and-the-dom.html)
- [Hook API 참고서 | 리액트 HOOK](https://ko.reactjs.org/docs/hooks-reference.html#useref)
