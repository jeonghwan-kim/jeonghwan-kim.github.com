---
slug: "/2024/07/09/lecture-http-part3"
date: 2024-07-09 00:01:00
title: "[HTTP] 3편. AJAX"
layout: post
series: "HTTP"
---

_3편 소개_

- 직접 만들 수 있는 HTTP 요청
- **6장. AJAX 요청과 응답**: fetch 함수로 AJAX 요청과 응답을 다루는 법에 대해
- **7장. AJAX 진행율과 취소**: AJAX 진행율을 계산하는 방법과 요청을 취소하는 방법에 대해
- **8장. AJAX 라이브러리**: fetch와 XHR 객체 기반의 주요 AJAX 라이브러리

# 6장. 업로드와 응답

## 6.1 AJAX

- From 요청은 비교적 느림
- AJAX, Asynchronous JavaScript and XML
- XHR과 fetch

## 6.2 Fetch API

- fetch(url, [options]) 함수
- Request 객체
- 로그인 POST 요청 제작
- JSON 형식

## 6.3 Response 객체

- fetch()는 응답 객체로 이행하는 프라미스를 반환
- 응답 헤더
- 응답 본문

## 6.4 중간정리

- Form은 화면을 갱신하는 반면 AJAX는 화면을 유지한 채 HTTP 요청을 만들수 있습니다.
- fetch() 함수는 url과 옵션을 지정해 HTP 요청을 만듭니다.
- fetch는 Response 객체로 이행하는 프라미스를 반환합니다.
- Response 객체는 응답 본문을 조회하는 메소드를 제공합니다.

### 참고

- [Fetch API | MDN](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API)
- [HTTP 상태 코드 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)
- [Fetch | 모던 자바스크립트 튜토리얼](https://ko.javascript.info/fetch)

# 7장. 진행율과 취소

## 7.1 응답 진행율

- Response: body 속성
- 서버 준비
- 응답 진행율 계산

## 7.2 응답 취소

- AbortController
- AbortSignal
- Request: signal 속성
- 응답 취소 구현

## 7.3 요청 진행율

- XHR 객체로 요청 진행율 계산
- progress 이벤트 활용

## 7.4 중간정리

- fetch로 응답 진행율을 계산할 수 있다.
- fetch로 응답을 취소할 수 있다.
- XHR 객체로 요청 진행율을 계산할 수 있다.

### 참고

- [Fetch Progress | JAVASCRIPT.INFO](https://ko.javascript.info/fetch-progress)
- [ReadableStream | MDN](https://developer.mozilla.org/ko/docs/Web/API/ReadableStream)
- [Fetch Abort | MDN](https://ko.javascript.info/fetch-abort)
- [AbortController | MDN](https://developer.mozilla.org/ko/docs/Web/API/AbortController)
- [AbortSignal | MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
- [XMLHttpRequst | JAVASCRIPT.INFO](https://ko.javascript.info/xmlhttprequest)

# 8장. 라이브러리

## 8.1 SuperAgent

- XHR 기반. 2011년 출시. 콜백 스타일
- HTTP 메소드별 전용 함수
- Error 클래스를 확장한 오류 객체
- 플러그인으로 확장

## 8.2 Axios

- XHR 기반. 2014년 출시. 프라미스 기반
- HTTP 메소드별 전용 함수
- AxiosError
- 인터셉터로 확장

## 8.3 Ky

- fetch 기반. 2018년 출시. 타입스크립트
- HTTP 메소드별 전용 함수
- 프라미스 사용을 간소화
- Error 클래스를 확장한 HTTPError
- 훅으로 확장

## 8.4 Wretch

- fetch 기반. 2017년 출시. 타입스크립트
- HTTP 메소드별 전용 함수
- Error 클래스 확장한 WrechError
- 미들웨어, 애드온으로 확장

## 8.5 중간정리

- 비슷한 점
  - HTTP 메소드별로 함수를 제공한다.
  - 일관된 응답 객체를 제공한다.
  - 일관된 오류 객체를 제공한다.
  - 구조와 이름만 다를 뿐 확장하는 인터페이스를 제공한다.
- 다른 점
  - SuperAgent: 가장 오래됨. 크로스브라우져
  - Axios: xhr 기반. 프라이스 인터페이스 제공
  - Ky: fetch 기반. 프라미스 사용 간소화
  - Wretch: 오류 전용 캐처, 미들웨어, 애드온 등 편의 제공

### 참고

- [SuperAgent | Github](https://github.com/ladjs/superagent)
- [Axios | Github](https://github.com/axios/axios)
- [Ky | Github](https://github.com/sindresorhus/ky)
- [Wretch | Github](https://github.com/elbywan/wretch)
