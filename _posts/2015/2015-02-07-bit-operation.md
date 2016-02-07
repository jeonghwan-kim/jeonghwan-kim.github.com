---
id: 156
title: 비트 연산
date: 2015-02-07T23:08:18+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=156
permalink: /bit-operation/
categories:
  - 미분류
tags:
  - '&amp;'
  - |
  - 비트연산
---
비트연산은 공부할 때만 익혔지 실제 프로그래밍에 사용해 본적은 이번이 처음이다. '간단히 비트 연산으로 하면되지' 라고 생각했지만 코딩한 경우는 처음이라 어색했다. 몇 가지 비트연산을 정리해 보자.

<h3>Case 1. OR 연산</h3>

비트연산은 각 자리을 true / false 로 표현한다. 이진수 <code>001</code>과 <code>010</code>은 각 각 별도의 값을 의미하고  <code>011</code>은 앞의 두 값을 합한 값을 의미한다. 예를 들어 <code>001</code>이 '사과'이고 <code>010</code>이 '당근'이라면 <code>011</code>은 '사과, 당근'을 의미한다. 이것은 OR 연산으로 쉽게 계산할 수 있다.

<code>001</code> | <code>010</code> = <code>011</code>

실제 코딩에서 사용한다면 십진수에 비트 연산을 사용하면 된다.

<code>1</code> | <code>2</code> = <code>3</code>

OR 연산으로 나온 결과를 'A'라고 부르자.

<h3>Case 2. AND 연산</h3>

위에서 정한 'A'를 저장한 뒤 검색할 수 있다. 예를 들어 우리가 저장한 'A' (<code>011</code>)에 '사과'(<code>010</code>)가 있는지 검색하는 경우다. 이때는 'A'와 사과를 AND 연산으로하고 그 결과가 0보다 큰지 판단하여 검색할 수 있다.

<code>011</code> &amp; <code>010</code> = <code>010</code>

만약 'A'에 없는 데이터인 '가지'(<code>100</code>)를 검색하는 경우는 어떨까?

<code>011</code> &amp; <code>100</code> = <code>000</code>

결과가 0이다. A에 가지는 없는 것이다.

<h3>Case 3. 다중값을 검색할 경우</h3>

'A'에서 다중값이 있는지도 검색할 수 있다. 예를 들어 'A'(<code>011</code>)에 '사과'(<code>010</code>)와 '당근'(<code>001</code>) 둘다 포함되어 있는지 알고 싶은 경우다. 이때는 검색할 대상들을 OR연산하고 그 결과'B'를 'A'와 AND 연산하여 그 결과가 'B'와 같으면  검색 성공이다.

(<code>010</code> | <code>001</code>) &amp; <code>011</code> = <code>011</code>

<code>011</code> = <code>011</code>

반대로 '사과'(<code>010</code>)와 '가지'(<code>100</code>)는 찾을 수 없다는 결과가 나온다.

(<code>010</code> | <code>100</code>) &amp; <code>011</code> = <code>010</code>

<code>010</code> != <code>011</code>