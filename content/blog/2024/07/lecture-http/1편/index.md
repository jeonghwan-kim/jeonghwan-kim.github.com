---
slug: "/2024/07/07/lecture-http-part1"
date: 2024-07-07 00:01:00
title: "[HTTP] 1편. HTTP 기본"
layout: post
series: "HTTP"
---

# 1장. HTTP 시작

## 1.1 문서 배포

- 웹 어플리케이션의 동작 원리와 HTTP의 역할
- HTTP로 전하는 강의
- 간단한 강의 제공 애플리케이션 구현

## 1.2 더 많은 문서

- 더 많은 수업 자료를 여러 페이지로 제공하려면 파일로 분리
- 파일 기반 콘텐츠 제공 서버
- 동적 URL 지원 클라이언트

## 1.3 HTTP/0.9

- 초기버전
  - 1989년 CERN에서 팀 버너스 리가 제안
  - HTML, HTTP, httpd, WorldWideWeb
  - 1990년 프로토콜 완성
  - 1991년 외부 공개
- 이후 버전
  - 1996년 http/1.0
  - 1997년 http/1.1
  - 2015년 http/2
  - 2018년 http/3
- 핵심 구조
  - URL
  - 헤더
  - 본문
  - 상태코드

## 1.4 cURL

- 수업 방식: 서버와 클라이언트 간의 요청과 응답을 분석하면서 프로토콜을 이해
- cURL(client for URL): URL을 받아 서버로 요청을 보내고 받은 응답을 출력하는 도구
- [cURL 다운로드](https://curl.se/download.html)

```shell
# 요청을 보내고 응답을 받았다.
$ curl http://localhost:3000/1-1_http-start.txt
```

- --verbose, -v: http 메세지 자세히 보기

## 1.5 중간 정리

- HTTP의 초기 버전(http/0.9) 구현
- 1990년 팀 버너스 리가 HTML, HTTP, httpd, WorldWideWeb 로 구성해 초기 구조를 제안
- cURL
- 참고
  - [HTTP의 진화 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP)
  - [WorldWideWeb](https://worldwideweb.cern.ch/browser/)
  - [cURL | 김정환블로그](/2023/12/03/curl)

# 2장. HTTP 메시지

## 2.1 흐름

- 순서: TCP 연결, HTTP 요청 메시지, HTTP 응답 메시지, TCP 종료
- 비유: 통화. 전화걸기, 말하기, 듣기, 전화끊기

TCP 연결:

```shell
$ curl http://localhost:3000/1-1_http-start.txt -v

* Trying [::1]:3000...
* Connected to localhost (::1) port 3000
```

HTTP 요청 메시지:

```shell
> GET /1-1_http-start.txt HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/8.4.0
> Accept: */*
>
```

HTTP 응답 메시지:

```shell
< HTTP/1.1 200 OK
< Date: Sat, 06 Jul 2024 00:17:27 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Content-Length: 23
<
1.1 HTTP Start
bla bla
```

TCP 종료:

```shell
* Connection #0 to host localhost left intact
```

- curl은 http 프로토콜을 사용하는 클라이언트 도구
- tcp 위에서 연결, 메세지, 종료를 위한 메세지를 curl이 자동으로 만들어 준다.

--

- TCP 메세지를 직접 제어할 수도 있다. (더 명확하게 이해)

TCP 연결:

```shell
$ nc localhost 3000
Connection to localhost port 3000 [tcp/hbci] succeeded!
```

HTTP 요청 메시지:

```shell
GET /1-1_http-start.txt HTTP/1.1

```

HTTP 응답 메시지:

```shell
HTTP/1.1 200 OK
Date: Sat, 06 Jul 2024 00:34:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 23

1.1 HTTP Start

bla bla%
```

TCP 종료:

```shell

```

## 2.2 URL

- Uniform Resource Locator
  - 인터넷 상의 자원을 식별하는 역할
- 형식: 프로토콜//도메인:포트?쿼리키=쿼리값#앵커
  - 프로토콜: <strong style="font-size: 1.2em">http:</strong>//도메인:포트?쿼리키=쿼리값#앵커
  - 도메인: http://<strong style="font-size: 1.2em">localhost</strong>:포트?쿼리키=쿼리값#앵커
  - 포트: http://localhost:<strong style="font-size: 1.2em">3000</strong>?쿼리키=쿼리값#앵커
  - 쿼리문자열: http://localhost:3000?<strong style="font-size: 1.2em">search=name</strong>#앵커
  - 프레그먼트: http://localhost:3000?search=name#<strong style="font-size: 1.2em">title</strong>

## 2.3 요청

- 요청 메시지: 메서드와 경로, 헤더, 본문(선택사항)으로 구성

```shell
$ curl http://localhost:3000/1-1_http-start.txt

> GET /1-1_http-start.txt HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/8.4.0
> Accept: */*
>
```

- 메서드: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
- 경로: 파일 위치
- 헤더: 부가 정보. (예: Content-Type: text/html)
- 본문: 선택 사항. (예: POST 폼 데이터 전송)

## 2.4 응답

- 응답 메세지: 상태코드, 헤더, 본문으로 구성

```shell
< HTTP/1.1 200 OK
< Date: Sun, 07 Jul 2024 06:51:15 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Content-Length: 23
<
1.1 HTTP Start

bla bla
```

- 상태 코드: 2XX(성공), 3XX(리다이렉션), 4XX(요청 오류), 5XX(서버 오류)
- 헤더: 부가 정보. (예: Content-Length: 23)
- 본문: 파일 내용

## 2.5 중간 정리

- HTTP 흐름: tcp 연결, 요청 메시지, 응답 메세지, tcp 종료
- URL
- 요청 메시지
- 응답 메세지
- 참고
  - [HTTP 개요 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Overview)
  - [웹의 리소스 식별하기 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web)
