---
slug: "/2023/06/24/lecture-react-season2-part3-ch1"
date: 2023-06-24 00:03:01
title: "[리액트 2부] 3.1 클래스/함수 컴포넌트"
layout: post
series: "[리액트 2부] 고급주제와 훅"
tags: [react]
---

클래스와 함수에 대해 짚고 리액트 클래스 컴포넌트와 함수 컴포넌트에 대해 알아본다. 함수 컴포넌트와 훅을 사용하는 것이 어떤 의미인지도 고찰해 보자.

# 새로운 프로젝트: 2-hook

이전에 사용한 모든 함수 컴포넌트를 폴더 하위에 그대로 옮겨왔다.

src/components: 이전 코드에서 함수형 컴포넌트를 사용하는 파일을 그대로 가져 왔다.

- Backdrop.jsx
- Button.jsx
- Card.jsx
- Dialog.jsx
- ErrorDialog.jsx
- FormControl.jsx
- Navbar.jsx
- Page.jsx
- ProductItem.jsx
- Title.jsx

src/pages: 각 페이지에 해당하는 폴더를 만들고 각각 빈 파일의 index.jsx를 만들었다. 일부 함수 컴포넌트는 그대로 복사해 왔다.

- ProductPage
  - index.js: 상품목록 화면. 빈 파일이다.
  - OrderableProductItem.jsx
- CartPage
  - index.jsx: 장바구니 화면. 빈 파일이다.
  - PaymentButton.jsx
  - PaymentSuccessDialog.jsx
- OrderPage:
  - index.jsx: 주문내역 화면. 빈 파일이다.
  - OrderAddressCard.jsx
  - OrderPaymentCard.jsx
  - OrderStatusCard.jsx

src/App.jsx: 어플리케이션 컴포넌다. "2-react-hooks" 문자를 렌더링하는 로직만 있다.

1-react 폴더처럼 2-hook 폴더도 npm 워크스페이스로 구성했다.

```json{4,8}
{
  "scripts": {
    "1-react": "npm start --workspace 1-react",
    "2-hook": "npm start --workspace 2-hook",
  },
  "workspaces": [
    "1-react",
    "2-hook"
}
```

워크스페이스 속성에 추가했다. 2-hook/package.json 파일의 name 속성의 값을 사용 것이다.

프로젝트를 구동하기 위한 스크립트도 추가했다. 새로운 프로젝트를 구동해 보자.

```
npm start 2-hook
```

웹팩 개발 서버가 실행되고 초기 화면이 나올 것이다.

![초기 화면이 나왔다.](./2-react-hooks-start.jpg)

# 클래스와 함수

잠시 리액트에서 고개를 돌리고 다른 얘길 해보자.

자바스크립트의 클래스와 함수는 어떻게 사용할까? 계약서 예제를 보면서 이 둘을 비교해 보겠다.

```js
class Contract {
  constructor(name) {
    this.name = name
  }

  sign() {
    setTimeout(() => console.log("서명인: " + this.name), 3000)
  }
}

const contract = new Contract("사용자1")
contract.sign()
conttract.name = "사용자2"
```

'사용자1'의 계약서를 만든 뒤 서명하면 서명인이 노출되는 로직이다. 3초 후에 로그가 찍히는데 그 전에 계약자 이름을 슬그머니 '사용자2'로 바꾸었다.

생성자에서 '사용자1'을 지정했지만 sign 메소드가 실행되고 3초후에 로그를 찍을 것이다. 이때 this.name을 사용하는데 바뀐 값인 '사용자2'로 서명하게 될 것이다.

이건 클래스 버그가 아니다. 클래스 생성자는 인스턴스를 만들어 this로 이 값을 가리킨다. this를 사용하면 언제나 인스턴스 값에 접근할 수 있는데 이것이 this의 목적이다. 서명을 완료하기 전에 this로 접근해 객체의 name을 바꾼 것이 문제 원인이다.

어떻게 해결할 수 있을까? 서명 시점의 this.name 값을 고정하자.

```js{3,5}
class Contract {
  sign() {
    const name = this.name
    setTimeout(() => console.log("서명인: " + name)}, 3000)
  }
}
```

메서드가 호출될 때 this.name을 메소드 내부 변수 name에 저장했다. 3초 뒤 실행할 함수에서 이 변수를 사용하기 때문에 제거되지 않고 클로져에 캡쳐되어 있을 것이다. 로그를 찍으면 캡쳐 당시 값이 출력된다.

계약서 객체는 클래스뿐만 아니라 함수로 만들 수도 있다.

```js
function createContract(name) {
  const sign = () => {
    setTimeout(() => console.log("서명인 " + name), 3000)
  }

  return {
    sign,
  }
}
const contract = createContract("사용자1")
contract.sign() // 사용자
```

이름을 받아 계약서를 만드는 팩토리 함수다. 내부 함수 sign은 3초 후에 서명인 이름을 기록할 것이다. 인자 name은 내부 변수이기도한데 반환한 sign 함수에서 사용했기 때문에 함수를 종료하더라도 클로져에 캡쳐되어 값이 유지될 것이다.

사용하는 방법은 클래스와 같다. 클래스로 만든 객체는 내부 변수가 공개되어 있지만 이것은 클로져에 있기 때문에 외부에서 접근할 수 없다는 점이 다르다.

클래스로 만든 객체는 this를 가지고 있기 때문에 내부 상태를 관리하는데 좋다. 이 상태를 상황을 **고정**시키고 싶다면 함수로 객체를 만들어 클로져를 사용하는 편이 좋을 것이다.

# 리액트 컴포넌트

다시 리액트로 돌아와서.

리액트 컴포넌트를 만드는 두 가지 방법에 대해 배웠다.

- 클래스 컴포넌트
- 함수형 컴포넌트

컴포넌트의 상태가 필요할 때는 전자를 사용하고 그렇지 않을 때는 후자를 사용했다.

1부 수업에서 훅을 배우고 싶어하는 분들이 많았다. 그만큼 함수 컴포넌트와 훅을 사용해 리액트 어플리케이션을 만드는 것이 일반적이기 때문이다. 리액트 문서에서도 기존 클래스 컴포넌트를 굳이 바꿀 필요는 없지만 새로 만드는 것이라면 훅과 함께 함수 컴포넌트를 사용하라고 한다.

클래스와 함수 컴포넌트의 차이는 뭘까? 왜 리액트는 클래스 보다는 함수 컴포넌트 사용을 독려하는 것일까?

예제를 보면서 이 둘을 비교해 보자.

```jsx
class Contract extends React.Component {
  handleSign() {
    setTimeout(() => console.log("서명인: " + this.props.name), 3000)
  }

  render() {
    return <button onClick={this.handleSign.bind(this)}>서명</button>
  }
}
```

계약서 컴포넌트다. 버튼이 있고 클릭하면 3초 동안 로직을 수행한 뒤 서명인 이름을 출력하는 역할이다. 3 후 this.props.name 값을 출력할 것이다. 당시의 this 가리키는 값을 사용하기 때문이다.

만약 인자를 전달하는 측에서 이값을 바꾸면 바뀐값으로 서명인이 나올것이다.

```jsx{3,13,17}
class App extends React.Component {
  state = {
    name: "사용자1",
  }

  handleChange(e) {
    this.setState({ name: e.target.value })
  }

  render() {
    return (
      <>
        <select value={this.state.name} onChange={this.handleChange.bind(this)}>
          <option value="사용자1">사용자1</option>
          <option value="사용자2">사용자2</option>
        </select>
        <Contract name={this.state.name} />
      </>
    )
  }
}
```

App의 상태 name으로 사용자 이름을 관리한다. 이 값은 렌더 메소드의 select 핸들러가 변경할 것이다. 그리고 Contract 인자로 전달된다.

'사용자1'이 선택된 상태에서 서명 버튼을 클릭해보자. 3초 내에 '사용자2'로 변경한다. Contract는 '사용자2'를 서명인으로 기록할 것이다. 3초 뒤에는 this를 통해 전달된 인자가 그렇게 변경되었기 때문이다.

이 현상을 해결하려면 Contract에서 this.props.name 값을 고정시켜야 한다. 클로져를 사용하자.

```jsx{3}
class Contract extends React.Component {
  render() {
    const props = this.props
    const handleSign = () => {
      setTimeout(() => console.log("서명인: " + props.name), 3000)
    }
    return <button onClick={handleSign}>서명</button>
  }
}
```

handleSign 메소드를 render 메소드 내부 함수로 옮겼다. render 실행 시점의 this.props 값을 변수에 담았다. 이 값은 클로져로 캡처될 것이다. 반환하는 함수 handleSign 안에서 사용되기 때문이다. 3초 후 타이머에 전달한 함수가 실행되면 클로저에 있는 props 값을 사용할 것이다.

클래스 컴포넌트의 모양을 보니 함수 컴포넌트로도 충분할 것 같다.

```jsx
function Contract(props) {
  const handleSign = () =>
    setTimeout(() => console.log("서명인: " + props.name), 3000)

  return <button onClick={handleSign}>서명</button>
}
```

함수 컴포넌트는 리액틀 앨리먼트만 반환하면 되는 인터페이스이다. 반환 값 중 handleSign에서 props를 사용하기 때문에 이 값은 클로저에 캡쳐될 것이다. 버튼을 클릭하고 3초가 지나면 타이머 함수가 동작하는데 이 때 캡쳐될 당시의 인자 값을 사용하게 될 것이다.

--

정리.

클래스 컴포넌트

- 인스턴스를 가리키는 것이 this. 컴포넌트에 전달된 인자는 this.props를 통해 접근
- this.props는 불변객체로 취급하길 원하지만 사용자가 언제든 수정할 수 있는 구조
- this.props는 전달하는 시점에 따라 값이 바뀔 수

함수 컴포넌트

- 인스턴스라는 것이 없음. 리액트 앨리먼트를 반환할 뿐
- 인자는 내부 변수이기 때문에 반환한 앨리먼트에서 사용할 경우 클로져로 고정
- 렌더링 시점의 값의로 고정

# 비교

클래스컴포넌트와 함수형 컴포넌트를 비교해 보자.

코드양

- 클래스 컴포넌트: 리액트 컴포넌트를 상속해야한다. 생성자에서는 super를 호출. render 메서드를 반드시 구현해야 한다.

- 함수 컴포넌트: 리액트 앨리먼트를 반환해야 한다.

변경

- 클래스 컴포넌트: 변경에 취약하다. 외부에서 클래스로 만든 인스턴스의 속성에 언제라도 접근해 다른 값으로 변경할 수 있다.

- 함수 컴포넌트: 내부 상태를 클로저로 관리하기 때문에 외부에서 접근할 방법이 없다.

this

- 클래스 컴포넌트: UI, XHR 등 비동기로 동작할 때 콜백 인자로 메소드를 전달하려면 this를 고정해야 한다. 멤버 변수에 화살표 함수로 정의해 블록 스코프를 사용할 수도 있지만 앞에서 언급한것 처럼 멤버 변수는 조작할 수 있다. 전용 데코레이터를 사용하는 경우도 있다.

- 함수 컴포넌트: this가 없다.

컴포넌트 동작을 이해하는 관점

- 클래스 컴포넌트: 컴포넌트 생명주기에 따라 로직을 작성한다. 컴포넌트가 생성되고, 렌더되고, 이것이 돔에 마운트 되는 순서를 따라야 한다. 마운트 시점에 부수효과를 발생했다면 언마운트 시점에 부수효과를 정리해야하는 작업을 각각 해야한다.

- 함수 컴포넌트: 값의 변화에 따라 로직을 작성한다. 훅에서 다루겠지만 이를 의존성이라고 한다.

상속과 조합

- 클래스 컴포넌트: 클래스 기반이라서 상속하기 쉬운 구조이다. 잘 사용하면 생산성을 올릴 수 있지만 대부분의 경우 좋은 결과를 보지 못했다. 코드를 재사용하는 것 같지만 오히려 강하게 결합되는 결과였다.

클래스와 함수 컴포넌트의 차이에 대해 짚어 보았다. 비교적 함수의 사용법이 단순하다.

# 리액트 훅

객체는 클래스로 만들 수도 있고 함수로 만들 수도 있는데 용도에 따라 사용한다. 상태가 필요하다면 this를 가진 클래스를 사용하는 것이 간편하겠다. 반면 특정 상황의 값을 고정시켜야 한다면 함수로 만드는 것이 낫다.

리액트 컴포넌트도 클래스와 함수가 있느데 둘은 앞에서 설명한 특징을 그대로 닮는다. 함수 컴포넌트는 특정 상황의 값을 고정한다는 것이 클래스 컴포넌트와의 근본적인 차이다.

반면 한계도 있다. 생성자 함수를 실행해 객체를 만드는 클래스 컴포넌트와 달리 실행할 때마다 리액트 앨리먼트를 만드는 함수 컴포넌트에는 상태가 없다. 상태가 없기 때문에 컨택스트 제공자가 될 수도 없다. 생명주기 메소드가 없기 때문에 이에 따른 로직도 함수 안에 담을 수 없다. 객체 멤버 변수로 등록하는 리액트 레프 객체도 함수에는 없다.

이런 함수 클랙스의 한계를 극복하기 위해 훅을 제공한다. 리액트 버전 16.8.0부터 지원한다.

기본 훅

- 상태관리 훅: 함수 컴포넌트에서 상태를 관리할 수 있다.
- 컨택스트 훅: 함수 컴포넌트에서 컨택스트를 사용할 수 있다.
- 부수효과 훅: 함수 컴포넌트에서 부수효과를 사용할 수 있다.

이 외에도 훅에서는 추가 기능을 제공한다.

- 리듀서 훅: 함수 컴포넌트에서 스토어를 사용할 수 있다.
- 메모이제이션 훅: 함수 컴포넌트의 성능을 개선할 수 있다.
- 레프 훅: 함수 컴포넌트에서 레프 객체를 사용할 수 있다.

참고

- [함수형 컴포넌트와 클래스, 어떤 차이가 존재할까? | Overreacted](https://overreacted.io/ko/how-are-function-components-different-from-classes/)
