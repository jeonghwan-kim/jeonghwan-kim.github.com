---
title: '[Node.js코드랩] 8.미들웨어'
layout: post
summary: 미들웨어 패턴을 구현합니다
category: series
seriesId: 20181201
tags: [lecture]
---

## 🌳목표

미들웨어 패턴을 구현하여 serve-static 모듈의 문제를 해결합니다.

## 미들웨어 패턴

서버는 요청에서부터 응답까지 하나의 흐름을 가지고 있습니다. 이 요청과 응답 사이에 실행되는 함수 목록을 우리는 "미들웨어 함수"라고 하겠습니다.

미들웨어 함수는 본연의 역할을 한 뒤 두 가지 일을 할 수 있습니다. ▲ 요청한 클라이언트에게 응답 하거나 ▲ 다음 미들웨어 함수를 호출하는 것이죠. 후자일 경우 현재 미들웨어 함수의 결과 값을 다음 미들웨어 함수의 인자로 전달하는 구조입니다.

머릿속 이미지와 아래 그림이 같다면 제대로 이해하신 겁니다.

![](/assets/imgs/2018/12/08/middleware.png)

어플리케이션 단에서 미들웨어 함수를 등록하는 부분과, 요청이 올때 등록된 미들웨어 함수 모두를 실행하는 것이 주요 알고리즘입니다.

각각 슈도 코드로 나타내면 다음과 같습니다.

미들웨어 등록:

```js
const middlewares = []
const use = fn => middlewares.push(fn)
```

미들웨어 실행:

```js
let next = null
const run = () => middlewares.forEach(mw => {
  next = mw(next)
})
```

익스프레스JS의 미들웨어가 궁금하시다면 여기를 [미리](https://expressjs.com/ko/guide/writing-middleware.html) 보셔도 좋습니다.

## Middleware 모듈

위에서 말한 미들웨어를 우리 구조에 맞게 구현해 보도록 하겠습니다.
먼저 지난 시간까지 작성한 코드와 미들웨어 테스트 코드가 있는 브랜치로 체크아웃 할게요.

```
$ git checkout -f middleware/spec
```

src/Middleware.spec.js 파일에 미들웨어 요구사항이 적인 테스트 코드가 있습니다.

모두 다섯 부분으로 나누어 코드를 설명하겠습니다.

```js
require('should');
const sinon = require('sinon');
const Middleware = require('./Middleware');

describe('Middleware', () => {
  let middleware;
  beforeEach(()=> {
    middleware = Middleware();
  })

  it('초기 미들웨어 갯수는 0개이다', () => {
    middleware._middlewares.length.should.be.equal(0);
  })
```

테스트 관련한 라이브러리와 테스트 대상인 Middleware 모듈을 가져옵니다.
물론 Middleware는 아직 만들지 않았구요.

beforeEach에서 미들웨어 모듈을 이용해 미들웨어 인스턴스를 하나 만들었습니다.

첫번째 테스트 케이스는 **"초기 미들웨어 갯수는 0개이다"**라는 요구사항을 테스트했습니다.
middleware 인스턴스의 테스트 전용 속성인 _middlewares를 통해 배열의 길이가 0인이 확인하고 있죠?

```js
  describe('add()', () => {
    it('배열에 미들웨어 함수를 추가한다', () => {
      const fns = [
        ()=>{},
        ()=>{},
        ()=>{},
      ]

      fns.forEach(fn => middleware.add(fn));

      middleware._middlewares.length.should.be.equal(fns.length)
    })
  });
```

두번째 테스트케이스는 **"배열에 미들웨어 함수를 추가한다"**라는 요구사항을 테스트 했습니다. 미리 빈 미들웨어 함수 3개를 만들어 fns 배열에 저장하고 이것을 middleware.add() 메소드로 등록했습니다. 우리가 구현할 모듈은 add() 메소드를 가져야하겠죠?

메소드 실행 결과 배열의 길이가 3인지 확인합니다.

```js
  describe('run()', () => {
    it('미들웨어 함수를 실행한다', () => {
      const stub = {
        mw1() {},
        mw2() {}
      };
      sinon.stub(stub, 'mw1').callsFake((req, res, next) => next());
      sinon.stub(stub, 'mw2').callsFake((req, res, next) => next());

      const fns = [
        stub.mw1,
        stub.mw2,
      ]
      fns.forEach(fn => middleware.add(fn));

      middleware.run();

      fns.forEach(fn => {
        should(fn.called).be.equal(true)
      })
    })
```

세번째 테스는 시논 라이브러리의 stub 함수를 이용했습니다.
스텁이란 진짜처럼 동작하는 테스트용 메소드인데요 여기서는 미들웨어함수 mw1, mw2에 스텁을 만들었습니다.

이 함수는 req, res, next라는 인자 세 개를 받고 마지막 인자를 실행(invoke)하는 코드입니다.
이건 미리 우리가 미들웨어를 어떻게 사용할지 정의한 것입니다. 우리는 이런 식으로 미들웨어를 사용할 것이고 실제 미들웨어도 그렇게 구현해야겠지요.

그리고 나서 add()로 미들웨어를 등록하고 run() 메소드를 실행합니다.
이 메소드도 우리가 구현해야겠죠.

메소드 실행 결과 모든 스텁이 실행되었는지 점검했습니다. 즉 **"run()은 모든 미들웨어 함수를 실행한다"**라는 요구사항을 테스트하는 것이지요.

```js
    it('next를 호출하지 않는 미들웨어가 있으면 함수 체인을 즉시 중지한다', () => {
      const stub = {
        mw1() {},
        mwWillStop() {}, // next를 호출하지 않는 미들웨어
        mw2() {}
      };
      sinon.stub(stub, 'mw1').callsFake((req, res, next) => next());
      sinon.stub(stub, 'mwWillStop').callsFake(() => null);
      sinon.stub(stub, 'mw2').callsFake((req, res, next) => next());

      const fns = [
        stub.mw1,
        stub.mwWillStop,
        stub.mw2,
      ]
      fns.forEach(fn => middleware.add(fn));

      middleware.run();

      fns.forEach((fn, idx) => {
        const shouldInvoked = idx < 2
        should(fn.called).be.equal(shouldInvoked)
      });
    });
```

이전 테스트와 비슷한데 예외 기능을 테스트합니다. **"미들웨어 함수가 next()를 호출하지 않을 경우 전체 미들웨어를 즉시 중단한다"**라는 요구사항이죠.
두번째 미들웨어 스텁 mwWillStop은 다른 미들웨어와 달리 next()를 호출하지 않습니다.

add()로 미들웨어를 등록하고 run()으로 실행했습니다.

마지막엔 두 번째 미들웨어만 실행되었는지 점검합니다.

```js
    it('에러 발생시 에러 미들웨어만 실행한다', () => {
      const stub = {
        mw1(req, res, next) {},
        mwWillThrow(req, res, next) {}, // 에러 발생 미들웨어
        mw2(req, res, next) {},
        mwWillCatchError(err, req, res, next) {} // 에러 처리 미들웨어
      };
      sinon.stub(stub, 'mw1').callsFake((req, res, next) => next());
      sinon.stub(stub, 'mwWillThrow').callsFake((req, res, next) => next(Error()));
      sinon.stub(stub, 'mw2').callsFake((req, res, next) => next());
      sinon.stub(stub, 'mwWillCatchError').callsFake((err, req, res, next) => null);

      const fns = [
        stub.mw1,
        stub.mwWillThrow,
        stub.mw2,
        stub.mwWillCatchError,
      ]
      fns.forEach(fn => middleware.add(fn));

      middleware.run();

      fns.forEach((fn, idx) => {
        const shouldInvoked = idx !== 2;
        should(fn.called).be.equal(shouldInvoked)
      });
    })
  })
});
```

마지막 테스트 코드입니다. 가장 길지만 그래도 꾹 참고 읽어보시길 바랍니다.

**"에러 발생시 에러 미들웨어만 실행한다"**라는 요구사항을 테스트합니다.

익스프레스 미들웨어 문서를 읽어보셨나요? 그것은 인자 갯수에 따라 두 가지로 분류 합니다.
- **일반 미들웨어**: 인자 세 개 (req, res, next)
- **에러 미들웨어**: 인자 네 개 (err, req, res, next)

우리도 이 규칙을 따르겠습니다. 미들웨어 실행 중 에러가 발생하면 다음 미들웨어를 실행하지 않고 곧장 에러 미들웨어로 건너 뛰도록 하는 것입니다.

미들웨어 스텁을 네 개 만들었는데요 두번째 mwWillThrow 가 에러를 던지는 미들웨어이고 mwWillCatchError가 에러를 처리하는 에러 미들웨어입니다.

add()로 등록하고 run()으로 실행한뒤 3번재 미들웨어가 미실행 되었는 (두번 째에서 네 번째로 넘어갔는지) 체크하는 코드입니다.

## 🐤실습 - 1번 요구사항 구현

"초기 미들웨어 갯수는 0개이다" 라는 요구사항을 먼저 구현해 보세요.

## 🐤풀이

첫번째 요구사항은 쉽게 해결할 수 있죠?
src 폴더에 Middleware.js 파일을 만들고 아래 코드를 입력합니다.

```js
const Middleware = () => {
  const _middlewares = [];

  return {
    _middlewares,
  }
}

module.exports = Middleware;
```

_middlewares에 빈 배열을 할당하고 바로 객체로 만들어 리턴 했습니다.

테스트 코드를 돌려 볼까요?

```
$ npm test

  Middleware
    ✓ 초기 미들웨어 갯수는 0개이다
    add()
      1) 배열에 미들웨어 함수를 추가한다
    run()
      2) 미들웨어 함수를 실행한다
      3) next를 호출하지 않는 미들웨어가 있으면 함수 체인을 즉시 중지한다
      4) 에러 발생시 에러 미들웨어만 실행한다
```

첫 번째 테스트 케이스에 통과 했습니다.✅

## 🐤실습 - 2번 요구사항 구현

"add() 메소드는 배열에 미들웨어 함수를 추가한다"라는 요구사항을 구현해 보세요.

*힌트: 인자는 미들웨어 함수*

## 🐤풀이

이것도 아주 간단히 해결했습니다.

```js
  const add = fn => {
    _middlewares.push(fn)
  }

  return {
    _middlewares,
    add,
  }
```

테스트를 돌려 볼까요?

```
$ npm test

  Middleware
    ✓ 초기 미들웨어 갯수는 0개이다
    add()
      ✓ 배열에 미들웨어 함수를 추가한다
    run()
      1) 미들웨어 함수를 실행한다
      2) next를 호출하지 않는 미들웨어가 있으면 함수 체인을 즉시 중지한다
      3) 에러 발생시 에러 미들웨어만 실행한다
```

두번째 테스트 케이스까지 통과했습니다.✅

## 🐤실습 - 3번 요구사항 구현

"run() 메소드는 미들웨어 함수를 실행한다"라는 요구사항을 구현해 보세요.

*힌트: run 메소드 인자는 req와 res, 재귀함수를 사용?*

## 🐤 풀이

이번 요구사항은 좀 힘들 수도 있습니다. 재귀가 들어 가는 부분이 있어서 더욱 그렇구요.
그럼 같이 풀어 보지요. 두 부분으로 나눠 설명하겠습니다.

```js
const Middleware = () => {
   const _middlewares = [];
   const _req, _res

  const run = (req, res) => {
    _req = req;
    _res = res;

    _run(0);
  }
}
```

모든 미들웨어 함수에서 req, res 객체를 사용하기 때문에 이를 클로져 변수 _req, _res로 저장했습니다.

그리고 이 다음에 만들 _run(0) 함수를 실행합니다. 여기서 인자값은 0번(배열의 첫번째) 미들웨어를 실행한다는 의도 입니다.

```js
  const _run = i => {
    if (i < 0 || i >= _middlewares.length) return;

    const nextMw = _middlewares[i]
    const next = () => _run(i + 1)

    nextMw(_req, _res, next);
  }
```

인덱스 값이 배열 범위를 벗어날 경우 바로 함수를 종료하는 방어 코드를 작성합니다.

그리고 실행할 미들웨어를 _middlewares 배열에서 찾아 nextMw에 저장해 둡니다.

미들웨어 함수는 req, res 뿐만 아니라 다음 미들웨어 함수를 실행할 함수인(성크, thunk) next를 세 번째 인자로 받습니다. 이 함수도 만들어 next에 담아 둡니다.

마지막으로 nextMw에 _req, _res, next를 전달하여 실행합니다.

그럼 테스트를 돌려볼까요?

```
$ npm test

  Middleware
    ✓ 초기 미들웨어 갯수는 0개이다
    add()
      ✓ 배열에 미들웨어 함수를 추가한다
    run()
      ✓ 미들웨어 함수를 실행한다
      ✓ next를 호출하지 않는 미들웨어가 있으면 함수 체인을 즉시 중지한다
      1) 에러 발생시 에러 미들웨어만 실행한다
```

세 번째와 네 번째 테스트 케이스까지 모두 통과했네요.✅ 좋습니다. 일석이조에요. 👍

## 🐤실습 - 5번 요구사항 구현

"run() 메소드는 에러 발생시 에러 미들웨어만 실행한다"라는 요구사항을 구현해 보세요.

*힌트: 익스프레스 미들웨어 함수는 인자 갯수로 구별함, 다음 미들웨어 함수로 에러를 전달할 때는 next(err) 호출*

## 🐤풀이

그럼 같이 풀어보겠습니다. 두 부분으로 나눠서 설명할께요

```js
    const _run = (i, err) => {
      if (i < 0 || i >= _middlewares.length) return;

      const nextMw = _middlewares[i]
      const next = err => _run(i + 1, err)
```

next 함수를 만들에 빈 인자를 err로 채워 넣습니다. 즉 에러가 있으면 받겠다는 것이죠.

```js
      if (err) {
        const isNextErrorMw = nextMw.length === 4

        return isNextErrorMw ?
          nextMw(err, _req, _res, next) :
          _run(i + 1, err)
     }

     nextMw(_req, _res, next);
   }
```

_run 메소드의 두 번째 인자인 에러가 있을 경우 현재 미들웨어가 에러 미들웨어인지 인자 길이로 체크합니다. 길이가 4이면 에러 미들웨어인 셈이죠.

그래서 에러 미들웨어이면(isNextErrorMw) 미들웨어 함수를 실행합니다.
만약 기본 미들웨라라면 다음 미들웨어를 찾도록 _run(i + 1, err)를 실행합니다.

코드가 좀 어려워 보일지도 모르겠네요. 이해가 안된다면 차근차근 여러번 읽어 보시기 바랍니다.

그럼 저장하고 테스트를 돌려보죠.

```
$ npm test

  Middleware
    ✓ 초기 미들웨어 갯수는 0개이다
    add()
      ✓ 배열에 미들웨어 함수를 추가한다
    run()
      ✓ 미들웨어 함수를 실행한다
      ✓ next를 호출하지 않는 미들웨어가 있으면 함수 체인을 즉시 중지한다
      ✓ 에러 발생시 에러 미들웨어만 실행한다
```

드디어 모든 테스트 케이스에 통과 했습니다!✅

## 정리

* 미들웨어는 비동기 로직을 다루기 위한 패턴입니다.
* 미들웨어는 요청에서 응답 사이에서 실행되는 함수들의 목록이며 순차적으로 실행됩니다.
* 에러 미들웨어는 인자가 4개이며 어떤 미들웨어에서든이 에러가 발생되면 곧장 실행됩니다.


[목차 바로가기](/series/2018/12/01/node-web-0_index.html)