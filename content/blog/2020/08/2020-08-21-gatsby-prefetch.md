---
title: "개츠비와 프리패치"
layout: post
category: dev
tags: [gatsby, prefetch]
---

페이지 로딩 성능을 높이기 위한 방법 (캐쉬: cache-control, 압축: gzip)
개츠비에서 발견한 방법: prefetch, preload

# 프리패치와 프리로딩

프리패치(prefetch): 방문할 페이지의 리소스를 미리 다운로드
프리로드(preload): 방문한 페이지의 리소스를 빠르게 다운로드

# 개츠비는 어떻게 동작하는가?

## 코드 분할

- import 구문을 만나면 코드를 나눈다. 개츠비는 페이지 단위로 나누도록 설정했다.
- page-data.json을 만든다. 페이지에서 필요한 청크 정보를 여기에 기록

## 프리로딩

- 나눈 조각들을 프리로딩한다. 어떤효과?
- 프리로딩하지 않은것에 비해 빠르게 리소스를 다운로드한다. (js, json)
- /_<![CDATA[_/ 로 \_\_\_chunkMapping 을 만든다. 이건 프리패치에서 사용함

## 프리패치

- 하이퍼링크에 포커스하면 프리패칭을 시작한다.
- json데이터를 가져온다. 다음 페이지에 필요한 리소스 목록이 담겼다.
- \_\_\_chunkMapping과 조합해서 리소스 uri를 계산한다.
- 다운로드 해서 브라우져 캐쉬에 저장한다. 다음 페이지 진입히 브라우져는 캐쉬를 사용할 것이다.

### GatsbyLink

- 프리패치를 가능케 하는 것이 GatsbyLink 컴포넌트다
- react-ourter의 <Link>를 확장한 것이다.
- <Link mouseEnter={() => ___loader.hovering(parsePath(prefixedTo).pathname)}>
- BaseLoader.hovering: this.loadPage(rawPath)
  - this.loadAppData(),
  - this.loadPageDataJson(pagePath),
  - fetchPageDataJson(loadObj) {
  - memoizedGet(url) {
  - doFetch
- ajax로 호출함
- <EnsureResource>: 리소스 보장? -> 요건 설명이 필요함?

# 결론

- 브라우져 성능을 위한 기술을 계속 발전하는 구나
- 공부 지속해야함.
