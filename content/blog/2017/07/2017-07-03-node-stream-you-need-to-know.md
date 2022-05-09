---
title: Node.js Stream 당신이 알아야할 모든 것 1편
layout: post
category: dev
slug: /node/2017/07/03/node-stream-you-need-to-know.html
date: 2017-07-03
tags: [nodejs, 번역]
---

> 원본: [https://medium.freecodecamp.com/node-js-streams-everything-you-need-to-know-c9141306be93](https://medium.freecodecamp.com/node-js-streams-everything-you-need-to-know-c9141306be93)

![](https://cdn-images-1.medium.com/max/2000/1*xGNVMFqXXTeK7ZyK2eN21Q.jpeg)

노드js의 스트림은 정말 다루기 어렵고 이해하기 힘든 것으로 유명합니다. 글세요. 이제는 더 이상 그렇지만은 않을 거에요.

지난 몇년간 개발자들은 스트림을 쉽게 다루기 위한 노드 패키지를 만들어 왔지만, 이 글에서는 [내이티브 노드 스트림 API](https://nodejs.org/api/stream.html)에만 중점을 두겠습니다.

> 스트림은 노드의 가장 멋진 아이디어 입니다. 동시에 가장 오해하고 있는 것이기도 합니다. - Dominic Tarr

## 스트림이 정확히 뭔가요?

스트림은 배열이나 문자열같은 데이터 컬력션입니다. 스트림이 어려운 것은 한번에 모든 데이터를 얻을 수 없다는 점이죠. 게다가 메모리에 딱 맞지도 않구요. 스트림의 이러한 점은 엄청 큰 데이터를 다룰 때나, 외부 소스로부터 데이터를 한번에 한 청크(chunk)씩 가져올때 힘을 발휘합니다.

스트림이 큰 데이터만 다루는 것은 아닙니다. 코드를 조합할수 있도록 해 주지요. 리눅스 명령어를 다른 작은 명령어들과 파이핑(piping)하여 구성할수 있는 것처럼, 노드 스트림에서도 완전 똑같이 할 수 있습니다.

```bash
$ grep -R exports * | wc -l
```

```js
const grep = ... // grep 출력을 위한 스트림
const wc = ... // wc 입력을 위한 스트림

grep.pipe(wc)
```

노드의 많은 내장 모듈은 스트림 인터페이스를 구현합니다.

![](https://cdn-images-1.medium.com/max/800/1*lhOvZiDrVbzF8_l8QX3ACw.png)
<small>스크린샷은 제 Pluralsight course 에서 캡쳐한 것입니다 - Advanced Node.js</small>

위에 있는 목록은 읽기 가능하거나 쓰기 가능한 스트림인 네이티브 노드 객체들입니다. 이것들 중에는 TCP 소켓, zlib, crypto 같이 읽기/쓰기 모두 가능한 객체도 있지요.

이 객체들은 서로 밀접하게 관련되어 있습니다. 클라이어트에서는 HTTP 응답이 읽기 가능한 스트림인 반면 서버에서는 쓰기 가능한 스트림이 됩니다. HTTP의 경우 기본적으로 하나의 오브젝트로부터 읽고(`http.ImcomingMessage`) 다른 곳으로 쓰기(`http.ServerResponse`) 때문입니다.

또한 `stdio` 스트림들(`stdin`, `stdout`, `stderr`)이 자식 프로세스로 어떻게 반대 스트림 타입을 갖는지 확인해 보세요. 매우 수월한 방법으로 메인 프로세스의 `stdio` 스트림과 연결할 수 있습니다.

## 스트림의 실제 예제

이론은 훌륭하지만 실제로는 충분히 좋지 않는 경우가 있습니다. 메모리 사용과 관련해 서로 다른 스트림이 만들수 있는 코드를 예제를 통해 살펴 보겠습니다.

먼저 큰 파일을 만들어 보죠.

```js
const fs = require("fs")
const file = fs.createWriteStream("./big.file")

for (let i = 0; i <= 1e6; i++) {
  file.write(
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n"
  )
}

file.end()
```

제가 큰 파일을 만들기 위해 무엇을 사용했는지 보세요. 쓰기 가능한 스트림이죠!

`fs` 모듈은 스트림 인터페이스로 파일을 쓰고 읽는데 사용할 수 있습니다. 위 예제에서는 반복문으로 백만 줄의 쓰기 가능한 스트림을 통해 `big.file`를 만들고 있습니다.

이 스크립트를 실행하면 약 400MB 정도의 파일을 생성합니다.

아래는 `big.file`만 제공하도록 디자인된 간단한 노드 웹 서버입니다.

```js
const fs = require("fs")
const server = require("http").createServer()

server.on("request", (req, res) => {
  fs.readFile("./big.file", (err, data) => {
    if (err) throw err

    res.end(data)
  })
})

server.listen(8000)
```

요청을 받은 서버는 비동기 메소드인 `fs.readFile`로 큰 파일을 제공할 것입니다. 하지만 여러분, 이벤트 루프를 막는 것이 좋은 방법은 아닌것 같은데...... 모든 것이 훌륭한가요? 그런가요?

음, 우리가 서버를 구동하고 클라이언트에서 요청할 때 어떠한 일이 일어나는지 살펴봅시다. 그리고 메모리 상태를 모니터링 해봅시다.

제가 서버를 돌렸을 때, 보통의 메모리 사용량인 8.7MB로 시작했습니다.

![](https://cdn-images-1.medium.com/max/1600/1*125_8HQ4KzJkeBcj1LcEiQ.png)

그리고나서 서버로 접속했죠. 이때 메모리 소비에 무슨 일이 벌어지는지 보세요.

![](https://cdn-images-1.medium.com/max/1600/1*SGJw31T5Q9Zfsk24l2yirg.gif)

헐! 메모리소비가 무려 434.8MB로 올랐어요.

`big.file`을 응답 객체로 쓰기 전에 기본적으로 파일 내용을 전부 메모리롤 올려 놓습니다. 이것은 매우 비효율적이죠.

HTTP 응답 객체(위 코드의 `res`)는 쓰기 가능한 객체이기도 합니다. 만약 `big.file`의 내용을 대표하는 읽기 가능한 스트림이 있다면, 간단히 두 개를 서로 파이프로 이어주기만 하면 거의 같은 결과를 달성할수 있을 것입니다. 물론 메모리를 400MB나 사용하지 않고도 말이죠.

노드의 `fs` 모듈은 어떠한 파일에 대해서도 `createReadStream` 메소드를 이용하면 읽기 가능한 스트림을 제공해 줍니다.

```js
const fs = require("fs")
const server = require("http").createServer()

server.on("request", (req, res) => {
  const src = fs.createReadStream("./big.file")
  src.pipe(res)
})

server.listen(8000)
```

이제 다시 서버에 접속하면 마법이 일어납니다! (아래 메모리 사용량을 보세요).

![](https://cdn-images-1.medium.com/max/1600/1*iWNNIMhF9QmD25Vho6-fRQ.gif)

_뭐가 어떻게 된거죠?_

클라이언트가 큰 파일을 요청했을 때, 우리는 이것을 한번에 한 청크씩 스트림으로 흘려 보냅니다. 이것은 모든 것을 메모리에 버퍼로 잡지 않는다는 것을 의미하죠. 메모리 사용은 25MB까지만 증가하고요.

그럼 이 예제를 좀 더 극단으로 밀어 보겠습니다. 백만줄이 아닌 오백만 줄의 `bigfile`을 다시 만들어 볼게요. 아마 이 파일은 2GB 이상일 것이고 노드의 기본 버퍼 한계치보다 큰 사이즈가 될 것입니다.

만약 `fs.readFile`로 파일을 제공한다면, 한계치를 변경하지 않고서는 파일을 제공할 수 없을 것입니다. 하지만 `fs.createReadStream`을 사용하면 요청자에게 2GB 데이터를 스트리밍할 수 있습니다. 게다가 프로세스의 메모리 사용량은 거의 차이가 없을 것이고요.

자 이제 스트림을 배울 준비가 되었나요?

다음글: [(번역)Node.js Stream 당신이 알아야할 모든 것 2편](/node/2017/08/07/node-stream-you-need-to-know-2.html)
