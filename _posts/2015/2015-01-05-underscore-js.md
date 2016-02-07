---
id: 60
title: underscore.js
date: 2015-01-05T22:16:09+00:00
author: Chris
layout: post
guid: http://54.64.213.117/?p=60
permalink: /underscore-js/
categories:
  - Javascript
tags:
  - javascript
  - underscorejs
---
자바스크립트 코딩시 구 버전 웹브라우져까지 고려한다면 ECMAScript 스펙을 기준으로 한 깔끔한 코딩을 유지하기 어렵다. 자바스크립트 배열을 체크하는 코드를 살펴보자.

<pre class="lang:js decode:true" title="Kangax의 타입체크 ">function isArray (val) {
  return Object.prototype.toString.call(value) === "[object Array]";
}</pre>

그나마 짧은 코드이긴 하지만 뭔가 꼼수 같다. underscore 라이브러리를 사용한다면 <code>isArray()</code>로 검사하면 충분하다. underscore는 자바스크립트의 아쉬운 부분을 채워주는 유틸리티 라이브러리다.

<h1>Underscore.js</h1>

사용법은 간단한다. underscore.js 로딩 후 예약어 <code>_</code>를 사용한다. (JQuery의 <code>$</code> 예약어와 유사) NodeJS를 서버로 사용한다면 정확히 같은 방식으로 사용할 수 있다. 수십가지 함수들은 카테고리별로 분류되어있고 <a href="http://underscorejs.org">홈페이지</a>와 몇몇 블로그에 잘 설명 되어있다. 몇가지 빈번히 사용되는 함수를 살펴보자.

<h1>유용한 함수</h1>

<a href="http://underscorejs.org/#map">map()</a>: 컬렉션 전체를 순회하면서 속성과 값을 변경하는데 사용한다.

<a href="http://underscorejs.org/#isArray">isArray()</a>, <a href="http://underscorejs.org/#isString">isString()</a>: is~로 시작되는 함수들은 자바스크립트 타입을 체크하거나 객체의 특성(비었는가? 같은가?)을 체크한다.

<a href="http://underscorejs.org/#extend">extend()</a>: 두 객체를 합쳐서 하나의 객체로 만들때 사용한다. 상당히 자주 사용한다.

<a href="http://underscorejs.org/#without">without()</a>: 배열에서 특정 요소를 제거한뒤 반환한다.

<a href="http://underscorejs.org/#omit">omit()</a>: 객체의 특정 속성을 제거한다. 만약 객체로 구성된 배열을 다룰때 각 배열에서 어떤 속성을 제거한다면 <code>map()</code>과 함께 사용한다면 매우 편리하다.

<a href="http://underscorejs.org/#times">times()</a>: 특정 배열의 길이만큼 어떠한 값을 설정하여 새로운 배열로 반환할때 사용할수 있다. 아래처럼 arr배열 길이와 동일한 arr1배열을 만들고 'foo'라는 값으로 채울 수 있다.

<pre class="lang:js decode:true  ">var arr = [1, 2, 3];
var arr1 = _(arr.length).times(function () { return 'foo'; });
    // ['foo', 'foo', 'foo']</pre>

<h1>겹치는 함수</h1>

<code>random()</code>, <code>every()</code>, <code>each()</code>, <code>some()</code> 등 EMCAScript 스펙과 겹치는 함수들도 있다. 이들은 NodeJS 표준 지원이 좋은 환경에서는 굳이 사용하지 않아도 되지만, 구버전 브라우져에서는 유용하게 사용할수 있을것 같다.

&nbsp;