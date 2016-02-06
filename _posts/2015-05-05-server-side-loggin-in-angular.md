---
id: 363
title: 프론트에서 잡지 못한 예외를 서버에 리포팅하는 방법
date: 2015-05-05T23:45:45+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=363
permalink: /server-side-loggin-in-angular/
categories:
  - Angular.js
tags:
  - angularjs
  - exception
  - stacktrace.js
---
<p class="crayon-selected">웹서비스를 런칭하고 유저들이 접속하여 사용하게 되면 다양한 버그가 발생한다. 특히 처리하지 못한 예외 케이스들을 브라우저에서만 나타날뿐 개발자가 놓치게 되는 경우가 많다. 사용자는 '이거 안되요, 저거 안되요' 라고 말하지만 개발자는 문제에 대한 아무런 정보도 얻을 수 없다. 이러한 프론트단에서의 에러(자바스크립트 예외)정보를 서버로 저장하는 방법에 대해 알아보자.</p>
<p class="crayon-selected">사전 준비</p>

<ol>
	<li class="crayon-selected">서버에 에러로그를 저장하는 프로토콜이 있다고 가정하다. (POST /api/log, log키에 로그정보를 저장하여 바디에 담아 전송한다)</li>
	<li class="crayon-selected">자바스크립트 스택을 출력하는 라이브러리 <a href="http://www.stacktracejs.com/">stacktrace.js</a>를 사용한다.</li>
</ol>
앵귤러의 빌트인 익셉션핸들러($exceptionHandler)를 오버라이딩한다.
<div>
<pre class="lang:js decode:true">angular.module('chris.util')
    .provider("$exceptionHandler", {

      // 앵귤러 providoer는 $get 속성에 정의해야 한다.
      $get: function (ExceptionLogToServer) { 

        // 익셉션이 발생하면 ExceptionLogToServer 서비스를 호출한다.
        return ExceptionLogToServer;
      }
    });</pre>
ExceptionLogToServer 서비스를 정의한다.
<pre class="lang:js decode:true " title="ExceptionLog.service.js">angular.module('chris.util')
    .factory('ExceptionLogToServer', function ($log, $window) {
      var tag = 'ExceptionLog.service';

      function error(exception, cause) {

        // 브라우져 콘솔에 에러로그를 먼저 남긴다
        $log.error.apply($log, arguments);

        try {

          // $http 앵귤러 서비스를 사용하지 않는다. Circular call 관련 이슈
          $.ajax({
            type: 'POST',
            url: '/api/logs', // 서전 정의한 백엔드 프로토콜: 로그 기록용 
            data: {
              log: angular.toJson({
                url: $window.location.href, // 예외 발생시 url
                message: exception.toString, // 예외 메세지 
                type: 'EXCEPTION',
                stackTrace: printStackTrace({ // 스택 정보, 미리 stacktract.js를 로딩해야한다. 
                  e: exception
                }),
                cause: cause || ''
              })
            }
          });
          return $log.info(tag, 'Logged exception to server-side');
        } catch (_error) {
          $log.warn(tag, 'Error server-side logging failed');
          return $log.warn(tag, _error);
        }
      }

      return error;
    });</pre>
<a href="https://github.com/jeonghwan-kim/angular-utility/blob/master/src/Services/ExceptionLogToServer/ExceptionLogToServer.service.js">전체코드</a>

&nbsp;

</div>