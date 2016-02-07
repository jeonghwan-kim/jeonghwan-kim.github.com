---
id: 434
title: ngForm 클래스명 활용하기
date: 2015-07-21T23:47:11+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=434
permalink: /ngform-%ed%81%b4%eb%9e%98%ec%8a%a4%eb%aa%85-%ed%99%9c%ec%9a%a9%ed%95%98%ea%b8%b0/
categories:
  - Angular.js
tags:
  - angularjs
  - ngForm
---
앵귤러 폼을 구성하기 위해서는 (1) <code>&lt;form name="form"&gt;</code> 처럼 폼에 <code>name</code> 키 값을 설정해 주어야 한다. 이것은 컨트롤러에서 <code>$scope.form</code>으로 접근할 수 있다. (2) input 필드에 <code>name</code>과 <code>ng-model</code>키 값을 설정해 주어야 한다. <code>&lt;input name="username" type="text" /&gt;</code>으로 설정하면 컨트롤러에서는 <code>$scope.username</code>으로 모델 데이터에 접급하고 <code>$scope.form.username</code>으로 폼 데이터에 접근할 수 있다.

<pre class="lang:xhtml decode:true" title="index.html">&lt;form name="form" ng-submit="submit()" novalidate&gt;
      &lt;p&gt;
        &lt;label for="username"&gt;Username:&lt;/label&gt;
        &lt;input type="text" name="username" ng-model="username" /&gt;
      &lt;/p&gt;
      &lt;p&gt;
        &lt;label for="username"&gt;Age:&lt;/label&gt;
        &lt;input type="number" name="age" ng-model="age" /&gt;
      &lt;/p&gt;
&lt;/form&gt;</pre>

위와 같이 ngForm을 이용하여 폼을 구성한 뒤, 크롬 브라우져 콘솔을 이용해 앵귤러에서 자동으로 생성해 주는 클래스들을 살펴보자.

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-21-오후-11.15.39.png"><img class="alignnone size-large wp-image-442" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-21-오후-11.15.39-1024x211.png" alt="스크린샷 2015-07-21 오후 11.15.39" width="640" height="132" /></a>

html 파일에 클래스를 적용하지 않았지만 <code>.ng-pristine</code> <code>.ng-untouched</code> <code>.ng-valid</code> 클래스가 자동으로 붙는다. 이것은 <code>ngForm</code>을 사용했기 때문에 angular.js에서 자동으로 붙여준 클래스들이다. 이 필드는 초기상태로 아무련 변경이 없고 (<code>.ng-pristine</code> <code>.ng-untouched</code>) 빈 값이지만 유효한 값이라는(<code>.ng-valid</code>) 의미다. 그럼 텍스트를 입력해 보자. 클래스가 어떻게 변하는가?

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-21-오후-11.16.03.png"><img class="alignnone size-large wp-image-443" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-21-오후-11.16.03-1024x217.png" alt="스크린샷 2015-07-21 오후 11.16.03" width="640" height="136" /></a>

<code>.ng-dirty</code>, <code>ng-valid-parse</code>, <code>ng-touched</code>가 추가되었다. 필드 값에 어떤 변화가 있었다는 의미의 클래스명이 추가되었다.  이처럼 <code>ngForm</code>을 사용하면 자동으로 폼 필드에 대한 사용자 액션과 필드 값에 대한 밸리데이션 정보를 클래스명에 담아서 붙여준다. 이러한 클래스 명은 폼 데이터에 대한 사용자 인테페이스를 구현하는데 이용할 수 있다. 간단하게 해당 클래스를 스타일시트에서 정의해 주면된다.

<pre class="lang:css decode:true " title="style.css">form .ng-dirty.ng-valid {
    background-color: green;
}
form .ng-dirty.ng-invalid {
    background-color: red;
}</pre>

입력한 폼 데이터가 유효하면 초록색 그렇지 않으면 빨간색을 출력하게 된다.

<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-21-오후-11.23.54.png"><img class="alignnone  wp-image-444" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-21-오후-11.23.54.png" alt="스크린샷 2015-07-21 오후 11.23.54" width="287" height="81" /></a>

<a href="https://github.com/jeonghwan-kim/ngForm">코드 보기 </a>