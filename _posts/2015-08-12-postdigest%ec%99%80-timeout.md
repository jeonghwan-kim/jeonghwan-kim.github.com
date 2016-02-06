---
id: 618
title: $$postDigest()와 $timeout()
date: 2015-08-12T00:35:20+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=618
permalink: /postdigest%ec%99%80-timeout/
AGLBIsDisabled:
  - 0
categories:
  - Angular.js
tags:
  - $$postDigest
  - angular
  - timeout
---
# 배경

앵귤러에서 뷰와 데이터를 연결하는 것이 스코프다. 데이터가 변경되는 것에 따라 뷰에 반영해야 하는데 Digest 싸이클을 통해 이뤄진다. Digest 싸이클을 통해 변경된 스코프 변수는 자동으로 뷰에 반영된다. 이것은 Digest 싸이클이  scope.$watch에 등록된 스코프 변수들을 감시하기 때문에 가능하다.

가끔 이런 상황이 있다. foo라는 디렉티브를 만들고 부모 컨트롤러의 스코프 변수 boo를 foo 디렉티브 스코프에 양방향 바인딩한다.
<pre class="lang:default decode:true ">&lt;foo data="boo" ng-controller="ctrl"&gt;</pre>
그리고 foo에서 스코프변수 boo를 변경하면 부모 컨트롤러의 스코프 변수에도 boo 값이 반영되도록해야 한다. 그러나 Digest 싸이클이 예상대로 동작하지 않은 경우도 있다.

이러한 현상을 겪다보면 불가피하게 $scope.$digest()나 $scope.$apply() 함수를 호출해 싸이클을 강제로 돌리려고 한다. 그러나 우리 마음처럼 실행되지 않는다. 오히려 동작하지 않는 경우가 태반이다. 우리의 목적은 Digest 싸이클을 동작시켜서 foo 디렉티브에서 변경한 boo 변수를 부모 컨트롤러에서도 반영하기 위함이다. 그리고 변경된 boo 값을 가지고 무언가 작업(koo())를 해야한다.

# 방법

Digest 싸이클을 동작하는 방법 중 다음 두가지를 보자.
<ul>
	<li>$timeout()</li>
	<li>$$postDigest()</li>
</ul>
이 함수들은 Digest 싸이클을 동작시키고, 함수의 파라매터인 콜백 함수는 Digest 싸이클이 완료된 후 실행될 것이다.
<pre class="lang:default decode:true">// $timeout() 를 사용한 예
$timeout(function () {
  // After digest cycle
  koo()
}, 0);

// $$postDigest() 를 사용한 예
$scope.$$postDigest(function () {
  // After digest cycle
  koo()
});</pre>
보통 함수 이름이 직관적이라는 이유로 $$postDigest() 를 사용했다. 그러나 앵귤러에서 $$는 비공개(private)를 뜻한다. 당장은 문제를 해결할수 있겠지만 어쨌든 올바른 사용법은 아니다. 반면 <a href="https://docs.angularjs.org/api/ng/service/$timeout">$timeout</a>은 공개된 앵귤러 서비스다. $timeout()를 사용해야 한다. 호출시 Digest 싸이클이 바로 동작하고 그후 콜백함수에서 필요한 koo() 작업을 수행할 수 있다.

참고:
<ul>
	<li><a href="http://blogs.microsoft.co.il/choroshin/2014/04/08/angularjs-postdigest-vs-timeout-when-dom-update-is-needed/">http://blogs.microsoft.co.il/choroshin/2014/04/08/angularjs-postdigest-vs-timeout-when-dom-update-is-needed/</a></li>
	<li data-wpview-marker="http%3A%2F%2Fwww.mimul.com%2Fpebble%2Fdefault%2F2014%2F09%2F14%2F1410669616494.html"><a href="http://www.mimul.com/pebble/default/2014/09/14/1410669616494.html">http://www.mimul.com/pebble/default/2014/09/14/1410669616494.html</a></li>
</ul>
&nbsp;