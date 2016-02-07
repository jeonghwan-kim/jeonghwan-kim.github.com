---
id: 216
title: Hapi Api 서버 스캐폴드
date: 2015-02-22T12:00:26+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=216
permalink: /hapi-api-server-scaffold/
Layout:
  - default
categories:
  - Hapi.js
  - Node.js
tags:
  - dao
  - hapi
  - node-mysql
  - scaffold
---
Hapi 프레임웍을 이용해 Api 서버를 구현할 때 필요한 최소한의 기능은 이렇다.

<ul>
    <li>라우팅: 각 리소스를 폴더 형식으로 구조화 한다.</li>
    <li>파라매터 검증: 라우팅 별로 구분된 폴더 안에 각 프로토콜별로 파라매터 검증 로직을 구현한다. (*.valid.js) Hapi에서 제공하는 Joi 모듈을 사용한다.</li>
    <li>비지니스 로직: 각 라우팅에 해당하는 로직을 구현한다. 폴더 별로 *.ctrl.js 파일로 구현한다.</li>
    <li>유닛 테스트: 각 프로토콜 단위로 유닛테스트 코드를 작성하므로 각 폴더에 *.spec.js 파일로 구현한다.</li>
</ul>

예를들어 /users 라우팅시 아래와 같은 폴더 구조로 만들 수 있다.

<pre class="striped:false marking:false nums:false nums-toggle:false lang:default decode:true" title="/users 라우팅시 폴터 구조 ">app

⌊ routes

  ⌊ users

    ⌊ index.js: /users 라우팅을 등록한다.

    ⌊ users.valid.js: /users 프로토콜의 파라매터를 검증한다.

    ⌊ users.ctrl.js: /users 프로토콜의 비지니스 로직을 구현한다.

    ⌊ users.spec.js: /users 프로토콜에 대한 테스트 코드를 구현한다.

</pre>

이외에 데이터베이스 연결 모듈, 로깅 모듈 등 라우팅 이외의 모듈을 components 폴더에 위치한다. 지금까지 작성한 모듈을 정리하면 아래와 같다.

<pre class="nums:false lang:default decode:true" title="components 폴더 구조 ">app

⌊ components

  ⌊ logHelper/index.js: good, good-console, good-file 모듈을 이용한 로깅 모듈 

  ⌊ routeHelper/index.js: server.route() 함수로 라우팅 설정시 하위 폴더에 대한 라우팅을 위해 server 객체를 넘겨주는 모듈

  ⌊ session/index.js: 세션 인증을 위해 hapi-auth-cookie 모듈을 이용한 인증 모듈 
</pre>

<h2>DAO</h2>

본 글에서 새로 추가할 부분이 DAO 폴더다. 각 데이터베이스 별로 Dao 라이브러리를 제공하고 있지만 이번 글에서는 node-mysql 모듈을 사용하여 쿼리를 직접 작성하면서 DAO를 구현해 보자.

프로토콜 호출시 서버의 로직을 생각해보자.

<ol>
    <li>/users 프로토콜 호출</li>
    <li>users.spec.js: 프로토콜에 대한 파라매터 검증</li>
    <li>users.ctrl.js: 프로토콜에 대한 비지니스로직.</li>
</ol>

세 번째 컨트롤러는 대부분 데이터베이스에 있는 값을 다루는 로직이다. 따라서 users.ctrl.js에서 User DAO 모듈을 호출해야한다. User DAO는 요청에 대한 적당한 쿼리를 선택하여 쿼리결과를 users.ctrl.js로 반환한다. 마지막으로 users.ctrl.js는 User DAO로 부터 수신한 쿼리 결과를 클라이언트로 전송하게 된다.

이렇게 DAO는 대부분의 컨트롤러 로직에서 사용되기 때문에 별도로 dao 폴더를 두어 userDAO 뿐만 아니라 authDAO 등 필요한만큼 구현할 수 있다.

우선 DAO를 사용한 users.ctrl.js 모듈을 살펴보자. user DAO 모듈을 불러와 각 프로토콜 핸들러 로직에 추가한다.

<pre class="lang:js decode:true" title="routes/users/users.ctrl.js">// userDao 모듈을 로딩한다. 
// 데이터베이스에 유저 관련 데이터에대해 CRUD 작업을 수행한다.
var userDao = require('../../dao/user');

exports.find = function (req, reply) {

  // 모든 유저 데이터를 조회한다. (/users GET 프로토콜에 대응)
  userDao.find(function (err, users) {
    if (err) {
      req.error(err);
      return reply(err).code(400);
    }
    
    reply({users: users});
  })
};

exports.query = function (req, reply) {

  // 한명의 유저 데이터를 조회한다. (/users/{id} GET 프로토콜에 대응)
  userDao.query(req.params.id, function (err, user) {
    if (err) {
      req.error(err);
      return reply(err).code(400);
    }

    reply({user: user});
  })
};

exports.insert = function (req, reply) {

  // 새로운 유저 데이터를 추가한다. (/users POST 프로토콜에 대응)
  userDao.insert(req.payload, function (err, users) {
    if (err) {
      req.error(err);
      return reply(err).code(400);
    }
    
    req.log('info', req.payload.name + ' is inserted.');
    reply({users: users}).code(201);
  });

};

exports.remove = function (req, reply) {

  // 한명의 유저 데이터를 삭제한다. (/users DELETE 프로토콜에 대응)
  userDao.remove(req.query.id, function (err, users) {
    if (err) {
      req.error(err);
      return reply(err).code(400);
    }

    reply({users: users});
  });
};</pre>

userDao 모듈을 살펴보자. 각 로직에 해당하는 쿼리를 로딩하여 실행한 결과를 반환한다. 보통 프로토콜은 GET/POST/PUT/DELETE로 구성되고 이에 맞게 find()/query()(id로 조회할 경우 등)/insert()/update()/remove() 함수를 DAO 모듈에 구현한다.

<pre class="lang:js decode:true" title="dao/user/index.js">var fs = require('fs');
var path = require('path');
var db = require('../../components/db');

exports.find = function (callback) {

  // 쿼리를 로딩한다.
  var q = fs.readFileSync(path.join(__dirname, 'get-users.sql'), 'utf8');

  // 로딩한 쿼리를 실행한다.
  db.query({
    sql: q, values: null, callback: function (err, data) {
      if (err) {
        return callback(err, null);
      }

      // 실행 결과를 반환한다.
      callback(null, data);
    }
  });
};

exports.query = function (userId, callback) {
  /* 쿼리 로딩 후 쿼리 실행 결과 반환 */
};

exports.insert = function (payload, callback) {
  /* 쿼리 로딩 후 쿼리 실행 결과 반환 */
};

exports.update = function (userId, payload, callback) {
  /* 쿼리 로딩 후 쿼리 실행 결과 반환 */
};

exports.remove = function (userId, callback) {
  /* 쿼리 로딩 후 쿼리 실행 결과 반환 */
};
</pre>

&nbsp;

<h2>전체 스케폴드</h2>

전체코드: <a href="https://github.com/jeonghwan-kim/hapi_study/tree/10_add-dao">https://github.com/jeonghwan-kim/hapi_study/tree/10_add-dao</a>

&nbsp;