---
title: "[Node.js코드랩] 4.어플리케이션"
layout: post
summary: 어플리케이션 모듈을 만듭니다.
category: series
seriesId: "555b6438-4a71-51d0-9156-a1d5ca4d5eab"
tags: [lecture]
---

## 🌳목표

우리가 만들었던 server.js는 http 모듈을 직접 가져다 사용한 것입니다.
모듈의 createServer() 함수와 listen() 함수를 직접 사용했죠.

외부 모듈 혹은 라이브러리 따위를 사용할 때는 한 번 래핑해서 사용하는 것이 좋습니다.
우리 코드가 라이브러리와 강하게 커플링 되지 않도록 하는것이죠.
한 단계 버퍼를 둬서 외부 코드의 변화에 유연하게 대처하기 위합니다.

## Application 모듈

그래서 "Application" 이란 이름으로 모듈을 다시 만들어 볼거에요.
이 모듈은 http를 내부적으로 사용할 것이고요.

먼저 지난 시간까지 했던 코드로 이동하겠습니다.

```
$ git checkout -f application/listen-spec
```

추가 모듈(sinon)이 있기 때문에 package.json에 기록한 모듈을 설치합니다.

```
$ npm install
```

src 폴더에 Application.spec.js 파일부터 살펴 보겠습니다.
우리가 만들 Application 모듈의 요구사항을 테스크 코드로 작성해 둔 것이죠.

네 부분으로 나눠서 설명하겠습니다.

```js
describe('Application', () => {
  describe('listen()', () => {
    it('server 객체의 listen 함수를 실행한다', () => {
```

이전 글에서 모카를 소개했었죠? 모카는 테스트 코드를 실행해주는 테스트 러너입니다.
모카 프레임웍이 제공하는 API 함수가 몇 개있는데요, 저는 `describe()`과 `it()`을 사용했습니다.

- `descirbe()`: 테스트 꾸러미(Test Suite)라고 하며 테스트 환경을 기술함
- `it()`: 테스트 케이스(Test Case)라고 하며 단위 테스트를 정의함

위 코드는 "Application 모듈의 listen() 메소드를 테스트" 하는 코드입니다.
이 메소드는 "server 객체의 listen 함수를 실행한다"라는 테스트인 것이죠.

```js
// arrange
const app = App() // const App = require('./Application') 으로 가져왔다고 가정
const spy = sinon.spy()
app._server.listen = spy
```

유닛 테스트는 보통 세 단계로 나눕니다.

- 준비(arragne) -> 실행(act) -> 검증(assert)

위 코드는 첫 번째 준비 단계를 정의하는 코드입니다.
어플리케이션 객체와 스파이를 만들었습니다. 그리고 app.\_server 객체의 listen 속성에 스파이를 심어 두었죠.
스파이를 심은 이유는 검증할때 listen 함수가 호출되었지는 스파이로 확인하기 위해서 입니다.

```js
// act
app.listen()
```

실제 테스트 해야할 메소드를 실행합니다.

```js
// assert
should(spy.called).be.equal(true)
```

listen 메소드가 실행되었는지 스파이를 통해 검사하는 코드입니다.

테스트를 돌려 볼까요?

```
$ npm t

Error: Cannot find module './Application'
```

이것보다 많은 메세지가 나오지만 Application 모듈을 찾지 못하는게 핵심입니다.
왜냐면 우리는 테스트 코드만 만들었지 대상이 되는 Application.js 는 만들지 않았기 때문이죠.

## 🐤실습 - Application 모듈과 listen 메소드 구현

Application 모듈을 구현해 보세요. Application은 listen 메소드를 가져야 합니다.
구현한 뒤에는 반드시 테스트 코드를 통과해야 하구요.

## 🐤풀이

자 그럼 같이 풀어 볼까요? 세 단계로 나눠 설명하겠습니다.

```js
const http = require("http")

const Application = () => {
  const listen = () => {}

  return {
    listen,
  }
}

module.exports = Application
```

먼저 http 모듈을 가져왔습니다.
그리고 자바스크립트의 모듈 패턴으로 Application을 구현했습니다.
모듈 패턴은 자바스크립트 객체를 반환하는데요,
테스트 코드에 있는 listen 함수를 넣어서 반환했습니다. 아직 이건 빈 함수이고요.
마지막 줄에 Application을 모듈로 만들어서 외부에서 사용하도록 했습니다.

```js
const _server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain")
  res.end("Hello World\n")
})

// ...

return {
  _server,
  listen,
}
```

테스트 코드에 보면 _server 객체를 통해 스파이를 심어두고 있죠.
이건 테스트 용도로 노출하는 것이라 변수 이름 앞에 언더스코어(`_`)를 붙였습니다.
http.createServer() 함수로 서버를 만들어 \_server에 저장했고 외부로 노출하였습니다.

```js
const listen = (port = 3000, hostname = "127.0.0.1", fn) => {
  _server.listen(port, hostname, fn)
}
```

생성한 \_server 객체를 통해 listen 함수 코드를 채워 넣었습니다.
포트 번호와 호스트명 기본 인자값을 설정해서 방어 코드를 만들었구요.
테스트 코드에서 listen 함수 호출여부를 체크했기 때문에 \_server.listen()을 호출했습니다.

이제 테스트를 실행해 볼까요?

```
$ npm test

  Application
    listen()
      ✓ server 객체의 listen 함수를 실행한다

  1 passing (8ms)
```

성공적으로 통과했네요.

server.js를 app.js로 이름을 바꾸겠습니다.
이제는 서버라기보다는 어플리케이션 모듈을 이용한 어플리케이션 객체라는 의미죠.
app.js 코드를 볼까요?

```js
const App = require("./src/Application")
const app = App()

module.exports = app
```

Application 모듈을 가져와 객체를 만들어 app에 저장했죠. 곧장 모듈로 노출했습니다.

bin.js도 볼까요?

```js
const app = require("./app")
const hostname = "127.0.0.1"
const port = 3000

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
```

"server" 대신 "app" 모듈을 가져온 것만 달라졌습니다.

서버를 실행하면 잘 동작하네요.

```
npm start

Server running at http://127.0.0.1:3000/
```

Application 모듈은 아래 초록색 부분입니다.
드디어 익스프레스JS의 첫번째 모듈을 만들었군요.

![](/assets/imgs/2018/12/04/struct.png)

## 정리

- http를 직접 사용하지 않고 Application 객체로 추상화 하였습니다.

[목차 바로가기](/series/2018/12/01/node-web-0_index.html)
