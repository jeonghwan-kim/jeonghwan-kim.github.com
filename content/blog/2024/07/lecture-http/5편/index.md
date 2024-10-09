---
slug: "/2024/07/11/lecture-http-part5"
date: 2024-07-11 00:01:00
title: "[HTTP] 5편. 보안"
layout: post
series: "HTTP"
---

_5편 소개_

- 브라우져 보안과 함께 HTTP 통신을 더 안전하게 만드는 TLS
- **13장. 브라우져 보안**: XSS(크로스 사이트 스크립팅)와 같은 공격 기법과 이를 방지하기 위한 브라우저 보안 정책
- **14장. CORS**: 외부 도메인의 자원을 안전하게 활용하기 위한 CORS 정책과 적용 방법
- **15장. HTTPS**: HTTPS가 네트워크 보안을 강화하는 방식과 TLS의 역할

# 13장. 브라우져 보안

- 브라우저 보안 지식을 알고 어플리케이션을 개발한다.

## 13.1 크로스 사이트 스크립팅

- 인라인 자바스크립트를 웹 문서에 주입한 공격
- 새니타이즈(Sanitize)로 예방
- HTML 태그를 웹 문서에 주입한 공격
- 이스케이프(Escape)로 예방
- 다른 공격의 기점이 됨.

## 13.2 세션 하이재킹

- 웹 어플리케이션의 로그인과 세션 관리
- 인증된 사용자에게 제공되는 맞춤형 HTML
- 쿠키 취약성을 이용한 세션 탈취 공격
- 쿠키 설정으로 예방

## 13.3 교차 사이트 요청 위조

- 사용자 권한을 탈취해 악의적인 요청을 보내는 공격
- 쿠키 설정으로 예방
- CSRF 토큰으로 예방
- CAPTCHA로 예방

## 13.4 컨텐츠 보안 정책

- Content-Security-Policy 응답 헤더
- CSP의 일반적인 사용 사례
- Content-Security-Policy-Report-Only 헤더(진단 보고서)
- 사례 탐구: google.com

## 13.5 동일 출처 정책

- 브라우져 스스로 자원 출처를 관리하는 보안 정책
- 적용 대상: AJAX, 웹 폰트
- CSP와 SOP 비교
- 균형

## 13.6 중간 정리

- 크로스 사이트 스크립팅 공격의 원리와 예방 방법
- 다양한 공격들: 세션 하이재킹, CSRF
- CSP와 SOP

### 참고

- [공격유형 | MDN](https://developer.mozilla.org/ko/docs/Web/Security/Types_of_attacks#cross-site_scripting_xss)
- [컨텐츠 보안 정책 | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/CSP)
- [동일 출처 정책 | MDN](https://developer.mozilla.org/ko/docs/Web/Security/Same-origin_policy#교차_출처_네트워크_접근)

# 14장. CORS

## 14.1 CORS의 동작 원리

- 용어 정리: 출처, 교차 출처 요청
- 재현: 웹 서버 준비
- 재현: 교차 출처 요청
- 해결: 서버가 허용할 출처를 명시한다.

## 14.2 단순 요청

- GET, POST, HEAD 메소드를 사용한다.
- 안전한 헤더를 사용한다.

## 14.3 사전 요청

- PUT, PATCH, DELETE 메소드를 사용한다.
- 사전 요청 캐시

## 14.4 CORS를 사용하는 요청

- fetch 함수, XMLHttpRequest 객체
- 웹 폰트(@font-face)

## 14.5 중간 정리

- CORS의 동작 원리
- 단순 요청
- 사전요청
- CORS를 사용하는 요청

### 참고

- (도서) 리얼월드 HTTP | 한빛미디어
- [CORS | JAVASCRIPT.INFO](https://ko.javascript.info/fetch-crossorigin)
- [교차 출처 리소스 공유 (CORS) | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)
- [expressjs/core | Github](https://github.com/expressjs/cors)

# 15장. HTTPS

## 15.1 해시

- 해시함수
- 특징: 고정 길이, 고유성, 변경 불가, 단방향
- MD5

## 15.2 암호화

- 해시 함수의 한계
- 특징: 암호화, 복호화, 키
- AES

## 15.3 비칭키 암호화

- 대칭키 암호화의 한계
- 특징: 서로 다른 키, 공개키, 개인키, 신분 증명
- RSA
- 암호화 방식 비교: 해시 함수, 대칭키 암호화, 비대칭키 암호화

## 15.4 디지털 서명

- 디지털 서명의 원리
- 디지털 서명 실습

## 15.5 디지털 인증서

- 디지털 인증서 원리
- 디지털 인증서 사례

## 15.6 TLS

- 1단계: TLS 핸드쉐이크
- 2단계: 데이터 전송

## 15.7 HTTPS 서버 제작

- 로컬 인증서 제작
- https 노드 모듈 사용

## 15.8 중간 정리

- 해시
- 암호화 (대칭키 암호화)
- 비대칭키 암호화
- 디지털 서명
- 디지털 인증서
- TLS
- HTTPS 서버 제작

### 참고

- HTTP 완벽 가이드 > 14장 보안 | 인사이트
- 리얼월드 HTTP | 한빛미디어
