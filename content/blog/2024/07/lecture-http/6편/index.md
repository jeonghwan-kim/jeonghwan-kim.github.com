---
slug: "/2024/07/12/lecture-http-part6"
date: 2024-07-12 00:01:00
title: "[HTTP] 6편. 성능"
layout: post
series: "HTTP"
---

_6편 소개_

- 브라우져가 웹 페이지를 렌더링할 때 발생하는 HTTP 요청을 효율적으로 제어하는 다양한 기법
- **16장. 렌더링 최적화**: 외부 리소스의 로드 시점을 제어해 웹 성능을 최적화하는 기술
- **17장. 캐시**: 서버와 브라우저가 HTTP 헤더를 통해 캐싱 정책을 주고받아 성능을 최적화하는 메커니즘

# 16장. 로딩 최적화

## 16.1 렌더링 과정

- DSN 질의
- HTML 문서 획득
- 주요 렌더링 경로(Critical Rendering Path, CRP)
- 파싱을 차단하는 HTTP 요청

## 16.2 script 태그의 렌더링 영향도

- 웹 서버 준비
- 자바스크립트를 로딩하는 웹 문서 준비
- 응답 지연 기능 추가
- PerformanceAPI로 정확한 시간 측정

## 16.3 Async

- 파싱과 동시에 파일을 다운로드하는 방법
- 다운로드 완료한 순서대로 실행한다.
- DOM 에 무관하거나 서로 영향을 주지 않는 스크립트에 적합, 광고나 분석 트래커

## 16.4 Defer

- 순서대로 실행해야하는 스크립트
- 미리 다운로드한 뒤 실행 순서를 보장하는 방법
- 서로 의존하는 스크립트에 적합

## 16.5 Preload

- 웹문서에 필요한 자원을 미리 다운로드하는 방법
- 용량이 큰 이미지를 다운로드하는 상황
- 클릭과 동시에 이미지가 렌더링되도록 개선
- 이미지, 비디오, 스타일시트, 폰트, 자바스크립트 등에 활용

## 16.6 Prefetch

- 다음 페이지에서 사용할 자원을 미리 다운로드하는 방법
- 용량이 큰 다음 페이지로 이동하는 상황
- 링크 이동과 동시에 페이지가 렌더링되도록 개선
- 다음 문서의 렌더링 성능을 높일 때 활용

## 16.7 이미지 지연 로딩

- 브라우져가 img 태그의 이미지를 다운로드하는 시점
- 뷰 포트 안에 이미지만 다운로드하고 밖에 있는 이미지는 지연 로딩
- 이미지가 많은 사진첩이나 블로그에서 활용

## 16.8 중간 정리

- 주요 렌더링 경로에서 추가적인 HTTP 요청은 성능에 영향을 준다.
- **Async** 속성으로 자바스크립트를 비동기로 다운로드 할 수 있다.
- **Defer** 속성으로 자바스크립트의 실행 순서를 보장할 수 있다.
- **Preload**로 웹 페이지에 필요한 자원을 미리 다운로드 할 수 있다.
- **Prefetch**로 다음 페이지에 필요한 자원을 미리 다운로드 할 수 있다.
- **img 태그**로 로딩하는 이미지는 지연 로딩할 수 있다.

### 참고

- [주요 렌더링 경로 | MDN](https://developer.mozilla.org/ko/docs/Web/Performance/Critical_rendering_path)
- [defer, async 스크립트 | JAVASCRITP.INFO](https://ko.javascript.info/script-async-defer)
- [preload | MDN](https://developer.mozilla.org/ko/docs/Web/HTML/Attributes/rel/preload)
- [prefetch | MDN](https://developer.mozilla.org/ko/docs/Glossary/Prefetch)
- [img | MDN](https://developer.mozilla.org/ko/docs/Web/HTML/Element/img)

# 17장. 캐싱

## 17.1 시간 기반 캐싱

- 서버가 파일 수정일을 **Last-Modified** 응답 헤더에 실는다.
- 브라우져가 파일을 캐싱하고 **If-Modifed-Since** 요청 헤더에 실는다.

## 17.2 내용 기반 캐싱

- 시간 기반의 캐시는 한계가 있습니다.
- 파일 내용을 비교하는 방법을 **ETag**라고 합니다.
- 서버가 파일 해시값을 ETag 응답 헤더에 실는다.
- 브라우져가 파일을 캐싱하고 **If-None-Match** 요청 헤더에 실는다.

## 17.3 캐시 제어

- 서버는 더 세밀한 캐시 정책을 **Cache-Control** 응답 헤더에 실는다.
- **max-age**: 브라우져가 자원을 일정기간 캐싱하고 서버에 접속하지 않는다.
- **no-cache**: 브라우져는 캐시가 신선한지 매번 서버에 접속해 확인한다.
- **no-store**: 브라우져는 이 자원을 캐싱하지 않는다.

## 17.4 기타 캐싱 헤더

- **Expires**: 서버가 파일의 캐시 만료일을 지정하는 응답 헤더
- **Vary**: 서버가 클라이언트에게 캐시 식별자를 전달하는 헤더

## 17.5 캐싱 활용 전략

- **HTML이 아닌 파일**: 최대한 길게 캐싱한다.
- **HTML 파일**: 서버에 캐시 신선도를 확인한다.
- 파일별로 Cache-Control 캐시 정책을 전달해 브라우져가 네트웍 요청을 최소화 하도록 유도한다.

## 17.6 중간 정리

- 브라우져와 서버 간의 캐싱 관련 HTTP 헤더
- 브라우져와 서버간의 HTTP 캐싱 매커니즘 정리
- 캐시를 설정할 때는 무척 신중해야 한다.

### 출처

- [HTTP 캐싱 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Caching)
- [HTTP 캐싱 | 김정환블로그](/2024/02/08/http-caching)
- HTTP 완벽가이드 > 7장 캐시
- 리얼월드 HTTP > 2.8 캐시
- [캐시로 불필요한 네트워크 요청 방지 | web.dev](https://web.dev/articles/http-cache?hl=ko#examples)
- [HTTP 캐시로 불필요한 네트워크 요청 방지 | web.dev](https://web.dev/articles/http-cache?hl=ko)
- [HTTP 캐싱 동작 구성 | web.dev](https://web.dev/articles/codelab-http-cache?hl=ko)
