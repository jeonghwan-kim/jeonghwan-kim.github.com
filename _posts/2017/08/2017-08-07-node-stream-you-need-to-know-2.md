---
title: Node.js Stream 당신이 알아야할 모든 것 2편
layout: post
category: dev
permalink: node/2017/08/07/node-stream-you-need-to-know-2.html
tags:
  stream
summary: 노드 스트림의 기본 개념을 설명하는 글입니다
---

> 원본: [https://medium.freecodecamp.com/node-js-streams-everything-you-need-to-know-c9141306be93](https://medium.freecodecamp.com/node-js-streams-everything-you-need-to-know-c9141306be93)

이전글: [(번역)Node.js Stream 당신이 알아야할 모든 것 1편](/node/2017/07/03/node-stream-you-need-to-know.html)


## 스트림 101 (기초?)

Node.js에는 네 가지 기초 스트림 타입이 있습니다. Readable, Writable, Duplex, Transform 스트림입니다.

* 읽기 가능한(readable) 스트림은 소비할수 있는 데이터를 추상화한 것입니다. 예를들어 `fs.createReadStream` 메소드가 그렇죠.
* 쓰기 가능한 (writable) 스트림은 데이터를 기록할수 있는 종착점을 추상화한 것입니다. 예를 들어 `fs.createWriteStream` 메소드가 있죠.
* 듀플렉스(duplex) 스트림은 읽기/쓰기 모두 가능합니다. 예를 들어 TCP 소켓이 있죠.
* 트랜스폼(transform) 스트림은 기본적으로 듀플렉스 스트림입니다. 데이터를 읽거나 기록할 때 수정/변환될수 있는 데이터죠. 예를들어 gzip을 이용해 데이터를 압축하는  `zlib.createGzip` 스트림이 있습니다. 입력은 쓰기 가능한 스트림이고 출력은 읽기 가능한 스트림인 트랜스폼 스트림을 생각할 수 있을 겁니다. 트랜스폼 스트림이 *"스트림을 통해(through streams)"*라고 불리는 것을 들어 봤을 겁니다.

모든 스트림은 `EventEmitter`의 인스턴스 입니다. 데이터를 읽거나 쓸 때 사용할 이벤트를 방출(emit) 합니다. 하지만, `pipe` 메소드를 이용하면 더 간단하게 스트림 데이터를 사용할 수 있습니다.

### pipe 메소드

우선 마법같은 코드를 보시죠.

```
readableSrc.pipe(writableDest)
```

읽기 가능한 스트림의 출력과 쓰기 가능한 스트림의 입력을 파이프로 연결하였습니다. 소스은 읽기 가능한 스트림이 되고 목적지는 쓰기 가능한 스트림이 됩니다. 물론 둘은 듀클랙스/트랜스폼 스트림이 될 수도 있습니다. 사실, 듀플렉스 스트림으로 연결하면 리눅스에서 하는 것처림 파이프 체인을 호출할 수 있습니다.

```
reableSrc
  .pipe(transformStream1)
  .pipe(transformStream2)
  .pipe(finalWritableDest)
```

`pipe` 메소드는 위처럼 체이닝할 수 있도록 목적지 스트림을 반환합니다. `a`(읽기 가능한) 스트림, `b`와 `c`(듀플랙스), 그리고 `d`(쓰기 가능한)를 위해 우리는 이렇게 코딩할 수 있어요.

```bash
a.pipe(b).pipe(c).pipe(d)

# 같은 코드
a.pipe(b)
b.pipe(c)
c.pipe(d)

# 리눅스에서는 이렇게 합니다
$ a | b | c | d
```

`pipe` 메소드는 스트림을 사용할수 있는 가장 쉬운 방법입니다. 보통 `pipe` 메소드를 사용하거나 이벤트와 함께 스트림을 사용하는 것을 추천하지만 두 개를 같이 쓰는 것 만큼은 피해야 합니다. `pipe` 메소드를 사용할 경우 이벤트를 사용하지 말아야 합니다. 좀 더 커스텀한 방법으로 스트림을 사용하려면 이벤트를 사용해야 합니다.

### 스트림 이벤트

읽기 가능한 스트림으로부터 읽거나 쓰기 가능한 스트림으로 쓰는 것 외에도 `pipe` 메소드는 자동으로 몇가지 작업을 관리합니다. 예를 들어, 에러 처리나 파일의 끝부분 처리, 그리고 어떤 스트림이 다른 것들에 비해 느리거나 빠를 경우를 처리합니다.

하지만 스트림은 직접 이벤트와 함께 사용할수 있습니다. 여기 `pipe` 메소드가 데이터를 읽고 쓰기위해 주로 하는 것을 나타내는 간단한 코드가 있습니다.

```js
// readable.pipe(writable)

readable.on('data', (chunk) => {
  writable.write(chunk);
});

readable.on('end', () => {
  writable.end();
});
```

주요 이벤트 그리고 스트림과 함께 사용할 수 있는 함수 목록은 다음과 같습니다.
![](https://cdn-images-1.medium.com/max/1600/1*HGXpeiF5-hJrOk_8tT2jFA.png)

<small>Pluralsight 코스로 부터 캡처함 것임 - Advanced Node.js</small>

이벤트와 함수들은 보통 함께 사용되기 때문에 서로 관련이 있습니다.

읽기 가능한 스트림에서 가장 중요한 이벤트는 다음과 같습니다.

* `data` 이벤트: 스트림이 소비자에게 데이터 청크를 전송할때 발생합니다.
* `end` 이벤트: 더 이상 소비할 데이터가 없을때 발생합니다.

쓰기 가능한 스트림에서 가장 중요한 이벤트는 다음과 같습니다.

* `drain` 이벤트: 쓰기 가능한 스트림이 더 많은 데이터를 수신할 수 있다는 신호입니다.
* `finish` 이벤트: 모든 데이터가 시스템으로 플러시 될때 생성됩니다.

이벤트와 함수는 커스터마이징된 스트림을 사용하기 위해 함께 사용할 수 있습니다. 읽기 가능한 스트림을 사용하기 위해 `pipe`/`unpipe` 메소드를 사용하거나 `read`/`unshift`/`resume` 메소드를 사용할 수 있습니다. 쓰기 가능한 스트림을 사용하기 위해 우리는 이것을 `pipe`/`unpip`의 종착점으로 만들수 있습니다. 혹은 `write` 메소드로 쓰고 끝날때 `done` 메소드를 호출하면 됩니다.

### 읽기 가능한 스트림의 일시 정지 모드와 흐름 모드

읽기 가능한 스트림은 사용할 수 있는 방법에 영향을 주는 두 가지 주요 모드가 있습니다.

* 일시 정지 (Pause) 모드
* 흐름 (flowing) 모드

두 개는 풀(pull), 푸시(push) 모드라고도 합니다.

기본적으로 모든 읽기 가능한 스트림은 일시정지 모드에서 시작하지만, 필요에 따라 흐름 모드로 변경되거나 일시 정지 모드로 되돌아갈 수도 있습니다. 가끔은 자동으로 스위칭 되기도 합니다.

읽기가능한 스트림이 일시정지 모드일 때, 스트림을 읽기 위해 `read()` 메소드를 호출할 수 있습니다. 하지만 흐름 모드일 경우에는 데이터가 연속적으로 흐르고 있고 우리는 이것을 기다려야 합니다.

흐름 모드일 때, 만약 이것을 수신할 소비자가 없으면 데이터는 사라지게 됩니다. 그렇기 때문에 흐름 모드에서 읽기 가능한 스트림이 있을 때는 `data` 이벤트 핸들러가 필요합니다. 사실, `data` 이벤트 핸들러를 추가하는 것은 일시 정지된 스트림을 흐름 모드로 바꾸는 것이고, `data` 이벤트 핸들러를 제거하는 것은 일시 정지 모드로 되돌리는 것입니다. 이 중 몇 가지는 예전 노드 스트림 인터페이스와의 호환성을 위해 수행됩니다.

수동으로 두 모드 간에 변경하려면 `resume()`, `pause()` 메도드를 사용하면 됩니다.

![](https://cdn-images-1.medium.com/max/1600/1*HI-mtispQ13qm8ib5yey3g.png)

<small>Pluralsight 코스로부터 캡처함 것임 - Advanced Node.js</small>

`pipe` 메소드로 읽기 가능한 스트림을 사용할 때는 두 모드를 신경쓰지 않아도 됩니다. `pipe` 가 자동으로 관리하기 때문이죠.

다음글: [(번역)Node.js Stream 당신이 알아야할 모든 것 3편](/node/2017/08/12/node-stream-you-need-to-know-3.html)
