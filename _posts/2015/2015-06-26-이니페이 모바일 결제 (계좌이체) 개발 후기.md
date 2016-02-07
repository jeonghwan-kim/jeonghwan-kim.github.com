---
id: 410
title: 이니페이 모바일 결제 (계좌이체) 개발 후기
date: 2015-06-26T09:14:45+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=410
permalink: /%ec%9d%b4%eb%8b%88%ed%8e%98%ec%9d%b4-%eb%aa%a8%eb%b0%94%ec%9d%bc-%ea%b2%b0%ec%a0%9c-%ea%b3%84%ec%a2%8c%ec%9d%b4%ec%b2%b4-%ea%b0%9c%eb%b0%9c-%ed%9b%84%ea%b8%b0/
categories:
  - Php
tags:
  - hapijs
  - php
  - 이니시스
  - 이니페이모바일
---
<h1>신용카드 결제와 다른점</h1>
신용카드와 달리 계좌이체는 P_NOTI_URL을 추가로 설정한다. 모바일에서 결제 신청을 하면 이니시스 서버에서는 결제가 되었을 때 (입금 되었을때) P_NOTI_URL을 호출하는 방식이다.
<h1>인코딩 문제</h1>
NODE를 포함한 대부분의 언어에서 UTF8 언어셋을 기본으로 사용한다. 이는 다른 서비스와 연동할때도 전혀 문제될 것이 없었다.  EUC-KR를 사용하는 이니시스와 이를 Node.js 기반의 Hapi.js로 구현해야 할때는 문제가 될수 있었다. 어떤 삽질을 했는가 살펴보자. 여러번 시도를 했지만 요약하면 아래 두 가지 방법이었다.
<h1>'신용카드 결제와 똑같은 방법으로 하면 되겠지'</h1>
pipe를 사용하자. <a href="https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding#solution">response 객체에 pipe 를 달아 디코딩한 것</a>처럼 이니시스에서 들어오는 프로토콜의 request 객체에 pipe를 달면 되지 않겠는가 생각했다. 사실 hapi를 사용했기 때문에 request를 바로 사용하지 못하고 request.raw.req 객체를 사용해야 한다. 이번 경우는 아닌가 보다.
<h1>hapi 라우팅 구조를 해킹하자!</h1>
<a href="http://hapijs.com/api#requests">hapi 라우팅 구조</a>를 보고 적절한 위치에서 디코딩해 주면 되지 않을까? 이번엔 http request의 'data', 'end' 이벤트를 걸어서 데이터 chunk를 모아서 디코딩하자. 여전히 안된다.
<h1>이니시스가 하라는대로 하자.</h1>
이니시스에서 제공하는 샘플파일 중 php 코드가 있다. php 서버를 별도로 만들었다. 역시 바로 되지는 않고 이도 디코딩 과정이 필요하다. 요청한 데이터를 부분적으로 iconv로 디코딩하니 해결된다.

`iconv('EUCKR', 'UTF8', 파라메터)`

&nbsp;