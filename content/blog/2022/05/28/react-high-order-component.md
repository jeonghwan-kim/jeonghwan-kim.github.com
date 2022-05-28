---
slug: "/2022/05/28/react-high-order-component"
date: 2022-05-28
title: "리액트 고차 컴포넌트(HOC)"
layout: post
tags:
  - react
---

훅을 주로 사용하는 지금에 비해 비교적 철지난 주제인 것 같다.
클래스 컴포넌트를 주로 사용할 때 컴포넌트 로직을 재사용하기 위한 방법으로 고차 컴포넌트(High Order Component)를 사용한다.

써드 파티 라이브러리에서도 적극적으로 고차 컴포넌트 형태의 API 제공했다.
리액트 라우터는 withRouter 함수를 통해 컴포넌트에 라우터의 일부 기능을 추가했다.
리액트 리덕스는 connect 함수를 통해 전역 스토어에 접근하고 스토어에 액션도 발행할 수 있는 기능을 추가했다.

이렇게 고차 컴포넌트는 기존 컴포넌트에 컴포넌트 고유의 기능과는 다른 어떤 기능을 추가해서 강화된(Enhanced) 컴포넌트를 만들수 있는 마법 같은 도구이다. 이 글에 고차 컴포넌트가 해결하려는 문제를 알아고고 사용하는 방법과 유의점을 정리해보자.

# 횡단 관심사 분리

고차 컴포넌트는 횡단 관심사를 분리하는데 사용한다고 표현한다.

> 횡단 관심사(Cross-Cutting Concerns)에 고차 컴포넌트 사용하기 - [고차 컴포넌트 | 리액트 공식문서](https://ko.reactjs.org/docs/higher-order-components.html)

횡단 관심사란 뭘까? 반대말은 종단 관심사 일까?
원문으로는 Cross-Cutting concern이라고 한다.

> crosscut: <물건을> 가로지라다; <장소 등을> 횡단하다. - 출처: 뉴에이스 영한사전

어떤 것을 가로지르는 관심사라는 것이다.

소프트웨어는 계층 구조로 구성하는 것이 일반적이다. 대표적인것이 OSI 7 계층이다.
API 서버 어플리케이션을 만들때도 API 컨트롤러 - 서비스 - 레포지터리 같은 계층을 둔다.
리액트로 클라이언트 어플리케이션을 만들 때도 계층을 구성한다.

```jsx
<App>
  <Router>
    <Container>
      <Page>
```

- 전체 어플리케이션을 담당하는것이 App 컴포넌트다.
- 요청 주소에 따라 컴포넌트를 렌더링 하는 것이 Router 컴포넌트다.
- 전역 저장소에서 필요한 데이터를 가져고 뮤테이션을 담당하는 것이 컨테이너다.
- UI를 렌더링하는것이 Page 컴포넌트다.

이처럼 어플리케이션은 계층을 이루지만 각 계층의 기능을 완벽하게 분리해서 코드의 중복을 막을 수는 없다.
Container 컴포넌트에서 주소 파라매터 정보를 가질수 있다.
Page 컴포넌트에서는 네이게이션 이동 기능을 가질 수도 있다.

이처럼 각 계층을 넘어서서 공통적으로 필요한 관심하가 있는데 이것을 횡단 관심사, Cross-Cutting concerns라고 표현한다.
어떤 대화에서는 "공통 관심사"라고도 표현하기도 한다. (참고: [이번에는 AOP 용어의 우리말 표현을 가지고 나눠봐요](https://groups.google.com/g/ksug/c/GI7MQklFt8A/m/Dukz90JBgbQJ))

그림으로 보면 좀 더 쉽게 이해된다.

![그림으로 보면 좀 더 쉽게 이해된다.](./cross-cutting-concerns-images.png)

정리하면 횡단 관심사란 어플리케이션의 각 계층에서 공통적으로 필요한 문제라고 할 수 있겠다. 고차 컴포넌트는 바로 이런 공통의 기능을 해결하는 역할을 한다.

로깅이나 인증이 서버 어플리케이션의 횡단 관심사라면 클라이언트 어플리케이션에서는 뭐가 해당할까? 앞에서 잠깐 언금했던 주소 정보나 전역 스토어가 공통 관심사일 것이다. 상황에 따라서는 클라이언트에서 기록하는 로깅도 이 횡단 관심사이다.

그럼 간단히 클라이언트 로깅을 리액트 고차 컴포넌트로 해결하면서 고차 컴포넌트에 대해 자세히 알아보자.

# 로깅 예제

가정해 보자.
우리는 디자인 시스템을 만들어야한다.
디자인 시스템의 각 컴포넌트는 얼마나 사용되는지 기록을 남기고 모니터링 해야한다.

- 컴포넌트가 마운트 될때마다 기록한다.
- Button 컴포넌트를 클릭할 때마다 기록한다.

먼저 Header 컴포넌트부터 만들어 보자.

```jsx
class Header extends React.Component {
  componentDidMount() {
    // 로깅
    console.log(`[Header] 마운트`)
  }
  render() {
    return <header>Header</header>
  }
}
```

Header가 돔에 마운트도면 양식에 맞추어 로그를 남긴다. 편의상 브라우저에 남기는 것으로 했다.
실제로 만든다면 로깅 api를 사용하거나 해야할 것이다.

이와 비슷하고 Button 컴포넌트도 로깅 기능과 함께 만들어 보자.

```jsx
class Button extends React.Component {
  componentDidMount() {
    // 로깅
    console.log(`[Button] 마운트`)
  }
  handleClick = () => {
    // 로깅
    console.log(`[Button] 클릭`)
  }
  render() {
    return <button onClick={this.handleClick}>클릭</button>
  }
}
```

Header 컴포넌트와 마찬가지로 마운트 되었을 때 기록했다. 그리고 버튼을 글릭했을 때도 로깅했다.

여기는 두 가지 문제을 짚을 수 있다.

하나는 두 컴포넌트의 중복 코드가 있다.
컴포넌트가 마운트 되었을때 로그를 남기는 기록인데 두 컴포넌트 모두 같은 훅을 사용하고 같은 로그 기록 함수를 사용한다.

또 하나는 로깅은 두 컴포넌트의 본연의 역할이 아니라는 것이다.
Header와 Button은 헤더 영역 UI를 렌더하고 사용자 클릭을 받는 버튼을 렌더하는 고유의 역할이 있다.
이에 반해 로깅남기는 코드를 각 메소드에 가지고 있는데 이 컴포넌트의 역할이라고 볼 수 없다.

이러한 기능은 두 컴포넌트 어디에도 소속되어 있지 않다.
어플리케이션 전방에서 쓰이는 공통의 기능이다.
이것은 고차 컴포넌트가 어떻게 해결할 수 있는지 알아 보자.

# 컴포넌트를 래핑해서 프롭으로 전달

```jsx
const withLogging = WrappedComponent => {
  class WithLogging extends React.Component {
    render() {
      const enhancedProps = {
        log,
      }

      return <WrappedComponent {...this.props} {...enhancedProps} />
    }

    componentDidMount() {
      this.log("마운트")
    }
  }

  function log(message) {
    console.log(`[${getComponentName(WrappedComponent)}]`, message)
  }

  function getComponentName({ displayName, name }) {
    return displayName || name || "Component"
  }

  return WithLogging
}
```

withLogging 은 컴포넌트를 받아 컴포넌를 반환하는 함수다.
함수를 받아 함수를 반환하는 것을 고차함수라고 하듯이 이것을 고차 컴포넌트라고 부른다.

이 함수가 반환한 컴포넌트는 인자로 받은 컴포넌트를 렌더함수에서 사용한다.
단순히 래핑한 정도로 보일지 모를테지만 이 컴포넌트가 하는 일이 있다.  
바로 enhancedProps를 컴포넌트에 추가하는 것이다.

enhanceProps는 렌더 함수에서 생성한 객체이다.
여기에서는 컴포넌트에 추가할 기능, 이를테면 횡단 관심사와 과련한 기능을 추가할 수 잇다.
컴포넌트의 역할과 무관한 범용적인 log 함수를 전달했다.

이렇게 기능이 강화된 컴포넌트인 WithLogging을 반환한다.

withLoggin을 이용해서 컴포넌트를 다시 작성해 보자.

```jsx
const Header = () => <header>Header</header>

const Button ({log}) => {
  const handleClick = () => log("클릭");
  return <button onClick={handleClick}>클릭</button>;
}

const EnhancedHeader = withLogging(Header)
const EnhancedButton = withLogging(Button)
```

Header와 Button 코드가 매우 단순해졌다.
로깅 기능이 모두 withLogging으로 빠져버렸기 때문이다.
withLogging으로 래핑한 Header와 Button은 EnhancedHeader와 EnhancedButton으로 다시 태어 난다.
컴포넌트가 마운트 되면 로그를 남길 것이다.

Button 컴포넌트는 프롭스 객체에 log 함수가 들어온다. withLogging으로 기능을 강화했기 때문이다.
버튼을 클릭하면 log함수를 사용해 로그를 남길 수 있다.

# 디버깅을 노하우

리액트 개발자 도구에는 어떻게 표시될까?

```jsx
<App>
  <WithLogging>
    <Header>
  <WithLoggin>
    <Button>
```

고차 함수로 감싼 컴포넌트인 WithLogging 컴포넌트가 나온다.
리액트 진영에서는 보통 컴포넌트가 with로 시작한 이름을 가지면 고차 컴포넌트라고 여긴다.
하지만 개발자도구에서 좀 더 명확하게 고차 컴포넌트인 것을 표시하는 방법도 있다.

컴포넌트의 displayName 필드에 "고차\_컴포넌트\_이름(컴포넌트\_이름)" 형식으로 문자열을 지정하는 것이다.

```jsx
WithLogging.displayName = `WithLogging(${getComponentName(WrappedComponent)})`
```

```jsx
<App>
  <Header> WithLogging
    <Header>
  <Button> WithLoggin
    <Button>
```

래핑할 컴포넌트 이름을 사용해서 리액트 컴포넌트 트리를 보여준다.
고차 컴포넌트인 것은 옆에 고차 컴포넌트 이름이 붙는다.

# 컴포넌트 정의는 한 번만

일반 컴포넌트는 클래스나 함수로 정의 한다. 이 클래스를 직접 인스턴스 생성하거나 함수를 실행하지는 않는다.
리액트가 알아서 인스턴스로 만들고 함수를 호출해서 리액트 앨리먼트를 그리기 때문이다.
우리는 그냥 정의만 하면 그만이다.

반면 고차컴포넌트는 함수를 호출해서 컴포넌트를 만든다.
컴포넌트 정의를 만든다는 표현이 더 정확하겠다.
그렇기 때문에 어디서나 컴포넌트를 정의할수 있는데 사용하는 위치에 따라서 의도와 달리 사용할 수도 있다.

```jsx
render() {
  class MyComponent extends React.Component {/* ... */}

  return <MyComponent/>
}
```

우리는 보통 render 메서드에서 컴포넌트를 정의하지 않는다.
문법 오류가 있는 건 아니다.
하지 않는 이유는 뭘까?
리액트는 렌더 함수를 필요에 따라 여러번 호출한다.
이때마다 MyComponent 컴포넌트를 정의하고 리액트 앨리먼트로 사용한다면 즉 인스턴스를 만든다면 어떻게 될까?
인스턴스의 값은 매번 초기화 된다.
특히 상태값이 초기화되면 매번 같은 리액트 앨리먼트만 반환할 것이다.

```jsx
render() {
  const EnhancedButton = withLogging(Button);
  return (
    <>
      <EnhancedHeader />
      <EnhancedButton />
    </>
  )
}
```

함수 호출로 만드는 고차컴포넌트는 자칫 이러한 코드를 만들수도 있다.
class와 함수 정의로 컴포넌트 생성에 비해 코드 한 줄이라서 이렇게 만들수 있을 것 같다.
하지만 같은 이유로 이렇게 만들어서는 의도한대로 동작하지 않을 것이다.

대신에 컴포넌트의 정의 바깥에서 고차 컴포넌트를 생성하는 함수를 호출해야한다.
컴포넌트가 한 번만 만들어져야 하기 때문이다.

# 결론

고차 컴포넌트에 대해 정리해 보았다.

참고

- 예제 코드:
- 리액트 공식문서: https://ko.reactjs.org/docs/higher-order-components.html
- 횡단 관심사: https://ko.wikipedia.org/wiki/%ED%9A%A1%EB%8B%A8_%EA%B4%80%EC%8B%AC%EC%82%AC
