---
slug: "/2024/07/07/lecture-http-part1"
date: 2024-07-07 00:01:00
title: "[HTTP] 1편. HTTP 기본"
layout: post
series: "HTTP"
---

_1편 소개_

- **1장. HTTP 시작**: 웹의 탄생 배경과 역사에 대해 알 수 있습니다.
- **2장. HTTP 메시지**: HTTP의 주요 요소에 대해 배우실 수 있습니다.

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

**HTTP 초기 버전**:

- 1989년 버너스리가 제안
- **HTML**: 하이퍼텍스트 마크업 언어
- **HTTP**: 하이퍼텍스트 전송 규약
- **httpd**: HTTP 서버 프로그램
- **WorldWideWeb**: 최초의 웹 클라이언트
- 1990년 프로토콜 완성
- 1991년 외부 공개

**이후 버전**:

- 1996년 http/1.0
- 1997년 http/1.1
- 2015년 http/2
- 2018년 http/3

**HTTP 핵심 요소**:

- URL
- 헤더
- 본문
- 상태코드

## 1.4 cURL

- **client for URL**의 약자. URL을 받아 서버로 요청을 보내고 받은 응답을 출력하는 도구
- [cURL 다운로드](https://curl.se/download.html)
- cURL로 HTTP 요청 및 응답 확인하기

## 1.5 중간 정리

- HTTP의 초기 버전을 직접 만들면서 이해했습니다.
- 이후에 http 프로토콜은 여러 버전으로 진화했습니다.
- 수업에서 사용할 도구를 소개했습니다.

### 참고

- [HTTP의 진화 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP)
- [WorldWideWeb](https://worldwideweb.cern.ch/browser/)
- [cURL | 김정환블로그](/2023/12/03/curl)

# 2장. HTTP 메시지

## 2.1 HTTP 흐름

- TCP 연결 수립 (3-Way Handshake)
- HTTP 메세지 전송
- HTTP 메세지 수신
- TCP 연결 종료

## 2.2 URL

- Uniform Resource Locator

```
프로토콜://도메인:포트/경로?쿼리문자열#앵커
```

- **프로토콜**: <strong style="font-size: 1.4em">http:</strong>//도메인:포트/경로?쿼리문자열#앵커
- **도메인**: <span>http</span>://<strong style="font-size: 1.4em">localhost</strong>:포트/경로?쿼리문자열#앵커
- **포트**: <span>http</span>://localhost<strong style="font-size: 1.4em">:3000</strong>/경로?쿼리문자열#앵커
- **경로**: <span>http</span>://localhost:3000<strong style="font-size: 1.4em">/ch01.txt</strong>?query=name#앵커
- **쿼리문자열**: <span>http</span>://localhost:3000/ch01.txt<strong style="font-size: 1.4em">?query=name</strong>#앵커
- **프레그먼트**: <span>http</span>://localhost:3000/ch01.txt?query=name<strong style="font-size: 1.4em">#title</strong>

## 2.3 요청

- 요청 메시지: 메서드와 경로, 헤더, 본문으로 구성
- 메서드: GET, POST, PUT, PATCH, DELETE
- 경로: 자원의 위치 위치
- 프로토콜 버전
- 요청 헤더
- 요청 본문

## 2.4 응답

- 상태 코드: 1xx, 2xx, 3xx, 4xx, 5xx
- 응답 헤더
- 응답 본문

## 2.5 중간 정리

- 클라이언트와 서버 간의 HTTP 흐름이 이해했습니다.
- URL을 시작으로 HTTP 메세지를 주고 받습니다.
- HTTP 요청
- HTTP 응답

### 참고

- [HTTP 개요 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Overview)
- [웹의 리소스 식별하기 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web)
