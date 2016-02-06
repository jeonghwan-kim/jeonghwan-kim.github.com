---
id: 80
title: Angular Form
date: 2015-01-09T19:02:17+00:00
author: Chris
layout: post
guid: http://www.whatilearn.com/?p=80
permalink: /angular-form/
categories:
  - Angular.js
tags:
  - angularjs
  - form
---
앵귤러에서는 폼작성을 위한 클래스와 스콥 변수를 지원한다. 이를 통해 폼 데이터와 화면을 제어할 수 있다. <code>&lt;form name="myForm"&gt;</code> 을 설정하면 컨트롤러에서 <code>$scope.myForm</code>으로 폼에 속한 인풋 엘레먼트에 접근할 수 있다. 또한 <code>$scope.myForm.$dirty</code> 등으로 폼 유효성에 대한 검증을 할수 있으며 이는 <code>ng-dirty</code>와 같이 클래스명으로 설정된다. 앵귤러 폼의 기본 사용법과 몇가지 팁에 대해 정리해보자.

<h1>데이터 바인딩</h1>

우선 폼을 핸들링해야 하는데 이것은 form의 name 속성으로 연결할 수 있다.

<pre class="lang:xhtml decode:true">&lt;form name="myForm"&gt;
  &lt;input type="text" name="nickname" ng-model="name" /&gt;
  &lt;input type="number" name="age" ng-model="age" /&gt;
&lt;/form&gt;
</pre>

컨트롤러에서는 스코프 변수 <code>$scope.myForm.nickname</code>와 <code>$scope.myForm.age</code> 와 연결된다. 스코프 변수에는 이것 말고도 <code>$dirty, $valid, $invalid, $error</code> 등의 속성이 있고 이것을 통해 입력값에 대한 정보를 가져올 수 있다. 예를 들어

<ul>
    <li>폼 입력값을 수정했을 경우 <code>$scope.myForm.$dirty=true</code> 로  채워진다.</li>
    <li>입력한 데이터가 요구조건에 맞지 않을 경우 <code>$scope.myForm.$invalid=true </code></li>
    <li>입력한 데이터가 요구조건에 맞을 경우 <code>$scope.myForm.$valid=true </code>값이 설정된다.</li>
</ul>

$valid, $invalid 속성을 좀더 살펴보자. 입력값을 검증하는 기준은 뭘까? html5 태그 속성과 앵귤러 디렉티브로 검증 기준을 설정할 수 있다.

&lt;input type="text" required="true" ng-minlength="3" pattern="/^<span class="pl-c1">&#92;</span>d*$/" /&gt;

<ul>
    <li>required="true": 반드시 입력해야할 필드</li>
    <li>ng-minlength="3": 입력한 문자열의 최소 길이</li>
    <li>pattern="//": 입력한 필드값의 정규표현식</li>
</ul>

앵귤러 컨트롤러의 저장 함수에서는 템플릿의 폼 데이터를 검증한 뒤 검증에 통과하면 실제 저장하는 로직이 있을 것이다. 이때 폼데이터를 검증하기 위해 $scope.myForm.$valid 변수를 체크하여 진행하도록 하자.

<h1>클래스</h1>

입력 필드값의 검증결과가 따라 스코프 변수에 바인딩 되듯이 클래스명도 입력 필드값의 검증 결과에 따라 달라진다.

<ul>
    <li>.ng-dirty: 필드를 수정했을 경우</li>
    <li>.ng-invalid: 필드 입력값 검증 성공시</li>
    <li>.ng-invalid: 필드 입력값 검증 실패시</li>
    <li><a href="https://docs.angularjs.org/api/ng/directive/form#css-classes">더보기</a></li>
</ul>

따라서 위 클래스를 재정의하여 입력 필드의 스타일을 변경할 수 있다.

<h1>기타 (Tips)</h1>

<code>ng-trim</code> 디렉티브는 입력값에 대해 좌우 공백을 제거한다.
<code>&lt;input type="text" ng-trim /&gt;</code>

엔터키에 대해 이벤트를 걸고 싶다면 <code>ng-keyup</code>을 사용할 수 있다.
<code>&lt;input type="text" ng-keyup="$event.keyCode === 13 &amp;&amp; search()" /&gt;</code>

&nbsp;