---
title: '[Node.js코드랩] 5.커스텀 모듈 Debug'
layout: post
summary: Debug 모듈을 만듭니다 
seriesId: 20181201
category: series
---

## 🌳목표 

노드에서 꽤 많이 사용되는 debug 모듈을 직접 만들어 봅니다. 

## Debug를 사용하는 이유 

[Debug](https://github.com/visionmedia/debug) 모듈은 노드에서 가장 많이 사용하는 디버깅 모듈입니다. 
로그를 구조적으로 기록할 수 있다는 점에서 console.log 보다 뛰어납니다.
Debug가 갖고 있는 장점은 아래 두 가지입니다.
- 태그를 지정한 로그 함수를 만들 수 있다 
- 태그별로 색상을 줘서 로그 식별이 수월하다  

사용 방법은 아래처럼 간단합니다. 

```js
const debug = require('debug')('my_tag')
debug('my_log') // "my_tag my_log"
```

이것을 직접 만들어 보겠습니다.

## 테스트 코드 

테스트를 코드가 있는 브랜치로 이동하겠습니다.

```
$ git checkout -f module/debug-spec
```

utils/debug.spec.js에 있는 테스트 코드를 살펴 보지요. 
네 부분으로 나누어 설명하겠습니다.

```js
require('should');
const sinon = require('sinon');
const debug = require('./debug');

describe('debug', () => {
  describe('생성', () => {
    it('태그명을 인자로 받는다 (없으면 예외를 던진다)', () => {
      should(() => debug()).throw();
    })
```

필요한 모듈을 가져와서 상수에 할당했습니다.
debug 모듈의 생성 시점의 기능을 테스트하는 코드인데 태그명을 인자로 받도록 합니다.
만약 태그 인자가 없으면 예외를 던지도록 했죠. 

```js
    it('함수를 반환한다', () => {
      const debug = require('./debug')('mytag');
      should(typeof debug).be.equal('function');
    })
  })
```

태그를 전달한 함수는 다시 함수를 반환하는지 typeof로 체크했습니다.

```js 
  describe('반환된 함수', () => {
    let debug, tag, msg;

    beforeEach(() => {
      tag = 'mytag';
      debug = require('./debug')(tag);
      msg = 'my log message';
    })

    it('tag + message 형식의 로그 문자열을 반환한다', () => {
      const expected = `${tag} ${msg}`;
      const actual = debug(msg);
      actual.should.be.equal(expected);
    })
```

이것은 반환된 함수를 테스트하는 코드입니다.

모카 프레임웍에서 제공하는 beforeEach() 함수는 테스트 케이스(it) 실행 전마다 동작합니다.
 매 테스트케이스에서 debug 객체를 만들기 때문에 중복 코드를 이곳에 모아논 것이죠. 
DRY함은 테스트 코드에서도 예외일 수 없습니다.

반환한 함수에 메세지(msg)를 전달해 실행하면 tag + msg 문자열이 반환되는지 점검하는 코드입니다.

```js
  it('로그 문자열을 인자로 console.log 함수를 실행한다', () => {
    sinon.spy(console, 'log');
    const expected = `${tag} ${msg}`;

    debug(msg);

    sinon.assert.calledWith(console.log, expected);
  })
})
```

sinon 라이브러리를 이용해서 console.log 메소드에 스파이를 심었습니다.
그리고 dubug(msg)를 실행했을 때 기대하는 문자열이 console.log 함수 인자로 전달되는지 점검하는 코드입니다. 

## 🐤실습 - debug 모듈을 만들어 봅니다 

위 테스트 코드에서 요구하는 debug 모듈을 만들어 보세요.

## 🐤풀이 

잘 풀어 보셨나요? 
utils/debug.js 파일을 새로 만들어 같이 확인해 보겠습니다.

```js
const debug = tag => {
  if (!tag) throw Error('tag should be required')
}

module.exports = debug
```

먼저 debug를 tag 인자를 받는 함수로 정의 했습니다. 
인자가 없으면 바로 에러를 던지도록 해서 첫 번째 테스트 케이스를 통과하도록 했구요. 
마지막엔 역시 모듈로 노출하였습니다.

```js
const debug = tag => {
  // ... 
  return msg => {
    const logString = `${tag} ${msg}`;
    console.log(logString);
    return logString;
  }
// ...
```

debug 함수는 다시 함수를 반환하도록 했죠. 그래서 msg를 인자로 받는 함수를 정의했습니다.
그런 뒤 클로져로 캡쳐된 tag 값과 msg를 조합해서 로그 문자열(logString)을 만듭니다.
이 값은 console.log와 반환 값으로 사용하였습니다. 

그럼 테스트를 돌려 볼까요? 

```
$ npm test

debug
    생성
      ✓ 태그명을 인자로 받는다 (없으면 예외를 던진다)
      ✓ 함수를 반환한다
    반환된 함수
      ✓ tag + message 형식의 로그 문자열을 반환한다
      ✓ 로그 문자열을 인자로 console.log 함수를 실행한다
    메세지 출력함수
      ✓ _log() 함수 결과문자열을 console.log()함수의 인자로 전달하여 실행한다
```

모든 테스트 케이스에 통과했습니다. 

## 🐤실습-색상도 추가해 보세요 

태크 문자 색상을 랜덤으로 출력하도록 debug 모듈을 개선해 보세요.

*힌트: [스택오버플로우 How to change node.js's console font color](https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color?answertab=active#tab-top)*

## 🐤풀이

힌트가 도움이 되었나요? 그럼 uitls/debug.js를 같이 개선해 보겠습니다.

문자에 색상을 추가하려면 다음과 같은 형식이어야 합니다.

```
문자코드 + 문자 + 리셋코드
```

따라서 우리 코드 상단에 아래와 같이 색상 정보를 추가합니다.

```js
const colors = [
  {name: 'cyan',     value: '\x1b[36m'},
  {name: 'yellow',   value: '\x1b[33m'},
  {name: 'red',      value: '\x1b[31m'},
  {name: 'green',    value: '\x1b[32m'},
  {name: 'magenta',  value: '\x1b[35m'},
]
const resetColor = '\x1b[0m'
```

힌트에서 언급한 것 처럼 색상 코드를 딕셔너리로 만들었습니다. 
그리고 resetColor도 따로 상수로 두었구요. 

```js
const debug = tag => {
  const randIdx = Math.floor(Math.random() * colors.length) % colors.length
  const color = colors[randIdx]
```

태그 인자를 받자마자 태그의 색상을 정하기 위해 colors 배열에서 랜덤으로 인덱스를 구하는 코드 입니다.
마지막 color 상수에는 name, value를 가지는 컬러 객체가 랜덤으로 저장 되겠지요. 

```js
  return msg => {
    const logString = `${color.value}[${tag}]${resetColor} ${msg}`;
    console.log(logString);
    return logString;
  }
```

반환된 함수에서 이 랜덤 색상 객체를 사용합니다.
logString을 만들때 태그 문자열만 색상을 지정했습니다. 

## Debug 활용 

우리 어플리케이션 코드에 이 debug 모듈을 이용해서 로그를 남겨 봅시다. 

```js
// app.js
const debug = require('../utils/debug')('app')
// ...

debug('app is initiated')
```

```js
// bin.js
const debug = require('./utils/debug')('bin')
// ...

app.listen(port, hostname, () => {
  debug(`Server running at http://${hostname}:${port}/`);
```

```js
// src/Application.js
const debug = require('../utils/debug')('Application')
// ...

  const listen = (port = 3000, hostname = '127.0.0.1', fn) => {
    _server.listen(port, hostname, fn)
    debug('server is listening')
  }
```

서버를 실행하면 다음과 같이 예쁜 모양의 로그가 색상 별로 나오는 걸 확인할수 있습니다.

```
$ npm start
```

![](/assets/imgs/2018/12/05/debug.png)

Debug 모듈은 아래 써드 파티 라이브러리 부분입니다.

![](/assets/imgs/2018/12/05/struct.png)



## 정리 

* 커스텀 모듈인 debug를 만들었습니다. 
* 태그와 색상으로 로깅 기능을 개선하였습니다.


[목차 바로가기](/series/2018/12/01/node-web-0_index.html)