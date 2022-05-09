---
slug: "/dev/2020/04/30/nodemon-EADDRINUSE.html"
date: 2020-04-30
title: "노드몬(nodemon) 사용시 포트 충돌 이슈"
layout: post
category: dev
tags: [nodemon]
---

노드(Node.js)로 서버를 개발하다 보면 이따금씩 마주하는 현상이 있다.

```
Error: listen EADDRINUSE: address already in use :::3000
```

요청 대기 상태로 만들기 위해 3000번 포트를 사용하려고 시도하는데 이미 사용 중이라는 메세지를 던지고 실행되지 않는다.
서버를 재구동하면서 이전 프로세스가 아직 남아 있기 때문이다.
사용 중인 포트를 운영체제가 아직 회수하지 못한 것 같다.

이럴 경우 즉효약은 포트를 사용하는 프로세스를 직접 종료하는 것이다.

```
$ lsof -nP -iTCP:3000 | grep LISTEN
node    70645    TCP *:3000 (LISTEN)

$ kill 70645
```

# 노드몬을 사용할 때 서버 충돌 현상이 종종 발생한다

[노드몬(nodemon)]()은 노드로 서버 어플리케이션을 만들 때 사용하는 개발 도구다.
소스 코드가 변경되는 것을 감지하고 있다가 노드 서버를 재실행하는 방식이다.
노드몬을 사용하면 실행중인 서버를 중단하고 다시 실행하는 일련의 반복 행위로부터 자유로워질 수 있다.

가끔 노드몬을 사용할 때 이러한 포트 충돌 현상이 매우 잦아지는 경우가 있다.
그때마다 프로세스를 죽이는 처방법을 사용하긴 하는데 반복적으로 사용중인 포트를 삭제하다보면 무척 짜증난다.

이번에도 그랬는데 솔루션을 찾아보다가 얻은 정보를 좀 정리해 둔다.

# 노드몬이 서버 어플리케이션을 재시작하는 방식

노드몬은 초기 어플리케이션을 실행하고 난 뒤 코드 변화를 감지한다.
변경된 파일을 발견하면 즉시 실행중인 서버를 중지하는데 이때 어플리케이션에 `SIGUSR2`라는 종료 시그널을 보낸다.
노드몬에서는 여기서 셧다운 처리를 하라고 안내한다([Controlling shutdown of your script](https://github.com/remy/nodemon#controlling-shutdown-of-your-script)).

```js
process.once("SIGUSR2", function () {
  gracefulShutdown(function () {
    process.kill(process.pid, "SIGUSR2")
  })
})
```

노드몬 포트 충돌 이슈를 찾다보니 이 시그널을 사용하기도 하나 보다([Nodemon fails to restart process with EADDRINUSE #1473](https://github.com/remy/nodemon/issues/1473#issuecomment-458727883)).
`SIGUSR2` 시그널을 받을 때 디비 컨넥션 같은 리소스를 정리하면 노드몬에서 서버 어플리케이션을 온전히 셧다운 할 수 있다는 것 같다.

```js
process.once("SIGUSR2", function () {
  server.close(function () {
    process.kill(process.pid, "SIGUSR2")
  })
})
```

# 재시작 지연하기(`--delay`)

포트 충돌은 재현하기가 좀 까다롭다.
가끔 발생하는것 같다가도 어떤 경우에는 서버를 실행할 때마다 발생해서 좀 당황스럽다.
아마도 자원(포트) 회수를 운영체제가 하다보니 자원을 회수하기 전에 노드몬이 서버를 재실행할 경우 발생하는 것이 아닌가 추측해 볼 뿐이다.

파일 변화를 감지할 때마다 노드몬이 서버를 재실행하다보니, 수시로 저장하면 이러한 포트 충돌 현상이 잦을수 있다.

[`--delay`](https://github.com/remy/nodemon#delaying-restarting) 옵션은 파일 변경시마다 동작하는 노드몬을 좀 덜 민감하게 동작하는 옵션이다.
`--deay 5`로 옵션을 주소 실행하면 변경시마다 노드 서버를 재실항하지 않고 파일이 변화하면 5초간 기다렸다가 마지막에 한번만 서버를 재실행한다.

파일이 변경되더라도 매번 서버를 재실행하는 것이아니라 제한 시간 내에 마지막 한번만 실행하기 때문에 아무래도 운영제제가 포트를 회수할 시간이 확보되는 셈인가 보다.

내 경우 이 옵션을 줘서 문제를 일단 해결했다.

# express-generator로 시작한 코드

express-generator는 익스프레스 프레임워크의 코드 스캐폴딩을 만들어 주는 도구다.
이 코드는 1) http 모듈로 서버를 실행한다는 점과 2) 실행한 서버에 EventEmitter.prototype.on() 메서드로 이벤트 핸들링을 한다는 것이 내 코드와 달랐다.

```js
const server = app.listen(port)

server.on("error", onError)
server.on("listening", onListening)
```

그래서 똑같이 이부분을 코드에 적용했더니 포트 충돌이 발생하지 않았다.
문제는 해결했지만 아직 원인은 잘 모르겠다.
