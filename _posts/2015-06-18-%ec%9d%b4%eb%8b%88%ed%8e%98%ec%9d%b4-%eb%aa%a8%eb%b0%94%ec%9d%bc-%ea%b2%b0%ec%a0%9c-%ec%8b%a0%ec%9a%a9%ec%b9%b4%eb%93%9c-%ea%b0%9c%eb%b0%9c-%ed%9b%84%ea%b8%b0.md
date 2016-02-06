---
id: 396
title: 이니페이 모바일 결제 (신용카드) 개발 후기
date: 2015-06-18T09:03:02+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=396
permalink: /%ec%9d%b4%eb%8b%88%ed%8e%98%ec%9d%b4-%eb%aa%a8%eb%b0%94%ec%9d%bc-%ea%b2%b0%ec%a0%9c-%ec%8b%a0%ec%9a%a9%ec%b9%b4%eb%93%9c-%ea%b0%9c%eb%b0%9c-%ed%9b%84%ea%b8%b0/
dsq_thread_id:
  - 4553873037
categories:
  - Node.js
tags:
  - 이니시스
  - 이니페이모바일
---
이니시스 모바일 결제 서비를 사용하게되어 시작함. 개발 문서도 샘플 소스도 제공하지만 한참이나 삽질을 거듭한 후 테스트 결제에 성공함.  대략적으로 작성된 개발 문서와 5년이 지난 샘플 코드가 개발자 입장에서 상당히 아쉽다. 예를 들면 프로토콜 메소드 명이라던가 실제 구동할 수 없는 샘플코드는 많은 시행착오를 격을 수 밖에 없다.

본 문서에서는 이니시스 결제 서비스 중 이니페이 모바일 결제의 신용카드 결제 로직 개발 후기를 기록한 것임. (개발환경: nodeJS, iOS)
<h1>순서</h1>
<strong>모바일</strong>에서 이니시스 인증 서버로 인증 요청. 이때 P_NEXT_URL에 리시브 서버 URL를 담아 보낸다.

<strong>이니시스 인증 서버</strong>는 P_NEX_URL을 참고하여 리시브 서버의 URL을 호출한다. 이 때 이니시스 인증서버는 P_REQ_URL 파라메터에 이니스시 승인 서버 URL를 담아서 리시브 서버로 보내준다.

<strong>리시브 서버</strong>는 이니시스 인증서버에서 보내준 P_REQ_URL 값을 확인하여 이니시스 결제서버로 결제 승인 요청을 보낸다.

<strong>이니시스 결제 서버</strong>는 결제를 승인하고 그 결과를 리시브 서버로 보내준다.
<h1>이슈</h1>
<strong>모바일에서 이니시스 인증서버로 인증 요청을 어떻게 하나?</strong>

GET 메소드를 통해 보낸다. 문제는 복합필드를 어떻게 설정하는가이다. 복합필드 P_RESERVED라는 하나의 필드에 &amp;로 구분된 값이 들어간걸 보면 POST 메소드를 호출해야 할 것만 같다. GET으로 요청해서 보내면 &amp; 문자로 쪼개저서 들어갈게 뻔하니깐. 그러나 아니다. GET 메소드를 사용하되 복합필드는 배열로 입력해야한다.
<pre class="lang:xhtml decode:true crayon-selected">?P_RESERVED[]=twotrs_isp=y&amp;P_RESERVED[]=block_isp=Y&amp;P_RESERVED[]=twotrs_isp_noti=N</pre>
<strong>리시브 서버는 이니시스 결제서버로 결제 승인요청을 어떻게 보내나?</strong>

문서에서는 http-socket을 사용하라고 한다. 사실 이게 정확인 뭔지 잘 몰랐다. 웹소켓을 말하는건가? 문서의 php 코드 함수명으로 로직만 알려준다.

`setSocket(), requestSocket(), responseSocket()`

이런걸 보고 나서 '소켓을 사용해야 하나 보구나' 라고 판단. socket.io-client, net 모듈을 사용해 소켓으로 접속 시도. 그러나 한참을 삽질한 후 그냥 http 콜을 날리면 될 것 같은 느낌. <a href="https://github.com/request/request">request</a> 모듈로 호출하니 결재에 성공했다.

<strong>이니시스 결제서버가 보내준 결재 데이터는 euc-kr 인코딩이다. utf8을 사용하는 노드 서버에서는 깨진다.</strong>

인코딩이 문제다. 원인은 이렇다. 이니시스 결제 서버에서는 euc-kr로 인코딩된 정보를 데이터 스트림으로 보내고 request 모듈을 이를 utf-8로 인코딩기 때문. 그래서 받은 데이터를 utf-8로 인코딩한 버퍼를 생성한 뒤 euc-kr로 더블 인코딩 시도. 그러나 utf-8은 인코딩시 일부 데이터가 누락될 수 있음. 문제는 여전함.

<a href="https://github.com/ashtuchkin/iconv-lite">iconv-lite</a> 의 <a href="https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding">https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding</a>문서 참고. http 리퀘스트는 응답을 받을 때 데이터를 한번에 받지 않고 조각조각 수신한다. 그때마다 수신 데이터 조각을 utf8로 자동 인코딩하는데 이때 문제가 발생하는 것이다. 문서에서는 데이터 조각을 수신할 때마다 euc-kr로 인코딩하여 데이터를 모으라는 것이다. 이 방법에 대해서도 친절히 안내하고 있다.

노드 기본 모듈을 http로 결제 승인 요청을 보내고, 이니시스 결제 서버가 보내준 결과 수신시 iconv-lite 모듈의 decodeStream() 함수로 인코딩하여 재대로된 결과를 받는데 성공함!

&nbsp;