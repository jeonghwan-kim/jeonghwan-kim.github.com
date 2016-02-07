---
id: 958
title: ng-plualize 단수, 복수형 처리
date: 2015-12-21T09:56:48+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=958
permalink: /ng-plualize-%eb%8b%a8%ec%88%98-%eb%b3%b5%ec%88%98%ed%98%95-%ec%b2%98%eb%a6%ac/
categories:
  - Angular.js
tags:
  - angular
  - angular-directive
  - gist
  - ng-plualize
  - ngPlualize
---
제목 정하기가 쉽지 않다. 영어에는 단수, 복수에 대한 문법이 확연하게 드러난다. "an apple"과 "two apples". 그러나 한국어로는 사과가 몇개이든 그냥 뒤에 사과를 붙인다. 사과 2개라고 하지 사과들 2개라고 하지 않는다.

[ng-plualize](https://docs.angularjs.org/api/ng/directive/ngPluralize)는 영어 문법에서 드러나는 단수, 복수 문자 표현을 위한 앵귤러 디렉티브다. 하나의 변수에 대해 그 변수가 0이거나 값이 없을 때, 1일 때, 그 이상일 때에 따라 문자열을 다르게 표현할 수 있다. 

<script src="https://gist.github.com/jeonghwan-kim/96cb75b6b11183a96ec7.js"></script> 

`count` 속성에 연결된 `remainingCount`의 값에 따라 문자열은 다르게 출력되는데 그것은 `when` 속성에서 객체로 정의한다. `other`에 설정된 `{}`는 `remainingCount`의 값을 출력함으로서 remaingCount=5일 경우 "5 itmes"로 출력된다.
