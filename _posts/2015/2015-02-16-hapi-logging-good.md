---
id: 192
title: Hapi 로깅, Good
date: 2015-02-16T10:23:33+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=192
permalink: /hapi-logging-good/
category: series
tags:
  - hapijs
---
익스프레스에 winton 로깅 모듈이 있듯이 Hapi에서는 <a href="https://github.com/hapijs/good">Good</a>이라는 좋은 로깅 모듈이 있다. 이번 글에서는 Hapi 프레임웍에서의 로깅 방법에 대해 알아보자.

Good 모듈로 로깅시 리포터 모듈을 함께 추가해야한다. Good 모듈은 hapi 프레임웍에서 내뿜는 이벤트를 감지하는 역할을 하는 것 같다. 실제 출력(콘솔이나 파일 등)은 리포터 모듈을 통해 동작하는 것이다. 출력 방식에 따라 아래와 같은 리포터 모듈을 사용할 수 있다.

<ul>
    <li><a href="https://github.com/hapijs/good-console">good-console</a>: 콘솔에 출력</li>
    <li><a href="https://github.com/hapijs/good-file">good-file</a>: 파일에 출력</li>
    <li><a href="https://github.com/hapijs/good-http">good-http</a>: 네트웍으로 출력 (전송)</li>
</ul>

<h2>logHelper</h2>

<a href="https://github.com/hapijs/good">예제</a>에 나온 코드를 app/components/logHelper/index.js 모듈로 분리해 보자.

<pre class="lang:js decode:true">'use strict';

var path = require('path');

var opts = {
  opsInterval: 1000,
  reporters  : [{
    reporter: require('good-console'),
    args    : [{
      request: '*',
      response: '*',
      log: '*',
      error: '*'
    }]
  }, {
    reporter: require('good-file'),
    args    : [{
      path     : path.join(__dirname, '../../../logs'),
      format   : 'YYYYMMDD-hhmmss',
      prefix   : 'hapi',
      extension: 'log',
      rotate   : 'daily'
    }, {
      request: '*',
      response: '*',
      log: '*',
      error: '*'
    }]
  }]
};

module.exports = function (server) {
  server.register({
    register: require('good'),
    options : opts
  }, function (err) {
    if (err) {
      throw err;
    }
  });
};
</pre>

파일과 콘솔에 로그를 출력하도록 설정했다. 설정한 로그타입은 총 네 가지.

<ul>
    <li>request: 프로토콜 요청시 로그 출력. 파라매터 값, 클라이언트 정보 등을 표시한다.</li>
    <li>response: 요청에 한 응답시 로그 출력. http 상태 코드, 수행 시간 등을 표시한다.</li>
    <li>log: 코드 사이 사이에 입력한 로그를 출력한다.</li>
    <li>error: http 상태코드 5xx인 것만 로깅한다.</li>
</ul>

<h2>로그 함수</h2>

console.log()로 출력하면 로그 메세지가 제대로 출력되지 않는다. Hapi에서 제공하는 server객체나 request 객체의 log() 함수로 로깅하도록 되어 있다(<a href="http://hapijs.com/tutorials/logging">참고</a>). log() 함수는 총 3개의 파라매터를 받는다. <code>log(tag, message, timestamp)</code>

<ul>
    <li>tag: 로깅 태그</li>
    <li>messgae: 로깅할 문자열 혹은 자바스크립트 객체</li>
    <li>timestamp: 로깅 시간, default: Date.now()</li>
</ul>

<pre class="lang:js decode:true " title="로깅 예제 ">exports.insert = function (req, reply) {
  users.push(req.payload.name);

  // 로깅 예제
  req.log('info', req.payload.name + ' is inserted.');

  reply({users: users});
};
</pre>

/users (post) 라우팅 로직 안에 위와 같이 로그를 뿌리도록 설정한다. 아래는 콘솔에선 보는 로그 화면이다. 파일도 동일하게 동작한다.

<pre class="lang:sh decode:true " title="로깅 출력 ">150216/011404.736, [request,info], data: asdf is inserted.
150216/011404.732, [response], http://localhost:8000: post /users {} 200 (7ms)
</pre>

전체 코드: <a href="https://github.com/jeonghwan-kim/hapi_study/tree/07_good">https://github.com/jeonghwan-kim/hapi_study/tree/07_good</a>

🗂 [목차 바로가기](/series/2015/02/13/hapijs-index.html)
