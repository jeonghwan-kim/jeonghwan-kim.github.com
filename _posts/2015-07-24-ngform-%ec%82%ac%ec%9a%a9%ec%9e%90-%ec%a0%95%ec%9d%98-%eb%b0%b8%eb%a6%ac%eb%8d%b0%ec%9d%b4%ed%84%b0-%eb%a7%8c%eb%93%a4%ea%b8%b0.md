---
id: 461
title: ngForm 사용자 정의 밸리데이터 만들기
date: 2015-07-24T21:08:44+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=461
permalink: /ngform-%ec%82%ac%ec%9a%a9%ec%9e%90-%ec%a0%95%ec%9d%98-%eb%b0%b8%eb%a6%ac%eb%8d%b0%ec%9d%b4%ed%84%b0-%eb%a7%8c%eb%93%a4%ea%b8%b0/
categories:
  - Angular.js
tags:
  - custom validator
  - ngForm
  - validator
---
<h1>이메일 검증</h1>

폼필드 중 이메일 입력은 type="email"로 선언한다. 앵귤러 폼에서도 이러한 이메일 입력폼에 대해 검증하고 그 결과를 앵귤러 폼 객체에 저장한다. 실제로 어떻게 동작하는지 살펴보자.

<a href="http://whatilearn.com/ngform-%eb%b0%b8%eb%a6%ac%eb%8d%b0%ec%9d%b4%ed%84%b0-%ed%99%9c%ec%9a%a9/">ngForm 밸리데이터 활용</a>에 이어서 폼을 정의를 추가한다.

<pre class="lang:js decode:true" title="index.html">&lt;label for="email"&gt;Email Address:&lt;/label&gt;
&lt;input type="email" name="email" ng-model="email" /&gt;
&lt;p ng-show="form.email.$error.email" &gt;이메일 형식에 맞게 입력하세요&lt;/p&gt;</pre>

이메일 입력 필드에 "6pack@wepla.net"을 입력해보자.

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.31.37.png"><img class="alignnone size-large wp-image-483" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.31.37-1024x768.png" alt="스크린샷 2015-07-24 오후 8.31.37" width="640" height="480" /></a><a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.32.50.png"><img class="alignnone size-large wp-image-485" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.32.50-1024x768.png" alt="스크린샷 2015-07-24 오후 8.32.50" width="640" height="480" /></a>

&nbsp;

&nbsp;

입력하는 도중 계속 필드값을 검증하다가 온전히 이메일 형식에 맞게 입력하면 검증을 통과한다.  그러나 제대로 검증하기에는 한 가지 부족한 점이 있다. 아래 예제를 보자.

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.31.58.png"><img class="alignnone size-large wp-image-484" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.31.58-1024x768.png" alt="스크린샷 2015-07-24 오후 8.31.58" width="640" height="480" /></a>

&nbsp;

앵귤러에서 제공하는 기본 검증로직은 "6pack@wepla"를 이메일로 인식하고 있다. 그러나 이런 형식도 이메일에 맞지 않다. "6pack@wepla.net"까지 입력해야 한다.

<h1>이메일 검증 개선</h1>

제대로된 이메일 검증을 위해 로직을 개선해 보자. 앵귤러 디렉티브를 사용하자. <code>email-validate</code> 라는 디렉티브를 정의하고 이 디렉티브가 삽입된 필드의 입력값을 검증해 보는 것이다.

<pre class="lang:xhtml decode:true">&lt;input type="email" name="email" ng-model="email" email-validate /&gt;</pre>

이렇게 적용된 email-validate는 디렉티브 로직 안에서 필드 값에 접근하여 이메일 형식을 검증하고 그 결과를 $scope.form.email.$error.email 에 불리언 값으로 저장한다. 아래 디렉티브 코드를 살펴보자.

<pre class="lang:js decode:true ">angular.module('ngFormTest').directive('emailValidate', function () {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attrs, modelCtrl) {
      console.log(modelCtrl);

      modelCtrl.$validators.email = function (modelValue) {
        var EMAIL_REGEXP = /^[a-zA-Z0-9+@[a-zA-Z0-9]+\.[a-zA-Z]{2,5}$/;
        return EMAIL_REGEXP.test(modelValue);
      };
    }
  };
});</pre>

입력 필드의 모델값, 즉 ng-model에 연결된 변수에 접근하기 위해서는 <strong>모델 컨트롤러</strong>를 사용해야 한다. 디렉티브를 정의할 때, <code>requrie: 'ngModel'</code>을 선언하여 모델 컨트롤러 사용을 명시한다. 모델 컨트롤러는 link 함수에서 네 번째 파라매터로 들어온다. Link 함수에서는 네 번째 파라메터인 <code>modelCtrl</code> 객체를 이용하여 입력값에 대한 검증결과를 반영할 수 있다.

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.43.13.png"><img class="alignnone size-large wp-image-486" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.43.13-1024x768.png" alt="스크린샷 2015-07-24 오후 8.43.13" width="640" height="480" /></a>

Link 함수 시작 부분에 모델 컨트롤러 객체를 로깅하였다. 콘솔에서 확인하면 다음과 같다.

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.45.25.png"><img class="alignnone size-large wp-image-487" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.45.25-813x1024.png" alt="스크린샷 2015-07-24 오후 8.45.25" width="640" height="806" /></a>

객체 마지막 부분의 <code>$validators</code> 키에 할당된 객체를 살펴보자. <code>email()</code>이라는 함수가 할당되어 있다. 이것은 이메일 검사  함수를 <code>modelCtrl.$validators.email</code>에 할당했기 때문이다.  그럼 email 뿐만 아니라 다른 키도 등록하여 추가적인 검증을 할 수 있지 않을까?

<h1>지메일 검증</h1>

이메일 중에서도 구글 메일을 체크하는 로직을 추가해보자.

<pre class="lang:js decode:true">modelCtrl.$validators.gmail = function (modelValue) {
  var GMAIL_REGEXP = /gmail\.com/;
  return GMAIL_REGEXP.test(modelValue);
}</pre>

간단하게 입력 문자열에서 "gmail.com" 문자열이 있는지 여부로 판단한다. 템플릿에 에러 문자열도 추가한다.

<pre class="lang:xhtml decode:true">&lt;p ng-show="form.email.$error.gmail" &gt;구글 메일을 입력하세요&lt;/p&gt;</pre>

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.50.33.png"><img class="alignnone size-large wp-image-488" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.50.33-1024x712.png" alt="스크린샷 2015-07-24 오후 8.50.33" width="640" height="445" /></a>

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.50.39.png"><img class="alignnone size-large wp-image-489" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오후-8.50.39-1024x712.png" alt="스크린샷 2015-07-24 오후 8.50.39" width="640" height="445" /></a>

전체 코드: <a href="https://github.com/jeonghwan-kim/ngForm">https://github.com/jeonghwan-kim/ngForm</a>

&nbsp;