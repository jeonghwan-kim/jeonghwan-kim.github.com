---
id: 107
title: AngularJS, Passport로 인증구현
date: 2015-01-17T12:34:54+00:00
author: Chris
layout: post
guid: http://www.whatilearn.com/?p=107
permalink: /angularjs-passport%eb%a1%9c-%ec%9d%b8%ec%a6%9d%ea%b5%ac%ed%98%84/
categories:
  - Angular.js
  - Express.js
tags:
  - angular-fullstack
  - angularjs
  - nodejs
  - passport
  - session
---
AngularJS를 사용하는 프로젝트에서 사용자 인증을 구현해 보자. 작업환경은 아래와 같다.

<ul>
    <li>프레임웍: <a href="https://github.com/DaftMonk/generator-angular-fullstack">Angular-fullstack</a> (프론트 엔드: AngularJS, 백엔드: ExpressJS)</li>
</ul>

<h1>백엔드 구현</h1>

노드 익스프레스에서는 <a href="http://passportjs.org/">패스포트 모듈</a>로 인증을 쉽게 구현할 수 있다. 로그인 정보는 서버측 세션 메모리에 저장할 것이고 <code>/api/auth (get/post/delete)</code> 프로토콜로 프론트엔드와 통신할 것이다.

우선 패스포트 모듈을 익스프레스과 연동해야 한다. 앵귤러풀스택에서는 <code>app.js</code> 에서 익스프레스 객체를 생성하여 별도로 구현한 <code>config/express.js</code> 모듈에 넘겨준다. <code>express.js</code>에서는 서버 정보를 설정하는 작업을 한다. 마찬가지로 필자도 <code>config/passport.js</code> 모듈을 작성하고 여기에서 패스포트 관련한 설정 작업을 할 것이다.

<pre class="lang:js decode:true" title="config/passport.js">var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports = module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());

  // 로그인 라우팅시 미들웨어로 수행됨
  // 유저네임과 비밀번호를 체크함 
  passport.use(new LocalStrategy({}, function (username, password, done) {
    console.log('passport.use()', username, password);

    if (username.toUpperCase() !== 'user01' || password.toUpperCase() !== 'password01') {
      return done(null, false);
    }
    return done(null, {user: username, password: password});
  }));

  // 인증 성공후 세션에 데이터 저장시 호출됨
  passport.serializeUser(function (user, done) {
    console.log('serializeUser()', user);
    done(null, user);
  });

  // 세션에 저장된 데이터 조회시 호출됨 
  passport.deserializeUser(function (user, done) {
    console.log('deserializeUser()', user);
    done(null, user);
  });
};
</pre>

세션 메모리를 패스포트 데이터 저장소로 사용했기 때문에 익스프레스에 세션 모듈을 연동해야 한다. <a href="https://github.com/expressjs/session">express-seesion</a> 모듈을 아래와 같이 연결한다.

<pre class="lang:js decode:true" title="config/express.js">var session = require('express-session');

module.exports = function (app) {

  // ..

  app.use(session({
      name: 'MY_APP',
      secret: 'MY_S3CR3T'
    }));

  // ..</pre>

이것으로 익스프레스와 패스포트 모듈을 연동했다. 이젠 백엔드 프로토콜을 작성해 보자. <code>yo angular-fullstack:endpoint auth</code> 로 백엔드 api 스패폴딩 파일을 자동을 생성한다. <code>api/auth/index.js</code> 파일에 아래의 세가지 프로토콜을 작성한다.

<ul>
    <li>`/api/auth (GET)`: 세션을 체크하여 인증여부 확인</li>
    <li>`/api/auth (POST)`: 인증 수행후 로그인 정보를 세션에 저장</li>
    <li>`/api/auth (DELETE)`: 세션 정보를 삭제하여 로그아웃 수행</li>
</ul>

<pre class="lang:js decode:true" title="api/auth/index.js">'use strict';

var express = require('express');
var passport = require('passport');

var router = express.Router();

// /api/auth (get)
router.get('/', function (req, res) {
  res.json(req.user); // 세션에 저장된 로그인 정보를 반환 
});

// /api/auth (post)
router.post('/', passport.authenticate('local'), function (req, res) {

  // config/passport.js에서 설정한 패스포트 미들웨어 로직이 수행된다.
  // 인증을 성공하면 200코드를 반환, 실패시 401, Unauthorized를 자동으로 반환한다.
  res.send(200);
});

// /api/auth (delete)
router.delete('/', function (req, res) {
  req.logout(); // 세션 정보 삭제 
  res.send(200)
});

module.exports = router;
</pre>

&nbsp;

<h1>프로트엔드 구현</h1>

인증이 필요한 페이지로 라우팅할때 promise를 사용한다. ui-route (혹은 ng-route)로 라우팅 설정할때 resove 속성을 추가할 수 있다. 이때 <code>/api/auth (GET)</code>으로 로그인 여부를 백엔드에서 확인하고 인증된 경우뫈 라우팅을 허용한다. 그렇지 않은 경우는 로그인 페이지(<code>/login</code>)로 리다이렉팅 한다.

<pre class="lang:js decode:true" title="main.js">'use strict';

angular.module('myApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',

        // promise를 사용한 부분. 
        // resolve가 정상 수행되어야함 '/'으로 라우팅을 허용한다.
        resolve: {
          isAuth: function ($http, $state) {

            // 백엔드에 인증여부를 확인하다.
            return $http({method: 'GET', url: '/api/auth'})
              .error(function(data, status) {
                console.log(data, status);

                // 인증되지 않은 경우 로그인 페이지로 이동.
                $state.go('login');
              })
          }
        }
      });
  });</pre>

로그인 페이지는 <code>/login</code> 으로 라우팅하고, 로그인 템플릿과 컨트롤러를 가각 연결한다. 컨트롤러에서는 <code>/api/auth (POST)</code> 프로토콜로 인증을 시도한다. 인증 성공후 메인페이지(<code>/</code>)로 라우팅하고 그렇지 않을 경우 로그인 페이지 (<code>/login</code>)에서 인증 정보를 재 입력 받도록 한다.

<pre class="lang:js decode:true " title="login.controller.js">'use strict';

angular.module('myApp')
  .controller('LoginCtrl', function ($scope, $http, $location) {

    // 로그인 버튼 핸들러
    $scope.login = function () {
      $scope.msg = '';

      // 백엔드에 인증을 시도한다.
      $http.post('/api/auth', {
          username: $scope.username,
          password: $scope.password
        })
        .success(function (data, status) {
          console.log(data, status);

          // 인증 성공시 메인페이지('/')로 이동 
          $location.path('/');
        })
        .error(function (data, status) {
          console.log(data, status);

          // 인증 실패시 재로그인을 안내한다.
          $scope.msg = '로그인 정보 오류: 로그인 정보를 다시 입력하세요.';
        });
    };

  });
</pre>

각 페이지에는 로그아웃 버튼을 배치한다. 로그아웃 버튼 클리시 바로 백엔드 프로토콜인 <code>/api/auth (DELETE)</code>를 호출하여 서버의 세션 메모리에 저장된 유저 정보를 삭제한다. 삭제후 반환되는 값을 확인하고 다시 메인 페이지(<code>/</code>)로 라우팅한다. 메인페이지에서는 세션 여부를 체크하고 다시 로그인 페이지로 리다이렉팅 된다.

<pre class="lang:js decode:true  ">'use strict';

angular.module('myApp')
  .controller('NavbarCtrl', function ($scope, $location, $http, $state) {

    // 로그아웃 버튼 핸들러 
    $scope.logout = function () {

      // 백엔드에 로그아웃을 요청한다.
      $http.delete('/api/auth')
        .success(function (data, status) {
          console.log(data, status);

          // 로그아웃 성공시 메인페이지로 이동 ('/')    
          if (status === 200) {
            $state.go('/');
          }
        });
    }

  });</pre>

&nbsp;