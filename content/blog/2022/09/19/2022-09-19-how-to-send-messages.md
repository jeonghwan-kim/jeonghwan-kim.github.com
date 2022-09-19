---
slug: "/2022/09/19/how-to-send-messages"
title: 객체 간에 메세지를 전달하는 다양한 방법
date: 2022-09-19
layout: post
tags: []
---

어플리케이션을 설계할 때 메세지가 중요하다. 객체지향에 관한 책 "오브젝트"를 읽고 있는데 메세지를 먼저 정하라고 한다. 동작에 필요한 메세지를 정의한 뒤 이를 각 객체에 할당하는 순서로 개발해야 좋은 품질의 어플리케이션을 만들 수 있다는 것이다.

그 동안 반대로 생각했는데 책을 읽고나서 눈여겨 보지 않았던 메세지가 더 중요하다는 사실을 깨달았다. 문득 프론트엔드에서 어떻게 메세지를 주고 받았는지 떠올려보았다. 인접한 객체의 메소드를 호출하는 단순한 방법에서 시작해 멀리 떨어진 객체에게 전달하는 방법, 그리고 다른 쓰레드 위에서 동작하는 어플리케이션의 객체에게 전달하는 방법까지.

객체간에 주고 받는 메세지 전달 수단에 대해서 정리해 보겠다.

## 인접 객체에게

두 객체가 인접해 있다. a 객체 내부에 b객체를 가지고 있거나 a객체의 메소드의 인자로 b를 받는 경우다. 전역 공간에 b가 있는 경우도 a와 b는 인접해 있다. 간단히 말하면 그냥 b 객체를 사용할 수 있다면 둘은 인접해 있는 객체다.

인접 객체에게 메세지를 전달하는 방법은 그 객체의 메소드에 인자를 전달해 호출하는 방법이다.

```js
class A {
  foo(b) {
    b.bar(args) // 객체 a가 객체 b에게 메세지를 전달할 것이다.
  }
}
```

## 멀리 떨어진 객체에게

인접해 있지 않고 멀리 떨어진 객체의 메소드를 어떻게 호출할까? a가 b를 소유하고 b가 c를 소유한 경우라면 차례대로 메소드를 호출하면 된다. a는 b의 메소드를, b는 c의 메소드를 호출함으로써 a가 c에게 메세지를 전달한다.

하지만 객체가 많이 연결되어 있다면? b처럼 중간에 끼여있는 객체들이 여럿 있을 것이다. 자칫 본연의 역할보다는 메세지 전달만을 위한 메서드를 만들어야 할 수 있는데 이것은 객체의 응집도를 떨어뜨린다.

이런 경우 사용할 수 있는 것이 이벤트 에미터 객체다.

```js
// 이벤트 에미터 객체를 만든다.
const eventEmitter = new EventEmitter()

class A {
  foo() {
    // "message" 이벤트를 발생할 것이다.
    // 이 때 data를 함께 전달한다.
    eventEmitter.emit("message", data)
  }
}

class B {
  constructor() {
    // "message" 이벤트를 구독한다.
    // 이벤트가 발생하면 bar 메소드를 호출할 것이다.
    eventEmitter.on("message", this.bar)
  }

  bar: data => {}
}
```

노드의 이벤트 에미터 클래스는 구독/발행 패턴의 구현체이다. 멀리 떨어진 객체 간에 이벤트를 통해 메세지를 주고받을 때 사용한다. 여기서는 글로벌로 접근할 수 있는 이벤트 에미터 객체를 먼저 만들었다. 멀리 떨어진 객체 a와 b는 이것을 매개로 메세지를 서로 주고 받는다.

a가 b에게 직접 메세지를 직접 전달하지 않느다. a는 이벤트 에미터에게 부탁한다. a 객체 입장에서는 이 메세지가 b에게 전달될 것이라는 것을 알 수도 없다.

a에서 b로 메세지가 전달되려면 b객체가 이벤트 에미터에게 요청해야한다. '나는 앞으로 이 메세지를 수신할거야. 메세지가 도착하면 알려줘'라는 방식이다. 이벤트 에미터 패턴은 발신자가 수신자에게 직접 전달하는 이전 방식과 반대다. 메세지를 수신하는 측에서 어떤 메세지를 받을지 정한다. 마치 신발 매장에서 품절 상품의 사이즈가 들어오면 저한테 연락 주세요, 라고 말하는 손님처럼.

## EventEmitter 직접 만들기

타입스크립트와 바벨을 사용한다면 브라우져에서도 이벤트 에미터를 사용할 수 있다. 그런 환경이 아니더라도 이벤트 에미터를 만드는 것은 생각 보다 간단하다.

```js
class EventEmitter {
  // 이벤트 이름과 핸들러 목록
  handlers = {} // {[message]: handlers[]}

  // 핸들러를 추가한다
  on(message, handler) {
    this.handlers[message] = this.handlers[message] || []
    this.handlers[message].push(handler)
  }

  // 이벤트를 발행한다
  emit(message, data) {
    const handlers = this.handlers[message]
    if (!handlers) {
      return
    }

    handlers.forEach(handler => handler(data))
  }
}
```

이벤트 이름과 이벤트가 발행될때 실행할 핸들러 목록을 담을 맵을 준비해 둔다.

on 메서드는 특정 이벤트가 발생할 때 실행할 핸들러를 추가한다. 메세지를 수신할 객체가 이 메소드를 사용할 것이다.

emit 메서드는 이벤트에 등록된 핸들러를 모두 실행한다. 메세지를 전달할 객체가 이 메서드를 사용할 것이다.

이런 구조를 구독패턴이라고 하는데 생각보다 여러 곳에서 사용한다. 노드의 스트림, 브라우저의 이벤트 등록 함수 addEventListener, 리액트의 컨택스트. 리액트 실제코드는 못봤지만 폴리필 코드에서 발견했다.

## 다른 쓰레드의 객체에게

_onstorage_

웹 어플리케이션은 여러 개의 브라우져 탭에서 동시에 실행할 수 있다. 현재 주소를 복사해 새 창이나 탭을 열어서 로딩하면 그만이다. 그럼 각 탭 간에 메세지를 주고 받으려면 어떻게 해야할까? 탭 간에 메세지를 주고 받아야할 상황이 있긴할까?

이번에 웹소켓을 사용한 회사 프로젝트를 개발했는데 브라우져에서 소켓을 하나만 유지해야 했다. 이런 경우에는 여러 탭 중에 소켓을 연결한 메인 탭을 식별해야 했다.

이 때 발견한 스토리지 이벤트는 탭 간에 메세지를 주고 받을 수 있는 실마리를 제공했다.

> storage 이벤트는 다른 문서에서 저장소를 변경했을 때 발생합니다. 출처: [WindowEventHandlers.onstorage | MDN](https://developer.mozilla.org/ko/docs/Web/API/Window/storage_event)

로컬스토리지에 저장된 값이 변경될 때 발생하는 이벤트다. 로컬 스토리지는 도메인별로 하나의 저장소를 사용하기 때문에 같은 도메인을 로딩하는 브라우져 탭 혹은 창 간에 데이터와 이벤트를 공유할 수 있다.

이 저장소는 인증 토큰이나 쿠키 대용으로 사용하기도 한다. 나는 이 저장소를 사용할 때 브라우져가 발생시키는 이벤트에 주목했다. 저장소에 데이터를 넣으면 "storage" 이벤트가 발생하는데 이것이 해당 도메인을 로딩한 어플리케이션으에서 수신할 수 있다.

```js
window.addEventListener("storage", event => {
  event.key // 값을 저장한 키
  event.newValue // 저장한 키
})
```

앞선 예제와 동일한 코드를 작성해 보자. a객체가 b객체로 메세지를 전달해야 한다. 단 이번에는 다른 쓰레드에서 동작하는 어플리케이션의 b객체에게도 메세지를 전달해야한다.

```js
class A {
  foo() {
    window.localStorage.setItem("message", data) // 메세지를 전달한다.
  }
}

class B {
  constructor() {
    window.addEventListener("storage", event => {
      if (event.key === "message") {
        event.newValue // 메세지가 전달 되었다
        this.bar(event.newValue)
      }
    })
  }

  bar: data => {
    /* ... */
  }
}
```

객체 a는 로컬스토리지에 "message" 키에 값을 할당했다. 이것을 메세지를 전달한 것으로 간주하자.

스토리지 이벤트를 구독하고 있는 객체 b는 "message" 키에 저장된 값이 변경되면 경우 bar 메소드를 호출할 것이다.

이벤트 에미터처럼 구독패턴이다. 단 어플리케이션을 로딩한 모든 탭에서 동시에 실행된다는 점에서 이번 구현이 좀 더 강력하다.

활용한다면? a객체가 소켓을 통해 메세지를 받고 이를 b객체에게 알려야하는 상황을 상상해보자. a객체는 여러 탭 중 한 탭에서만 소켓 연결이 되었다고 가정하자. 소켓으로부터 받은 메세지를 알리면 모든 탭에 띄워진 b객체에게 메세지가 전달 될 것이다. b객체가 새 글 표시 역할을 한다면 좀 괜찮은 활용일 듯 하다.

## 다른 워커의 객체에게

_BroadcastChannel_

이전 장에서는 로컬스토리지의 이벤트를 활용해서 탭간에 메세지를 주고 받았다. 좀 찾아보니 이런 용도의 전용 클래스가 이미 있었다.

> The BroadcastChannel interface represents a named channel that any browsing context of a given origin can subscribe to. It allows communication between different documents (in different windows, tabs, frames or iframes) of the same origin. Messages are broadcasted via a message event fired at all BroadcastChannel objects listening to the channel. 출처: [BroadcastChannel | MDN](https://developer.mozilla.org/ko/docs/Web/API/BroadcastChannel)

이름처럼 중계 채널이다. 어디선가 메세지를 받으면 구독자들에게 전달하는 것이 목적이다.

노드의 이벤트 에미터와 좀 다른 부분이 있다. 메인 쓰레드 뿐만 아니라 워커 간에도 메세지를 전달하 수 있는 강력한 기능을 가진다. 물론 같은 도메인을 로딩한 탭 간에도 메세지를 전달할 수 있다.

```js
// app.js
const channel = new BroadcastChannel("myChannel")
channel.postMessage(data)

// worker.js
const channel = new BroadcastChannel("myChannel")
channel.addEventListen("message", event => {
  event.data // 메인 쓰레드에서 전달한 메세지를 받을 것이다
})
```

이번에 알림 기능 개선을 위해 서비스 워커를 맛볼 기회가 있었는데 이 때 발견한 브라우져 api이다. 브라우져 지원도 넓다. 알아두면 문제 해결에 도움이 될 듯 한다.

## 결론

메세지를 주고 받는 다양한 방법에 대해 정리해 보았다. 인접한 객체라면 전달할 객체의 메소드를 통해 메세지를 전달할 수 있다. 좀 떨어진 객체라면 이벤트 에미터라는 중간자에게 메세지를 전달한다. 그리고 수신자는 이를 구독해서 메세지를 받을 수 있었다.

동일 쓰레드를 벋어나서 메세지를 전달하는 방법도 있다. 스토리지 이벤를 활용해 다른 쓰레드에서 메세지를 수신할 수 있었다. 뿐만 아니라 BroadcastChannel을 사용한다면 워커까지 메세지 전달 폭을 넓힐 수 있었다.

### 참고

- 이벤트 에미터: https://nodejs.org/api/events.html#class-eventemitter
- 스토리지 이벤트: https://developer.mozilla.org/ko/docs/Web/API/Window/storage_event
- BroadcastChannel: https://developer.mozilla.org/ko/docs/Web/API/BroadcastChannel
