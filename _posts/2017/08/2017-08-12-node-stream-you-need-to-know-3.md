---
title: Node.js Stream 당신이 알아야할 모든 것 3편
layout: post
category: dev
permalink: node/2017/08/12/node-stream-you-need-to-know-3.html
tags:
  stream
summary: 노드 스트림을 직접 구현해 봅니다
---

> 원본: [https://medium.freecodecamp.com/node-js-streams-everything-you-need-to-know-c9141306be93](https://medium.freecodecamp.com/node-js-streams-everything-you-need-to-know-c9141306be93)

이전글: [(번역)Node.js Stream 당신이 알아야할 모든 것 2편](/node/2017/08/07/node-stream-you-need-to-know-2.html)

## 스트림 구현하기

노드js의 스트림을 말할때 두 가지 다른 태스트가 있습니다

* 스트림을 **구현**하는 작업
* 스트림을 **사용**하는 작업

지금까지는 스트림을 사용하는 것에 대해 말했으니까 이젠 직접 구현해 볼까요?

스트림 구현체들은 대게 `stream` 모듈을 `require` 합니다

### 쓰기 스트림 만들기

쓰기 가능한 스트림을 구현하려면 스트림 모듈의 `Writable` 생성자를 사용해야 합니다

```js
const { Writable } = require('stream')
```

많은 방법으로 쓰기 가능한 스트림을 구현할 수 있습니다. 예를들어 `Writable` 생성자를 확장하는 거죠.

```js
class myWritableStream extedns Writable {
}
```

하지만... 저는 좀 더 간단한 방법을 좋아해요. `Writable` 생성자로 객체를 생성하면서 옵션을 전달하는 거죠. 필수 옵션은 앞으로 기록될  데이터 청크(chunk)를 보내기 위한 `write` 함수 입니다.

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

이 메소드는 세 개의 인자가 필요해요.

* 스트림을 다르게 설정하지 않는다면 `chunk`는 보통 버퍼입니다.
* 위에서는 `encoding` 인자를 썼지만 보통은 무시할 수 있습니다.
* `callback`은 데이터 청크를 처리한 뒤에 호출되는 함수 입니다. 쓰기를 성공했지는 여부를 알리는 신호입니다. 실패를 알리려면 에러 객체와 함께 콜백을 호출하면 됩니다.

`outStream`에서는 간단하게 `console.log`로 청크 문자열을 출력했습니다. 성공을 알리기 위해 에러 없이 `callback`을 호출합니다. 매우 간단하지만 그렇게 유용한 *에코(echo)* 스트림은 아닙니다. 어떤 것이든 받으면  에코할 것입니다.

이 스트림을 소비하려면 읽기 스트림인 `process.stdin`을 `outStream`으로 연결하면 됩니다.

위 코드를 실행하면 여러분이 `process.stdin`으로 입력한 것은 `outStream`과 `console.log`를 이용해 에코되어 나올 것입니다.

이건 구현할만한 스트림은 아니에요. 이미 빌트인으로 구현되어 있기 때문이죠. `process.stdout`이랑 굉장이 비슷해요. `stdin`을 `stdout`으로 연결만 하면 거의 똑같은 에코 기능을 만들수 있습니다. 아래 한 줄로 말이죠.

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

위 코드를 실행하면 `inStream` 으로부터 데이터를 읽을수 있고 표준 출력으로 이것을 에코할 것입니다. 정말 간단하죠? 하지만 이것도 효율적인건 아니에요.

기본적으로 `process.stdout`하기 전에 스트림에 있는 모든 데이터를 푸시해 버릴겁니다. 더 나은 방법은 **요청이 있을 때 (on demand)** 데이터를 푸시하는 겁니다. 즉 소비자가 데이터를 달라고 요청할 대 말이죠. 읽기 스트림 설정에서 `read()` 메소드를 구현하면 그렇게 할 수 있습니다.

```js
const inStrem = new Readable({
  read(size) {
    // 데이터 요구가 있고... 누군가 이것을 읽고자 함
  }
});
```

읽기 가능한 스트림에서 `read` 메소드가 호출되면, 구현부는 일부 데이터를 큐(queue)에 푸시할 수 있습니다. 예를 들어, "A"를 나타내는 문자코드 65부터 한 글자씩 여러번 푸시해서 보낼 수 있습니다.

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

읽기 스트림을 읽는 동안 `read` 메소드는 계속 실행되고 더 많은 문자를 푸시할 것입니다. 언젠가는 이 사이클을 멈춰야하는데 이게 바로 if 문이 currentCharCode가 90("Z")보다 클때 null을 푸시하는 이유입니다.

이 코드는 먼저 만든 코드와 동일하지만의 소비자가 요청할 때만 데이터를 푸시할 수 있게 되었습니다. 항상 이렇게 구현해야 합니다.

### Duplex/Transform 스트림 만들기

듀플렉스 스트림을 이용하면 한 객체로 읽기/쓰기 가능한 스트림을 만들 수 있습니다. 두 인터페이스로부터 상속한 것 처럼 말이죠.

위에 구했던 쓰기 스트림과 읽기 스트림을 합친 듀플렉스 예제가 아래 있습니다.

```js
const { Duplex } = require('stream');

const inoutStream = new Duplex({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  },

  read(size) {
    this.push(String.fromCharCode(this.currentCharCode++));

    if (this.currentCharCode > 90) {
      this.push(null);
    }
  }
});

inoutStream.currentCharCode = 65;

process.stdin.pipe(inoutStream).pipe(process.stdout);
```

메도드를 조합해서 A에서 Z까지의 문자를 읽고 이것을 에코하는 듀플렉스 스트림을 사용할 수 있게 되었습니다. 에코 기능을 사용하기 위해 읽기 가능한 `stdin` 스트림을 이 듀플렉스 스트림으로 연결했습니다. 그리고 듀플렉스 스트림을 읽기 가능한 `stdout` 스트림으로 연결해서 A부터 Z까지 문자를 출력할 수 있습니다.

듀플렉스 스트림의 읽기/쓰기 가능한 면이 다른 것으로부터 완전히 독립적으로 동작한다는 것을 이해하는 것이 중요합니다. 이것 두 개 기능을 하나의 객체로 그룹핑한 것일 뿐입니다.

트랜스폼 스트림은 듀플렉스 스트림보다 더 재밌는데 입력으로부터 출력이 계산되기 때문입니다.

트랜스폼 스트림을 만들 때는 `read`나 `write` 메소드를 구현할 필요가 없습니다. 이 둘을 결합한 `transform` 메소드만 구현하면 됩니다. `write` 메소드의 시그니처를 가지고 있고 데이터를 `push` 할 수 있습니다.

아래는 입력한 데이터를 대문자로 변경한 뒤 에코하는 간단한 트랜스폼 스트림입니다.

```js
const { Transform } = require('stream');

const upperCaseTr = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

process.stdin.pipe(upperCaseTr).pipe(process.stdout);
```

이전 듀플렉스 스트림 예제와 완전히 똑같이 동작하는 트랜스폼 스트림에서 `transform()` 메소드만 구현하면 됩니다. 이 메소드에서는  `chunk`를 대문자로 변경하고 읽기 가능한 부분으로 `push` 하고 있습니다.

### 스트림 오브젝트 모드

기본적으로 스트림은 버퍼(Buffer)와 문자열(String) 값을 기대합니다. `objectMode` 플래그가 있는데 자바스크립트 오브젝트를 허용하기  위해 사용할 수 있습니다.

이것을 설명하는 간단한 예제를 살펴 보죠. 트랜스폼 스트림의 조합은 콤마로 구분된 문자열을 자바스크립트 오브젝트로 맵(map)하기 위한 기능을 만듭니다. 그래서 `"a,b,c,d"`가 `{a: b, c: d}`가 되는 것이죠.

```js
const { Transform } = require('stream');

const commaSplitter = new Transform({
  readableObjectMode: true,

  transform(chunk, encoding, callback) {
    this.push(chunk.toString().trim().split(','));
    callback();
  }
});

const arrayToObject = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    const obj = {};
    for (let i=0; i < chunk.length; i+=2) {
      obj[chunk[i]] = chunk[i+1];
    }
    this.push(obj);
    callback();
  }
});

const objectToString = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk) + '\n');
    callback();
  }
});

process.stdin
  .pipe(commaSplitter)
  .pipe(arrayToObject)
  .pipe(objectToString)
  .pipe(process.stdout)
```

`"a,b,c,d"` 같은 입력 문자열을 `commaSplitter`로 보냅니다. 이것은 읽기 가능한 데이터로 `["a", "b", "c", "d"]` 배열을 푸시 합니다. 우리는 문자열이 아닌 객체를 푸시 할거니깐 `readableObjectMode` 플래그를 추가해야 합니다.

그리고나서 배열을 얻고 `arrayToObject` 스트림으로 연결합니다. 객체를 받기 위해서 `writableObjectMode` 플래그가 필요하죠. 이건 다시 객체(배열 객체로 매핑한)를 푸시할 것이고 `readableObjectMode` 플래그가 필요한 이유입니다. 마지막 `objectToString` 스트림은 객체를 받지만 문자열을 푸시합니다. 때문에 `writableObjectMode` 플래그만 필요합니다. 읽기 가능한 부분은 일반 문자열(문자열화된 객체)입니다.

![Usage of the example avobe](https://cdn-images-1.medium.com/max/1600/1*u2kQzUD0ruPpt-xx0UOHoA.png)

### 빌트인 트랜스폼 스트림

노드는 매우 쓸만한 빌트인 트랜스폼 스트림을 가지고 있습니다. 이름하야 zip과 crypto 스트림이죠.

아래는 파일 압축 스크립트를 생성하기 위해 `fs` 읽기/쓰기 가능한 스트림과 함께 `zlib.crateGzip()` 스트림을 함께 사용하는 예제입니다.

```js
const fs = require('js');
const zlib = require('zlib');
const file = procdss.argv[2];

fs.createReadString(file)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteString(file + '.gz'));
```

인자로 전달한 파일을 gzip으로 압축하기 위해 이 스크립트를 사용할 수 있습니다. 파일을 zlib 빌트인 트랜스폼 스트림으로 넣기 위해 읽기  스트림을 연결했고, 새로운 gzip 파일을 위해 읽기 스트림을 연결했습니다. 간단하죠?

파이프를 사용하는 것이 멋진 이유는 필요하다면 이벤트와 함께 구성할 수 있다는 점이죠. 예를들어, 스크립트가 돌아가는 중에는 상태를 유저에게 보이고 완료되면 "Done" 메세지를 보이게 하고 싶습니다. `pipe` 메소드가 마지막 스트림을 리턴하기 때문에 이벤트 핸들러 등록을 체인(chain) 할수 있습니다.

```js
const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .on('data', () => process.stdout.write('.'))
  .pipe(fs.createWriteStream(file + '.gz'))
  .on('finish', () => console.log('Done'));
```

`pipe` 메소드와 함께 스트림을 쉽게 소비할 수 있지만, 여전히 필요에 따라 이벤트를 이용해 스트림과의 상호작용을 더 커스터마이징 하고 싶습니다.

`pipe` 메소드의 위대한 점은 프로그램을 조각 조각 *구성(compose)*해서 읽기 쉽게 만들수 있다는 점입니다. 예를들어 위처럼 `data` 이벤트를 리스닝하는 대신, 진행 상태를 리포팅하기 위해 간단한 트랜스폼 스트림을 만들수 있습니다. 그리고 `.on()` 호출 대신에 또 다른 `.pipe()`를 호출합니다.

```js
const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];

const { Transform } = require('stream');

const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write('.');
    callback(null, chunk);
  }
});

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + '.zz'))
  .on('finish', () => console.log('Done'));
```

이 `reportProgess` 스트림은 단순히 스트림을 그대로 통과시키기만 하지만, 진행 상태 정보를 표준 출력으로 보고해 줍니다. `transform()` 메소드 안으로 데이터를 푸시하기 위해 어떻게 `callback()` 함수의 두번째 인자를 사용하는지 주목해 보세요. 데이터를 푸시하는 것과 같습니다.

스트림을 결합하는 어플리케이션은 끝이 없습니다. 예를 들어, gzip 압축 전이나 후에 파일을 암호화해야 할 필요가 있다면, 또 다른 트랜스폼 스트림을 같은 순서로 연결하면 됩니다. 노드의 `crypto` 모듈을 그렇게 사용할 수 있습니다.

```js
const crypto = require('crypto');
// ...

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(crypto.createCipher('aes192', 'a_secret'))
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + '.zz'))
  .on('finish', () => console.log('Done'));
```

이 스크립트는 압축 후 전달된 파일을 암호화하고 시크릿이 있는 사용자만 생성된 파일을 사용할 수 있습니다. 암호화 되었기 때문에 보통의 unzip 유틸리티로는 압축을 풀 수 없습니다.

실제로 위 스크립트로 압축된 파일을 풀기 위해서는 crypto와 zlib의 역순 스트림이 필요합니다. 간단해요.

```js
fs.createReadStream(file)
  .pipe(crypto.createDecipher('aes192', 'a_secret'))
  .pipe(zlib.createGunzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file.slice(0, -3))
  .on('finish', () => console.log('Done'));
```

전달된 파일이 압축된 버전이라고 가정하면, 위 코드는 이것으로부터 읽기 스트림을 생성할 것이고, 동일한 시크릿을 이용해 `createDeciphoer()` 스트림과 연결할 것입니다. 그리고 `createGunzip()` 스트림으로 출력을 연결하고, 확장자 부분을 제거하고 파일을 출력할 것입니다.

여기까지가 이번 주제입니다. 읽어 주셔서 감사합니다! 다음에 봐요!