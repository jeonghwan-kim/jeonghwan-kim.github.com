---
id: 379
title: REST api에 OAuth2.0 구현
date: 2015-06-11T15:31:20+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=379
permalink: /oauth2-0-in-rest-api/
categories:
  - Express.js
tags:
  - express-jwt
  - jwt
  - oauth2.0
---
노드 익스프레스 엔진으로 api 서버를 구축할때 보통 인증부분은 패스포트(<a href="http://passportjs.org/">passport</a>) 모듈을 사용합니다. 클라이언트에서 이메일, 비밀번호를 리퀘스트 바디에 담아 서버로 인증요청을 하면 서버는 이를 확인해 인증된 클라이언트 정보를 세션에 저장을 하게 되는데 패스포트가 그 역할을 하는 것이죠. 한번 인증된 클라이언트는 서버에서 받은 세션 아이디를 쿠키 등에 저장해 놓고 있다가, 인증이 필요한 API를 호출할때 세션 아이디 정보를 함께 담아 요청하는 것이죠. 그럼 서버에서는 이전에 인증한 클라이언트로 보고 API 응답을 보내 주는 구조였습니다.

OAuth 2.0에는 엑세스 토큰(access token)을 사용합니다. 이 인증방법은 (1) 세션에 인증정보를 저장할 필요가 없습니다. 엑세스 토큰에 인증 정보가 있기 때문이죠. 서버에서는 이것을 디코딩하여 확인할 수 있습니다.  (2) 개발시 테스트도 편리합니다. 개발중 서버가 재구동되면 그 때마다 다시 로그인 프로토콜을 호출해야 하는 번거로움이 있죠. 그러나 OAuth 2.0을 사용하면 인증 후 획득한 엑세스 토큰을 헤더에 넣어서 호출하면 되기 때문에 개발시 매우 편리합니다.

OAuth에 대한 내용을 기술하기에는 부분이 있어 아래 링크들로 대체하겠습니다.  모두 동일 저자인듯 합니다.

<ul>
    <li><a href="http://earlybird.kr/1584">http://earlybird.kr/1584</a></li>
    <li><a href="http://www.slideshare.net/tebica/oauth2-api">http://www.slideshare.net/tebica/oauth2-api</a></li>
    <li><a href="https://www.youtube.com/watch?v=5Rs1ZEmOZys">https://www.youtube.com/watch?v=5Rs1ZEmOZys</a></li>
</ul>

본 글에서는 OAuth 2.0 REST API 서버 구현에 대해 기술하겠습니다.

<h1>Passport</h1>

우선 인증을 위한 passport 코드를 살펴 봅시다.  passport.js는 패스포트 설정을 위한 코드입니다. email과 password를 받아 인증을 처리하고 그 결과로 인증한 사용자의 아이디를 넘겨주는 역할입니다.

<pre class="lang:js decode:true " title="passport.js">/**
 * passport.js
 */

'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function () {
  passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {

        // 인증 정보 체크 로직
        if (email === 'test@test.com' &amp;&amp; password === 'test') {
          // 로그인 성공시 유저 아이디를 넘겨준다.
          var user = {id: 'user_1'}; 
          return done(null, user);
        } else {
          return done(null, false, { message: 'Fail to login.' });
        }
      }
  ));
};</pre>

로그인은 POST /login 라우팅에서 수행합니다. 패스포트 세팅 작업 선행 후, 라우팅 로직을 구현합니다.

<pre class="lang:js decode:true" title="user.js">/**
 * user.js
 */

'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('./auth');

// 패스포트 세팅 
require('./passport').setup();

var router = express.Router();

// 로그인 라우팅 POST /login
router.post('/', function(req, res, next) {

  //  패스포트 모듈로 인증 시도 
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

    // 인증된 유저 정보로 응답
    res.json(req.user);
  })(req, res, next);
});


module.exports = router;
</pre>

<h1>JWT(Json Web Token)</h1>

JWT는 <a href="http://opennaru.tistory.com/94">여기</a> 문서에서 쉽게 설명하고 있습니다. 인증정보를 암호화하여 url 형식으로 전달해 주는 토큰입니다. OAuth 2.0에서는 JWT Bearer Token Flow를 사용할수 있기 때문에 JWT를 이용해 토큰을 관리할 것입니다. <code>npm install jsonwebtoken --save</code>로 모듈을 하고 auth.js 파일을 만들어 Oauth 2.0 인증에 관한 로직을 작성합니다.

<pre class="lang:js decode:true" title="auth.js">/**
 * auth.js
 */

'use strict';

var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
var SECRET = 'token_secret';
var EXPIRES = 60; // 1 hour

// JWT 토큰 생성 함수
function signToken(id) {
  return jwt.sign({id: id}, SECRET, { expiresInMinutes: EXPIRES });
}

// 토큰을 해석하여 유저 정보를 얻는 함수
function isAuthenticated() {
  return compose()
      // Validate jwt
      .use(function(req, res, next) {
        var decoded = jwt.verify(req.headers.authorization, SECRET);
        console.log(decoded) // '{id: 'user_id'}'
        req.user = decode;
      })
      // Attach user to request
      .use(function(req, res, next) {
        req.user = {
          id: req.user.id,
          name: 'name of ' + req.user.id
        };
        next();
      });
}


exports.signToken = signToken;
exports.isAuthenticated = isAuthenticated;
</pre>

로그인 로직에서는 auth.js 모듈 중 토큰을 생성하는 signToken() 함수를 사용합니다.

<pre class="lang:default decode:true">/**
 * login.js
 */

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

    // access token 생성
    var token = auth.signToken(user.id);
    res.json({access_token: token});
  })(req, res, next);
});
</pre>

인증을 필요로하는 프로토콜 인 GET /users는 auth모듈의 isAuthenicated() 함수로 인증된 클라이언트임을 보장합니다.

<pre class="lang:js decode:true" title="users.js">/**
 * user.js
 */

/* GET users listing. */
router.get('/', auth.isAuthenticated(), function(req, res) {
  res.send(req.user);
});
</pre>

<h1>express-jwt</h1>

노드 모듈인 express-jwt는 두 가지 역할을 수행합니다. (1) 인증된 클라이언트의 엑세스 토큰을 디코딩하고 (2) 인증된 유저정보를 req.user에 저장합니다. 내부적으로는 jsonwebtoken 모듈을 사용하여 .decode() 함수를 호출하고 있습니다. 아래는 express-jwt 모듈을 적용한 코드입니다.

<pre class="lang:js decode:true" title="auth.js">/**
 * auth.js
 */

'use strict';

var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
var SECRET = 'token_secret';
var EXPIRES = 60; // 1 hour

// jwt에서 사용한 시크릿 문자열과 동일한 문자열로 객체 생성
var validateJwt = require('express-jwt')({secret: SECRET});

function isAuthenticated() {
  return compose()
      // Validate jwt
      .use(function(req, res, next) {
        // 만약 access_token 파라메터에 토큰을 설정한 경우 리퀘슽 헤더에 토큰을 설정한다.
        if(req.query &amp;&amp; req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = 'Bearer ' + req.query.access_token;
        }
   
        // 토큰 인증 로직 
        validateJwt(req, res, next);
      })
      // Attach user to request
      .use(function(req, res, next) {
        req.user = {
          id: req.user.id,
          name: 'name of ' + req.user.id
        };
        next();
      });
}</pre>

전체 코드: <a href="https://github.com/WePlanet/express-rest-api-oauth2.0">링크</a>