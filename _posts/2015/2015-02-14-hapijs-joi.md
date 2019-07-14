---
id: 187
title: Hapi 파라매터 검증, Joi
date: 2015-02-14T17:43:54+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=187
permalink: /hapijs-joi/
category: series
tags:
  - hapijs
---
<a title="Hapi 시작하기" href="http://whatilearn.com/start-with-hapi/">지난 포스트</a>에서 Hapi 프레임웍을 이용한 라우팅을 구현하였고 파라메터를 얻는 방법을 잠깐 언급하였다. REST Api에서 파라메터를 입력받는 것은 비지니스 로직을 처리하기 위한 첫 단계다. 파라메터를 제대로 검증하는 것이 로직 구현에 있어 안정적이다. 익스프레스 모듈을 사용할 때는 별도로 파라메터 검증 모듈을 만들어서 사용했다. 실제 익스프레스용 검증 모듈이 있는지는 모르겠으만, 비지니스 로직과 파라메터 검증 로직이 결합(cohesion)되어 있었다는 생각이 든다. Hapi에서는 이러한 검증로직을 완전히 분리할 수 있다. 즉 프로토콜 로직에 들어가지 전에 파라매터를 검증하자는 것이다.

<a href="https://github.com/hapijs/joi">Joi</a>는 Hapi에서 검증용도로 사용하는 모듈이다. 사이트에서는 'Object schema description language and validator for JavaScript objects.'라고 설명되어 있다. 자바스크립트 객체를 검증하는 것이고 스키마를 모델링할 수 있는 언어(?)라고 설명한다. 이번 포스트에서는 Hapi 라우팅에서 파라매터 검증과 추상화된 서버 자원의 모델을 Joi 모듈을 통해 구현해 보자.

<h2>파라매터</h2>

라우팅 코드를 보자.

<pre class="theme:github lang:js decode:true">var users = ['Chris', 'Mod', 'Daniel', 'JT', 'Justin'];

server.route({
    method: 'GET',
    path:'/users/{id}',
    handler: function (req, reply) {

      // 파라메터 검증
      if (req.params.id &lt; users.length) {

        // 검증을 통과하면 로직 수행
        reply({user: users[req.params.id]});
      } else {

        // 검증 미통과시 404 에러코드 반환
        reply('No user').code(404);
      }
    }
});</pre>

/users/{id} (GET)에 대한 라우팅으로 서버자원 중 user id에 해당하는 유저 정보를 조회하는 프로토콜이다. 여기서 파라메터인 {id}는 req.params.id로 값을 읽을 수 있다. 위 코드에서는 라우팅의 핸들러 함수에서 파라메터를 검증 로직과 서버 자원을 조회하는 로직이 섞여있다. Hapi는 route() 함수에서 handler 속성 뿐만 아니라 <code>config</code> 속성을 통해 파라매터를 검증할 수 있다. 다음 코드를 보자.

<pre class="theme:github lang:js decode:true">var Joi = require('joi');

server.route({
    method: 'GET',
    path:'/users/{id}',
    handler: function (req, reply) {
      reply({user: users[req.params.id]});
    },

    // config.validate 속성에 검증 로직을 추가한다. 일종의 스키마 형태
    config: {
      validate: {
        params: {
          id: Joi.number().integer().min(0).max(users.length)
        }
      }
    }
  });</pre>

<code>config.validate</code> 속성에 자바스크립트 객체를 설정했다. 위에 설정한 것을 해석해 보면 params 중에 id라는 값을 받고 이것은 숫자형태이고 정수이며 0보다 크고 users 배열의 길이보다 작은 것이어야 한다. handler 함수는 훨씬 간결해졌다. 만약 Joi 스키마로 설정한 값과 다른 값을 입력할 경우 Hapi는 아래와 같이 에러 메세지로 응답한다. '/users/12'로 프로토콜 호출한 경우다.

<pre class="theme:github lang:default decode:true">{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "id must be less than or equal to 4",
    "validation": {
        "source": "params",
        "keys": [
            "id"
        ]
    }
}</pre>

파라매터의 종류에 따라 params, paylaod, query로 Joi 스크마를 만들어 설정할 수 있다. 자세한 내용은 글 맨아래의 전체 코드를 참고하자.

<h2>모델(Model)</h2>

REST Api는 서버자원을 어떻게 추상화하느냐에 따라 다르게 구현할수 있다. 또한 프로토콜을 호출할 때 사용하는 파라매터는 서버자원을 설명하는 속성이 될 수 있다. 예를 들어 서버 자원 중 user라는 추상화된 자원이 있다고 하자. 라우팅은 보통 /users가 될 것이다. 자원을 조회하는 프로토콜 GET을 호출할 때는 name이나 id로 조회할수 있다. 어쩌면 경우에 따라 age, gender, hometown, country, degree 등으로 조회할 수도 있다. 프로토콜 호출시 이런 정보를 넘겨주게 되는데 이것이 바로 추상화된 user를 설명하는 속성이다. (데이터베이스에 저장되는 구조와 비슷할 것이다.)

Joi를 이용하면 서버의 추상화된 user를 하나의 모델로 선언할수 있다. route() 함수에서는 이 모델의 속성을 이용해 Joi 스키마를 작성할 수 있다. 이것의 장점은 여러 프로토콜에서 user에 관한 Joi 스키마를 작성할 때 User 모델의 속성을 가져와서 재활용 할 수 있다는 것이다. 기존처럼 라우팅마다 검증 스키마를 구현할 필요가 없는 것이다.

User 모델을 Joi 로 구현해 보자.

<pre class="theme:github lang:js decode:true">/* app/models/User.js */

'use strict';

var Joi = require('joi');

exports.getSchema = function() {
  return {
    id: Joi.number().integer().min(0).max(4),
    name: Joi.string().min(2).max(20)
  };
};

</pre>

기존 라우팅 함수에서는 이 스키마를 가져다 사용한다.

<pre class="theme:github lang:js decode:true">  server.route({
    method: 'GET',
    path:'/users/{id}',
    handler: function (req, reply) {
      reply({user: users[req.params.id]});
    },
    config: {
      validate: {
        params: {

          // 미리 정의한 Joi 스키마를 활용한다.
          id: UserSchema.id.required()
        }
      }
    }
  });</pre>

<h2>로직과 검증 모듈화</h2>

로직과 검증 스크마를 추가하면서 라우팅 모듈이 복잡해졌다. Hapi의 간결한 장점은 이러한 것을 모듈화할 수 있다는 것이다. 기존 폴더를 살펴보자. 서버 자원에 대한 라우트 단위로 폴더가 쪼깨졌다. 그리고 각 폴더의 index.js 파일에서 server 객체를 받아 라우팅 설정, 검증 스키마 설정, 로직 구현 등의 코드가 들어간다. index.js 파일에 구현한 비지니스 로직을 <code>users.ctrl.js</code>로 분리, 검증 로직은 <code>users.valid.js</code>로 분리해 보자.

<pre class="theme:github lang:js decode:true">/* users.ctrl.js */

var users = ['Chris', 'Mod', 'Daniel', 'JT', 'Justin'];

exports.find = function (req, reply) {
  reply({users: users});
};

exports.query = function (req, reply) {
  reply({user: users[req.params.id]});
};

exports.insert = function (req, reply) {
  users.push(req.payload.name);
  reply({users: users});
};

exports.remove = function (req, reply) {
  users.splice(req.query.id, 1);
  reply({users: users});
};</pre>

<pre class="theme:github lang:js decode:true">/* users.valid */

var UserSchema = require('../../models/User').getSchema();

exports.query = function () {
  return {
    params: {
      id: UserSchema.id.required()
    }
  };
};

exports.insert = function () {
  return {
    payload: {
      name: UserSchema.name.required()
    }
  };
};

exports.remove = function () {
  return {
    query: {
      id: UserSchema.id.required()
    }
  };
};</pre>

컨트롤과 검증로직을 위 두개의 모듈로 분리할 수 있다. 라우팅 모듈은 아래와 같이 간결함을 유지할 수 있다.

<pre class="theme:github lang:js decode:true ">/* index.js */

var ctrl = require('./users.ctrl.js');
var valid = require('./users.valid.js');

module.exports = function (server) {

  server.route({
    method: 'GET',
    path:'/users',
    handler: ctrl.find
  });

  server.route({
    method: 'GET',
    path:'/users/{id}',
    handler: ctrl.query,
    config: { validate: valid.query() }
  });

  server.route({
    method: 'POST',
    path:'/users',
    handler: ctrl.insert,
    config: { validate: valid.insert() }
  });

  server.route({
    method: 'DELETE',
    path:'/users',
    handler: ctrl.remove,
    config: { validate: valid.remove() }
  });

};</pre>

이제는 자원에 해당하는 각 라우팅 폴더에 세 가지 파일을 만들자.

<ol>
    <li>`index.js`:  server 객체를 넘겨 받아 자원에 대한 라우팅 설정</li>
    <li>`*.ctrl.js`: 라우팅에 대한 로직 구현</li>
    <li>`*.valid.js`: 파라메터에 대한 검증 스키마</li>
</ol>

전체 코드: <a href="https://github.com/jeonghwan-kim/hapi_study/tree/06_joi_and_ctrl_valid">https://github.com/jeonghwan-kim/hapi_study/tree/06_joi_and_ctrl_valid</a>

&nbsp;

🗂 [목차 바로가기](/series/2015/02/13/hapijs-index.html)