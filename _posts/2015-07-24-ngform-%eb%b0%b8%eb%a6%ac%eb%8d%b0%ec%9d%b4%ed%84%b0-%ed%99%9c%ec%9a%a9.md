---
id: 459
title: ngForm 밸리데이터 활용
date: 2015-07-24T09:10:27+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=459
permalink: /ngform-%eb%b0%b8%eb%a6%ac%eb%8d%b0%ec%9d%b4%ed%84%b0-%ed%99%9c%ec%9a%a9/
categories:
  - Angular.js
tags:
  - ngForm
---
<h1>밸리데이트 디렉티브</h1>

<a href="http://whatilearn.com/ngform-%ed%81%b4%eb%9e%98%ec%8a%a4%eb%aa%85-%ed%99%9c%ec%9a%a9%ed%95%98%ea%b8%b0/">ngForm 클래스명 활용하기</a>에서 앵귤러 폼에서 자동으로 붙여주는 클래스에 대해 확인해봤다. 그중 <code>.ng-invalid</code>, <code>.ng-valid</code>클래스가 붙는데 다음과 같은 경우에 발생한다.

인풋 필드의 타입이 <code>type="number"</code>일 경우. 실제 입력값이 숫자이면 <code>.ng-valid</code>가 붙고 그렇지 않고 문자열이면 <code>.ng-invalid</code> 클래스가 붙는다. 인풋 필드의 종류 뿐만이아니라 필드 값의 길이와 패턴 그리고 입력 여부에 따라서도 이러한 클래스가 자동으로 설정되도록 할수 있다. 아래 디렉티브는 인풋 필드에 설정하여 이러한 기능을 하도록하는 디렉티브들이다.

<ul>
    <li>ng-required: 필드 값이 반드시 있어야한다.</li>
    <li>ng-minlength: 필드 값의 최소 길이를 설정한다.</li>
    <li>ng-maxlength: 필드 값의 최대 길이를 설정한다.</li>
    <li>ng-pattern: 필드 값이 설정한 정규 표현식을 만족해야한다.</li>
</ul>

<h1>폼 객체</h1>

전화번호 입력을 위한 필드를 만들어보자.

<pre class="lang:xhtml decode:true">&lt;form name="form" ng-submit="submit()" novalidate&gt;
  &lt;label for="phone"&gt;Phone Number:&lt;/label&gt;
  &lt;input type="text" name="phone" ng-model="phone" ng-required="true" ng-minlength="12" ng-maxlength="13" ng-pattern="/^\d{3}-\d{3,4}-\d{4}$/"/&gt;
&lt;/form&gt;
</pre>

'form' 이라는 이름을 같은 폼 엘레먼트 안에 'phone'이라는 텍스트 입력 필드를 만들었다. 이 필드의 제약사항은 1) 반드시 필드 값이 입력되어야 하고(<code>ng-required="true"</code>) 2) 입력된 값의 최소길이는 12글자(<code>ng-minlength="12"</code>) 3) 최대 길이는 13글자 (<code>ng-maxlength="13"</code>) 4) 그리고 전화번호 형식의 정규 표현식을 만족해야 한다. (<code>ng-pattern="/^\d{3}-\d{3,4}-\d{4}$/"</code>)

이렇게 설정한 밸리데이터는 스코프 변수를 통해 접급할 수 있다. 아무것도 입력하지 않은 상태에서 <code>$scope.form.name</code> 객체를 살펴보자.

<pre class="lang:js decode:true ">"phone": {
    "$validators": {},
    "$asyncValidators": {},
    "$parsers": [],
    "$formatters": [
      null
    ],
    "$viewChangeListeners": [],
    "$untouched": true,
    "$touched": false,
    "$pristine": true,
    "$dirty": false, 
    "$valid": false, // 필드값이 검증되면 true로 설정됨
    "$invalid": true, // 필드값 검증에 실패하면 true로 설정됨
    "$error": { // 밸리데이터로 검증한 결과 정보를 담는 객체 
      "required": true
    },
    "$name": "phone",
    "$options": null
  }</pre>

이번엔 "010-1234-"를 필드에 입력해 보자.

<pre class="lang:js decode:true ">"phone": {
    "$viewValue": "010-1234-", // 필드에 입력한 값을 저장한다.
    "$validators": {},
    "$asyncValidators": {},
    "$parsers": [],
    "$formatters": [
      null
    ],
    "$viewChangeListeners": [],
    "$untouched": false,
    "$touched": true,
    "$pristine": false,
    "$dirty": true,
    "$valid": false, // 입력값 검증을 실패했다.
    "$invalid": true, // 입력값 검증을 실패했다.
    "$error": {
      "pattern": true, // 입력값이 정규표현식 검증에 실패했다.
      "minlength": true // 입력한 값이 최소 13글자가 아니다.
    },
    "$name": "phone",
    "$options": null
  }</pre>

필드에 입력한 값은 <code>$viewValue</code>에 저장된다. 이 값이 검증에 통과하지 못하면 <code>$valid=false</code>, <code>$invalid=true</code>로 설정된다. 그리고 <code>$error</code> 객체에 어떤 검증에 실패하였는지 정보를 담아준다.

그럼 제대로 된 값을 입력해보자. 010-1234-5678을 입력한 결과다.

<pre class="lang:js decode:true ">"phone": {
    "$viewValue": "010-1234-5678",
    "$modelValue": "010-1234-5678", // 검증에 성공하면 모델값에 저장한다.
    "$validators": {},
    "$asyncValidators": {},
    "$parsers": [],
    "$formatters": [
      null
    ],
    "$viewChangeListeners": [],
    "$untouched": false,
    "$touched": true,
    "$pristine": false,
    "$dirty": true,
    "$valid": true, // 검증에 성공했다.
    "$invalid": false, // 검증에 성공했다.
    "$error": {}, // 에러가 없다.
    "$name": "phone",
    "$options": null
  }</pre>

입력값 검증에 성공하면 $viewValue에 저장된 값이 $modelValue에도 저장된다. 이것은 필드에서 <code>ng-model="phone"</code>로 설정한 모델값에도 반영되어 <code>$scope.phone</code>으로도 접근할 수 있다. <code>$valid=true</code>, <code>$invalid=false</code>가 설정되고 <code>$error</code> 객체는 비워진다.

<h1>안내 문구</h1>

폼 객체를 살펴보았으니 이것을 활요해 안내 문구를 출력해보자. 사용자가 필드값을 입력하면 폼 객체체의 $error 필드를 확인하여 상황에 맞는 메세지를 보여줄 수 있다.

<pre class="lang:xhtml decode:true ">&lt;p ng-show="form.phone.$error.required"&gt;전화번호를 입력하세요&lt;/p&gt;
&lt;p ng-show="form.phone.$error.minlength"&gt;최소 13글자 이상 입력하세요&lt;/p&gt;
&lt;p ng-show="form.phone.$error.maxlength"&gt;최대 14글자까지 입력하세요&lt;/p&gt;
&lt;p ng-show="form.phone.$error.pattern"&gt;010-xxx-xxxx 형식으로 입력하세요&lt;/p&gt;
</pre>

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오전-8.56.05.png"><img class="alignnone  wp-image-479" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오전-8.56.05.png" alt="스크린샷 2015-07-24 오전 8.56.05" width="391" height="293" /></a>

&nbsp;

폼 객체의 <code>$submitted</code>를 활용하면 폼을 제출했을 경우에만 메세지를 출력할수도 있다.

<pre class="lang:xhtml decode:true ">&lt;p ng-show="form.phone.$error.required &amp;&amp; form.$submitted"&gt;전화번호를 입력하세요&lt;/p&gt;
&lt;p ng-show="form.phone.$error.minlength &amp;&amp; form.$submitted"&gt;최소 13글자 이상 입력하세요&lt;/p&gt;
&lt;p ng-show="form.phone.$error.maxlength &amp;&amp; form.$submitted"&gt;최대 14글자까지 입력하세요&lt;/p&gt;
&lt;p ng-show="form.phone.$error.pattern &amp;&amp; form.$submitted"&gt;010-xxx-xxxx 형식으로 입력하세요&lt;/p&gt;

&lt;button type="submit"&gt; 제출</pre>

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오전-8.58.47.png"><img class="alignnone size-full wp-image-480" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오전-8.58.47.png" alt="스크린샷 2015-07-24 오전 8.58.47" width="512" height="384" /></a>

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오전-8.58.50.png"><img class="alignnone size-full wp-image-481" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-24-오전-8.58.50.png" alt="스크린샷 2015-07-24 오전 8.58.50" width="512" height="384" /></a>

<a href="https://github.com/jeonghwan-kim/ngForm">소스코드</a>