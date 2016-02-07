---
id: 335
title: ui-route로 라우팅 인증 구현
date: 2015-04-01T23:38:41+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=335
permalink: /ui-route%eb%a1%9c-%eb%9d%bc%ec%9a%b0%ed%8c%85-%ec%9d%b8%ec%a6%9d-%ea%b5%ac%ed%98%84/
categories:
  - Angular.js
tags:
  - $cacheFactory
  - angularjs
  - authentication
  - ui-router
---
원페이지 웹을 지원하는 앵귤러의 핵심적인 모듈이 바로 라우팅 모듈입니다. 이것을 구현한 것이 <a href="https://docs.angularjs.org/api/ngRoute">ng-route</a>와 <a href="https://github.com/angular-ui/ui-router">ui-router</a> 모듈입니다. ng-route는 앵귤러에서 기본으로 제공하고, <a href="http://angular-ui.github.io/">angular-ui</a>에서 개발하는 ui-router는 최근 많이 사용하는 모듈로써 <a href="https://github.com/DaftMonk/generator-angular-fullstack">angular-fullstack</a> 제너레이터에서도 지원하고 있습니다.

기존에는 백엔드 서버에서 라우팅을 관리했습니다. 공개된 페이지는 접속하는 모든 브라우져에 파일을 내려주고 제한된 페이지는 별로 로그인 페이지로 리다이렉트 하게 했습니다.

원페이지 웹의 경우 백엔드 서버가 아닌 브라우저 단에서 이를 처리할수 있어야 합니다. 그래서 ui-router 같은 모듈을 통해 라우팅에 대한 인증처리를 구현할 수 있습니다.

ui-router에서 라우팅 코드는 아래와 같이 작성합니다.
<pre class="lang:js decode:true" title="main.js">/*
 모듈 정의
*/
angular.module('myApp', [ 'ui.router' ])
  .config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/'); // 없는 경로일 경우 루트 경로로 리다이렉트 

    $locationProvider.html5Mode(true);
  });

/*
 main state 정의 ('/' 라우팅)
*/
angular.module('myApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', { // 상태 정의
        url: '/', // 라우팅 경로 
        templateUrl: 'main.html', // 템플릿 경로 
        controller: 'MainCtrl', // 컨트롤러 이름
        resolve: { // 라우팅 실행 전에 auth에 인증정보를 설정
          auth: function (Auth) {
            return Auth.get({redirect: true});
          }
      });
  });</pre>
main 스태이트를 설정하는 부분의 resolve 속성을 집중해서 봐야합니다. 라우팅 설정시 resolve 속성에는 promise 객체를 설정합니다. 이 promise 객체가 resolve 되어야만 이 라우팅은 실행되는 구조입니다. 이것은 ng-route 모듈에서도 같은 이름으로 제공합니다. 목적에 따라서는 컨트롤러에서 사용할 데이터를 라우팅 직전에 resolve 속성에 정의하여 사용할 수도 있습니다. 예를 들어 resolve 속성에 아래와 같이 객체를 설정하면 컨트롤러에서는 name, skills라는 변수로 이 값에 접근할 수 있습니다.
<pre class="lang:js decode:true">resolve: {
  name: 'Jeonghwan'
  skills: ['javascript', 'php']
}</pre>
우리는 resolve 속성에 auth라는 키를 갖는 객체를 할당할 것입니다. `{auth: promise}` 식으로 말이죠. 위 코드에서는 Auth라는 앵귤러 서비스를 불러와서 Auth.get() 함수로 promise 객체를 반환하도록 하였습니다. Auth.get() 함수의 파라메터는 redirect 플래그를 넘겨줘서 인증되지 않았을 경우 /login으로 라우팅하기 위함입니다.

이제 Auth 서비스 코드를 봅시다.
<pre class="lang:js decode:true" title="Auth.service.js">angular.module('myApp')
  .service('Auth', function ($q, $http, $state, $cacheFactory) {
    var API = '/api/auth',
        cache = $cacheFactory('myApp');


    // 로그인 정보 조회
    function get(options) {
      var deferred = $q.defer();

      if (cache.get('auth')) {

        // 캐쉬에 인증정보가 있으면 인증정보 반환
        deferred.resolve(cache.get('auth')); 
      } else {

        // 캐쉬에 인증정보가 없으면 백엔드에 호출함
        $http.get(API)
          .success(function (data) {            
            cache.put('auth', data.auth); // 캐쉬에 인증정보 저장 
            deferred.resolve(cache.get('auth')); // 인증정보 반환
          })
          .error(function () {
            // 인증되지 않을경우 reject
            deferred.reject('Rejected');

            // options.redirect 파라메터 값이 설정된 경우 /login 페이지로 리다이랙트
            if (options &amp;&amp; options.redirect) {
              $state.go('login');
            }
          });
      }

      this.get = get;

  });</pre>
데이터베이스를 백엔드 서버에서 관리하고 있는한 사용자 인증은 백엔드 서버에 프로토콜 형태로 요청해야만 합니다. 그리고 서버는 세션 아이디로 로그인한 브라우져를 식별하고 있기 때문에 브라우져는 자신의 인증 여부를 서버에 확인해야 합니다. 사용자 인증이 되었을 경우 서비스는 resolve() 함수를 호출하여 라우팅 모듈이 정상적으로 라우팅을 계속 하도록 알려 줍니다. 반대로 인증되지 않았을 경우 reject()함수를 실행하고, 로그인 페이지로 이동하도록 하였습니다.

백엔트 프로토콜은 최소화하는 것이 좋습니다. 게다가 라우팅로직을 수행할 때마다 인증 조회를 위한 백엔드 요청을 계속한다면 성능 이슈가 될 수도 있습니다. 그래서 한 번 인증한 뒤 인증정보는 프론트앤드의 캐쉬에 담아두는데 $cacheFactory 서비스가 그 역할을 합니다. `$cacheFacotry('myApp')` 으로 캐쉬 객체를 생성하고 `put()` / `get()`으로 데이터를 입력/조회할 수 있습니다.

<img class="alignnone size-large wp-image-338" src="http://whatilearn.com/wp-content/uploads/2015/04/FullSizeRender-1024x597.jpg" alt="FullSizeRender" width="640" height="373" />