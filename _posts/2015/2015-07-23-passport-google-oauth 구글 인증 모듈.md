---
id: 440
title: passport-google-oauth 구글 인증 모듈
date: 2015-07-23T21:50:03+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=440
permalink: /passport-google-oauth-%ea%b5%ac%ea%b8%80-%ec%9d%b8%ec%a6%9d-%eb%aa%a8%eb%93%88/
AGLBIsDisabled:
  - 0
categories:
  - Express.js
tags:
  - google
  - google api
  - passport
  - passport-google-oauth
---
<h1>구글 개발자 콘솔 설정</h1>
구글 인증을 사용하기 위해서는 <a href="https://console.developers.google.com/project">구글 웹 콘솔</a>에 접속하여 콜백 주소 등의 정보를 입력한 뒤 클라이언트 아이디와 클라이언트 시크릿을 받아야한다. 프로젝트를 생성하고 아이디/시크릿을 받는 과정까지 알아보자.

(1) 웹 콘솔에 접속하여 프로젝트를 생성한다.

(2) 생성된 프로젝트 상세 화면으로 이동한 뒤 사용자 인증 정보 메뉴로 이동한다.

(3) 새 클라이언트 ID 만들기 버튼을 클릭하고 승인된 리디렉션 URI를 입력한다. 이것이 패스포트 모듈에서 사용할 콜백 URL이다. 본 테스트는 로컬에서 진행하므로 <code>http://localhost:3000/auth/google/callback</code>로 입력한다.

(4) 정보를 입력하고 클라이언트 ID 만들기 버튼을 클릭하면 클라이언트 ID와 클라이언트 보안 비밀을 확인할 수 있는데 이것이 각각 <code>clientId</code>와 <code>clientSecret</code>이다.

(5) 마지막으로API 메뉴로 들어가 Google + API를 활성화 한다.
<h1>모듈 설치</h1>
두 가지 모듈이 필요하다. <code>npm install passport passport-google-oauth</code>
<h1>폴더구조</h1>
사이트에서 제공하는 <a href="https://github.com/jaredhanson/passport-google-oauth/blob/master/examples%2Foauth2%2Fapp.js">샘플코드</a>를 볼수도 있지만 익스프레스 코드와 섞여있어 좀 헷갈리다. 별도 파일로 분리했다. 폴더구조를 살펴보자.

<code>/auth/passport/index.js</code>:  패스포트 모듈을 등록한다.

<code>/auth/index.js</code>: 인증 관련 기능을 담당하는 모듈. 여기서는 인증여부를 체크하는 함수 'ensureAuthenticated()`만 구현한다.

<code>/auth/passport/config.json</code>: 구글 웹콘솔에서 생성한 클라이언트 아이디와 시크릿 정보를 저장한다.

이렇게 auth 폴더에 패스포트를 포함한 인증모듈을 담아둔 뒤, 서버 구동하는 app.js에서 이를 로딩하는 구조로 작성한다. 이를 호출하는 app.js 파일 내부를 살펴보자.
<pre class="lang:js decode:true" title="app.js">var express = require('express');
var app = express();

// passport settings
require('./auth/passport.js').setup(app);

// routing
app.use('/', require('./routes/index'));

module.exports = app;
</pre>
중간 중간 설명에 필요없는 코드 생략을 유념하고 보자. <code>require('./auth/passport.js').setup(app);</code>로 패스포트 모듈을 설정한다.  실제 패스포트 모듈 설정을 살펴보자.
<pre class="lang:js decode:true" title="/auth/passport.js">'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session = require('express-session');
var config = require('./config.json');

var GOOGLE_CLIENT_ID = config.google.clientId;
var GOOGLE_CLIENT_SECRET = config.google.clientSecret;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
));

var setup = function (app) {
  app.use(session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/google',
      passport.authenticate('google', { scope: ['openid', 'email'] }),
      function(req, res){
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
      });

  app.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
        console.log(req.query);
        res.redirect('/');
      });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });
};

exports.setup = setup;
</pre>
인증페이지인 <code>/login</code>에 접속하면 사용자는 로그인 링크를 클릭한다.

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-23-오후-9.31.02.png"><img class="alignnone wp-image-469 " src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-23-오후-9.31.02.png" alt="스크린샷 2015-07-23 오후 9.31.02" width="482" height="280" /></a>

&nbsp;

그럼 <code>/auth/google</code>로 이동하여 <code>passport.authenticate()</code>함수를 실행하는데 이때 구글 인증 페이지로 이동한다.

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-23-오후-9.32.46.png"><img class="alignnone  wp-image-470" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-23-오후-9.32.46.png" alt="스크린샷 2015-07-23 오후 9.32.46" width="481" height="315" /></a>

사용자가 승인 하게되면 구글 웹콘솔에서 등록한 콜백URL인 <code>/auth/google/callback</code>으로 리다이렉팅 한다. 패스포트 모듈을 이를 확인하여 인증정보를 <code>req.user</code>에 객체형태로 저장한다. 그리고 <code>/</code>리다이렉트 한다.

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-23-오후-9.33.25.png"><img class="alignnone  wp-image-471" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-23-오후-9.33.25.png" alt="스크린샷 2015-07-23 오후 9.33.25" width="491" height="321" /></a>

&nbsp;

/account에는 인증된 사용자만 접근하도록 설정해보자. <code>/auth/index.js</code> 모듈을 호출해서 라우팅 중간에 미들웨어로 끼어 넣으면 된다.
<pre class="lang:js decode:true " title="routes/index.js">var auth = require('../auth'); 

router.get('/account', auth.ensureAuthenticated, function(req, res, next) {
  res.render('account', {
    title: 'Account',
    name: req.user.displayName, // 패스포트를 통해 저장된 유저정보
    user: JSON.stringify(req.user)
  });
});</pre>
이렇게 설정하면 인증된 요청만 <code>/account</code> 페이지에 접근할수 있게된다.

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-23-오후-9.39.50.png"><img class="alignnone  wp-image-473" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-23-오후-9.39.50.png" alt="스크린샷 2015-07-23 오후 9.39.50" width="509" height="341" /></a>

<code>ensureAuthenicated()</code> 를 구현해 보자.
<pre class="lang:js decode:true " title="auth/index.js">var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};
exports.ensureAuthenticated = ensureAuthenticated;</pre>
패스포트 모듈을 통해 리퀘스트 객체는 <code>isAuthenticated()</code> 함수를 호출할수 있는데 이 값이 true를 반환하면 다음 스텝을 진행한다. 그렇지 않을 경우 로그인 페이지로 리다이렉팅 하도록한다.

<a href="https://github.com/jeonghwan-kim/passport-google-oauth">소스코드</a>

&nbsp;