---
title: (번역)Node.js Stream 당신이 알아야할 모든 것 3편
layout: post
category: node
tags:
  stream
---

> 원본: [https://medium.freecodecamp.com/node-js-streams-everything-you-need-to-know-c9141306be93](https://medium.freecodecamp.com/node-js-streams-everything-you-need-to-know-c9141306be93)

이전글: [(번역)Node.js Stream 당신이 알아야할 모든 것 2편](/node/2017/08/07/node-stream-you-need-to-know-2.html)

## 스트림 구현하기 

노드js의 스트림을 말할때 두가 지 다른 태스트가 있습니다

* 스트림을 **구현**하는 작업
* 스트림을 **사용**하는 작업

지금까지는 스트림을 사용하는 것에 대해 말했으니까 이젠 직접 구현해 볼까요?

스트림 구현체들은 eorp `stream` 모듈을 `require` 합니다 

### 쓰기 스트림 만들기 

쓰기 가능한 스트림을 구현하려면 스트림 모듈의 `Writable` 생성자를 사용해야 합니다

```js
const { Writable } = require('stream')
```

많은 방법으로 쓰기 가능한 스트림을 구현할수 있습니다. 예를들어 `Writable` 생성자를 확장해서 할수 있죠.

```js
class myWritableStream extedns Writable {
}
```

하지만, 저는 좀 더 간단한 생성자 접근방법을 선호합니다. 
`Writable` 생성자로 객체를 생성하면서 여러가지 옵션을 전달하는 것입니다
반드시 필요한 옵션은 앞으로 쓰여질 데이터 청크를 노출하는 `write` 함수입니다.

```js
const { Writable } = require('stream');

const outStream = new Writable({
  write(chunk, encodeing, callback) {
    console.log(chunk.toString());
    callback();
  }
});

process.stdin.pipe(outStream);
```

이 메소드는 파라매터 세 개를 취합니다.

* 스트림을 다르게 설정하정 않는 다면 `chunk`는 보통 버퍼입니다.
* 위의 경우 `encoding` 인자가 필요하지만 보통은 무시할 수 있습니다.
* `callback`은 데이터 청크를 처리한 뒤에 호출되는 함수 입니다. 쓰기를 성공했지는 여부를 알리는 신호입니다. 실패를 알리려면 에러 객체와 함께 콜백을 호출하면 됩니다.

`outStream`에서는 간단하게 `console.log`로 청크를 문자열로 출력했습니다. 성공을 알리기 위해 에러 없이 `callback`을 호출합니다. 매우 간단하지만 그렇게 유용한 *echo* 스트림은 아닙니다. 수신한 어떤것이든 다시 에코해줄 것입니다.

이 스트림을 하려면 읽기 가능한 스트림인 `process.stdin`을 `outStream`으로 연결하면 됩니다.

위 코드를 실행하면 여러분이 `process.stdin`으로 입력한 것은 `outStream`과 `console.log`에 의해서 에코될 것입니다.

이건 구현하기에 그렇게 썩 유용한 스트림은 아닙니다. 이미 빌트인으로 구현되어 있기 때문이죠. `process.stdout`이랑 굉장이 비슷해요. `stdin`을 `stdout`으로 연결만 하면 거의 똑같은 에코 기능을 만들수 있습니다. 아래 한줄로 말이죠.

```js
process.stdin.pipe(process.stdout);
```

### 읽기 스트림 만들기 

읽기 가능한 스트림을 만들기 위해서는 `Readable` 인터페이스가 필요하고 이것으로 객체를 만들어야 합니다.

```js
const { Readable } = require('stream');

const inStream = new Readable({});
```

읽기 가능한 스트림을 구현하는 간단한 방법이 있습니다. 소비할 데이터를 바로 `push`할 수 있죠.

```js
const { Readable } = require('stream');

const inStream = new Readable();

inStream.push('ABCDEFGHIJKLM');
inStream.push('NOPQRSTUVWXYZ');

inStream.push(null); // 더 이상 데이터 없음 

inStream.pipe(process.stdout);
```

`null` 객체를 `push` 하는 것은 더 이상 데이터가 없다는 신호입니다. 

이 스트림을 소비하려면 쓰기 가능한 스트림은 `process.stdout`으로 연결만 하면 됩니다.

위 코드를 돌리면 `inStream` 으로부터 데이터를 읽을수 있고 표준 출력으로 이것을 에코할 것입니다. 정말 간단하죠? 하지만 이것도 효율적인건 아니에요.

우리는 기본적으로 `process.stdout`하기 전에 스트림에 있는 모든 데이터를 푸시해 버립니다. 더 나은 방법은 요구가 있을때 (**on demand**) 데이터를 푸시하는 겁니다. 즉 소비자가 데이터를 요구할 때 말이죠. 읽기 가능한 스트림 설정에서 `read()` 메소드를 구현하면 그렇게 할 수 있습니다.

```js
const inStrem = new Readable({
  read(size) {
    // 데이터 요구가 있을 때... 이것을 읽으세요 
  }
});
```

읽기 가능한 스트림에서 `read` 메소드가 호출되면, 구현부는 부부적인 데이터를 큐(queue)로 푸시할 수 있습니다. 예를 들어, "A"를 나타내는 문자코드 65부터 시작해 한번에 한 글자씩 여러번 푸시해서 보낼 수 있습니다.

```js
const inStream = new Readable({
  read(size) {
    this.push(String.fromCharCode(this.currentCharCode++));
    if (this.currentCharCode > 90) {
      this.push(null);
    }
  }
});

inStream.currentCharCode = 65;

inStream.pipe(process.stdout);
```

읽기 가능한 스트림을 읽는 동안 `read` 메소드는 계속 실행고 더 많은 문자를 푸시할 것입니다. 언젠가는 이 사이클을 멈춰야하는데 이게 바로 if문이 currentCharCode가 90("Z")보다 클때 null을 푸시하는 이유입니다.

이 코드는 이전의 간단한 코드와 동일하지만의 소비자가 요청할때 데이터를 푸시할수 있게 되었습니다. 항상 그렇게 해야합니다.

### Duplex/Transform 스트림 만들기 

### 스트림 오브젝트 모드 

### 비 내장 transform 스트림 

