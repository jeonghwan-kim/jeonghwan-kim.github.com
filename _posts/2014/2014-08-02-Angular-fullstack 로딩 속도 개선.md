---
id: 16
title: Angular-fullstack 로딩 속도 개선
date: 2014-08-02T08:33:03+00:00
author: Chris
layout: post
guid: http://54.64.213.117/?p=16
permalink: /angular-fullstack-%eb%a1%9c%eb%94%a9-%ec%86%8d%eb%8f%84-%ea%b0%9c%ec%84%a0/
categories:
  - Angular.js
tags:
  - angular-fullstack
  - angularjs
  - gzip
  - laze load
  - pagging
---

서비스 개발시 프론트앤드와 백앤드를 구분하여 작업한다.
최근 노드와 몽고디비로 백앤드를 개발하고 앵귤러 프레임웍으로 프론트를 함께 개발하는 <a href="http://en.wikipedia.org/wiki/MEAN">MEAN 스택</a>을 사용하는 추세다.
이러한 풀스택 개발을 지원해 주는 프레임웍 중 하나가 앵귤러 풀스택(<a href="https://github.com/DaftMonk/generator-angular-fullstack">angular-fullstack</a>)이다.MEAN stack으로 개발시 브라우져단의 성능을 높일 수 있는 방법에 대해 알아보자.


## LAZY LOAD

뷰와 컨트롤러를 분리해 MVC 모델을 구현할 수 있는 것이 앵귤러의 장점이다. 각 페이지 별로 뷰와 컨트롤러 파일을 관리하기 때문에 서비스 규모가 커지더라도 로직 작성시 편리한 이점이 있다. 그러나 파일 갯수가 많아지면서 전체 파일을 로딩해야 하는 부담도 있다. 그래서 보통 <a href="http://www.requirejs.org/">requireJS</a>로 자바스크립트 파일을 동적으로 로딩하여 초기 로딩의 부담을 해결하는 방법을 사용한다.(<a href="http://weblogs.asp.net/dwahlin/dynamically-loading-controllers-and-views-with-angularjs-and-requirejs">참고1</a>, <a href="http://jcf.daewoobrenic.co.kr/blog/?p=237">참고2</a>) 그러나 angular-fullstack 에서는 모든 코드를 하나의 스크립트 파일로 합치고 이를 압축하기 때문에 로딩에 부담되지 않을 것 같다. 또한 이러한 구조를 적용하는 것도 어려울 것 같다.

다만 이미지가 많은 경우 이미지에 대해서는 <a href="http://www.appelsiini.net/projects/lazyload">lazy loading</a>이 필요하다. 브라우저에서 렌더링 되는 페이지의 이미지만 로딩하여 네트웍 트래픽을 줄이고 렌더링을 가볍게 하는 기법이다. 앵귤러에서도 이러한 lazy load를 디렉티브로 만들어 사용할 수 있다.(<a href="http://www.bennadel.com/blog/2498-lazy-loading-image-with-angularjs.htm">참고</a>)

<code>bnLazySrc</code>란 디렉티브를 정의하고, 이미지 태그에 <code>bnLazySrc</code> 속성을 추가하면 된다. <code>&lt;img&gt;</code> 앞의 jquery 라이브러리에서는 lazy loading 적용을 위해 별도로 자바스크립트 코드를 작성해야 한다. 그러나 bnLazySrc 디렉티브를 사용하면 추가 자바스크립트 코드 없이 알아서 동작한다.

기존에는 이미지가 많은 페이지와 적은 페이지 별로 로딩속도 차이가 컸다. 그러나 적용 후에는 일정한 시간내에 페이지를 로딩할 뿐만 아니라 그 속도도 1~2초 정도 빨라졌다.

```
PAGE     기존      LAZY LADING 적용 후
page1     8.92s   6.15s
page2     6.29s   6.12s
pgae3     5.81s   5.19s
average   7.01s   5.82s
```


## PAGGING

전체 페이지를 로딩하기에 너무 많은 시간이 걸린다면 페이징을 고려해 볼 수 있다. 두 가지 방법이 있다.

1. 페이지 번호를 매겨서 페이지 별로 로딩하는 방법과
1. 브라우져 스크롤을 감시하여 동적으로 로딩하는 방법.

후자의 방법을 적용해 보자.

우선 서버에서 데이터를 호출할 때, limit, skip 등의 파마메터를 추가하여 데이터를 쪼개서 요청한다.
이렇게 받은 데이터의 일부분만 브라우저에서 로딩하면 줄어든 데이터 만큰 로딩속도를 개선할 수 있다.
문제는 이러한 데이터를 어떻게 자연스럽게 보여주냐는 것.

사용자가 초기 수신한 데이터를 보다가 브라우져 스크롤다운할 때 이를 감지하여 나머지 데이터를 서버에 요청한다.
추가로 받은 데이터는 기존 데이터에 추가하여 다시 로딩한다.

[infinite-scroll](http://binarymuse.github.io/ngInfiniteScroll/)이 이것을 구현한 앵귤러 디렉티브다.
앵귤러 디렉티브는 정말 편리하다. 소스 코드를 다운받고 `ng-repeat`부분에 `infinite-scroll=more()` 부분을 추가한다.
그럼 `ng-repeat`으로 생성된 html 태그에 스크롤 될때 more() 함수가 실행되고,
more()는 서버에 추가 데이터를 요청하고 수신하여 기존 데이터에 추가하는 역할을 한다.
스크롤 민감도를 조절할 경우 `infinite-scroll-distance` 속성을 변경하면 된다.

적용 후 속도가 더 빨라 졌다. lazy loading으로 약 6초로 줄었던 로딩시간이 4초대로 더 개선 되었다.

```
PAGE     기존     LAZY LADING 적용 후    PAGING 적용후
page1    8.92s   6.15s                4.34s
page2    6.29s   6.12s                4.97s
pgae3    5.81s   5.19s                4.01s
average  7.01s   5.82s                4.44s</pre>
```


## GZIP

이젠 서버쪽에서 속도 개선을 시도해 보자. http에서 사용하는 표준 압축 알고리즘 중 하나인 gzip을 사용해 보자.
(<a href="http://en.wikipedia.org/wiki/HTTP_compression">참고</a>)

노드 익스프레스에서는 <a href="http://expressjs.com/3x/api.html#compress">compress</a> 미들웨어로 gzip을 구현할 수 있다.
매우 간단하다. 서버 생성시 compress 미들웨어를 추가만 하면 된다.  
`app.use(express.logger());` 단 미들웨어 중 상단에 적용해야 한다.

호스트맨 등으로 http 리퀘스트 테스트시 헤더에 <code>Accept-Encoding: gzip, deflate</code>처럼 압축 정보를 입력해 보내면 gzip 동작을 확인 할수 있다.


## 기타

그 밖에도 앵귤러의 $watch 사용을 최소화하는 방법 등도 고려할 수 있다.(<a href="http://nisostech.com/angularjs-performance-improvement/">참고</a>)
