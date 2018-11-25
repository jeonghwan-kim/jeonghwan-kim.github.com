---
title: 'Nock, Mocha로 HTTP 테스트하기'
layout: post
category: dev
tags:
  - nock
  - mocha
  - nodejs
  - unit-test
permalink: /2016/02/28/http-test-with-nock-mocha.html
---

API 서버를 개발할 때 유닛테스트를 꼼꼼히 작성하는 편이다. 반복적인 작업임은 물론이고 '이럴 경우도
테스트 해야할까?'라는 의문이 들때가 많다. 그러나 이러한 생각에도 불구하고 생각나는 모든 경우의
테스트 코드를 작성하고 테스트를 돌리면 심리적으로 안정감이 들뿐만 아니라 코드에 대한 자신감도 생기기 때문에
모든 API 테스트 코드를 작성하려고 노력한다.

서비스 내에서 처리하는 로직은 테스트 하기가 쉽다. 모든 환경을 내가 제어할 수 있기 때문이다.
그러나 만약 외부 API 사용하는 경우에는 어떨까? 테스트하기가 좀 까다로운데 이유는 이렇다.

1. 외부 API가 수시로 변경되는 경우가 발생할 수 있다.
2. 전체 테스트 속도가 느려진다.


## Sinon vs Nock

그동안 http 요청을 사용하는 프로그램을 테스트할 때 [Sinon](http://sinonjs.org)를 사용했다.
Sinon은 자바스크립트용 라이브러리라서 HTTP MOCK 외에도 다양한 기능을 제공하는 라이브러리다.
사실 원하는 것 이상의 것을 제공하기 때문에 적합하지는 않았다.

NodeJS에서 사용하는 것 중 [Nock](https://github.com/pgte/nock)을 발견했다.
이것은 HTTP 요청에 대해 Mock 데이터를 정의하는 용도다.
NodeJS 테스트 도구인 Mocha를 이용해서 외부 HTTP 요청을 테스트하는 방법에 대해 알아보자.


## Nock으로 HTTP 테스트하기  

npm으로 nock 모듈을 설치하고 프로젝트에 추가한다.

```
$ npm install nock --save-dev
```

테스트 유닛을 작성한다. `POST /auth/facebook`이라는 API를 테스트할 것이다.
이 API는 페이스북 인증 API를 사용하여 인증 로직을 구현하는 기능을 한다.

```javascript
describe('POST /auth/facebook', function () {
  it('should login by facebook', function (done) {
    request(app)
      .post('/auth/facebook')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        res.body.should.be.type('object').and.have.property(/*...*/);
        done();
      });
  });
});
```

내부적으로 페이스북 인증 API를 사용하기 때문에 HTTP 요청이 발생할 것이다.
우리는 페이스북 API로 가는 HTTP 요청을 nock을 이용해 Mocking 할 것이다.  

```javascript
var nock = require('nock');

before('Build up facebook api mock', function () {
  var mock;

  // Mock 데이터를 정의한다. 이 데이터가 페이스북 인증 API 결과이다.
  mock = {
    username: 'Facebook User Name'
    id: 'Facebook User Id'
    profile: 'Facebook User Profile Image'
  };

  // 페이스북 인증 API에 대해 Mock 데이터를 설정한다.
  nock('https://facebook')
    .post('/auth/api')
    .replay(200, mock);
});

after('Clean up facebook api mock', function () {
  // nock 설정을 해제한다
  nock.cleanAll();
});
```

테스트 실행 전에 Nock을 이용해 페이스북 인증 API에 대한 Mock 데이터를 설정한다.
테스트가 실행되면 페이스북 인증 API를 위한 HTTP 리퀘스트가 발생할 것이고, 위에서 설정한
Mock 데이터로 응답할 것이다. 테스트가 종료되면 `nock.cleanAll()`로 Mock 설정을
해제한다.

이제 테스트 케이스에서 nock으로 설정한 HTTP Mock 데이터를 가지고 검증할 수 있다


```javascript
it('should login by facebook', function (done) {
  request(app)
    .post('/auth/facebook')
    .expect(200)
    .end(function (err, res) {
      if (err) throw err;
      res.body.should.be.type('object')
      res.body.should.have.property('username', 'Facebook User Name');
      res.body.should.have.property('id', 'Facebook User Id');
      res.body.should.have.property('profile', 'Facebook User Profile Image');
      done();
    });
});
```


## 에러 테스트

요청한 HTTP가 에러를 응답한다면 어떻게 해야할까?
`replayWithError()` 함수로 에러 응답을 흉내낼 수 있다    

```javascript
nock('https://facebook')
    .post('/auth/api')
    .replayWithError();
```
