---
id: 22
title: expressjs 4.0 마이그레이션
date: 2014-08-21T16:43:14+00:00
author: Chris
layout: post
guid: http://54.64.213.117/?p=22
permalink: /expressjs-4-0-%eb%a7%88%ec%9d%b4%ea%b7%b8%eb%a0%88%ec%9d%b4%ec%85%98/
categories:
  - Express.js
  - Node.js
tags:
  - express
  - nodejs
---
익스프레스 4.x는 이전버전 대비 20%로 응답속도를 개선할 수 있다고 한다.(<a href="https://medium.com/javascript-and-the-server/express-4-aa6992b52bcd">참고</a>) 정말 그럴까? 익스프레스 적용 전과 후의 서버에 AB 테스로 성능 비교를 해봤다.

Connection Times (ms)

<ul>
    <li>Connect: 3.x (238 ms), 4.x (209 ms, 0.88배 단축)</li>
    <li>Processing: 3.x (196 ms), 4.x (185 ms, 0.94배 단축)</li>
    <li>Waiting: 3.x (196 ms), 4.x (184 ms, 0.94배 단축)</li>
    <li>Total: 3.x (495 ms), 4.x (411 ms, 0.9배 단축)</li>
</ul>

CPU Utilization (%)

<a href="http://whatilearn.com/wp-content/uploads/2014/12/ec8aa4ed81aceba6b0ec83b7-2014-08-19-ec98a4ed9b84-1-00-54.png"><img class="alignnone wp-image-23 size-full" src="http://whatilearn.com/wp-content/uploads/2014/12/ec8aa4ed81aceba6b0ec83b7-2014-08-19-ec98a4ed9b84-1-00-54.png" alt="ec8aa4ed81aceba6b0ec83b7-2014-08-19-ec98a4ed9b84-1-00-54" width="800" height="379" /></a>

기존대비 약 10% 응답속도가 빨라졌다. 기존에 간헐적으로 발생했던 응답 실패도 없었다. 또한 CPU 사용율도 개선(22% -&gt; 16%)된듯 하다. <a href="https://medium.com/javascript-and-the-server/express-4-aa6992b52bcd">혹자</a>에 의하면 메모리 사용 효율도 10% 개선된다고 한다.

<h1>결론</h1>

3.x버전에서는 기본 제공되는 컨넥트 모듈에 대해 별 생각없이 사용했다. 그러나 업그레이드 되면서 필요한 미들웨어만 설치하여 사용하게 되므로 각 모듈을 꼼꼼히 살펴보게 되었다.

업그레이드를 결심하게된 가장 큰 이유는 서두에서 언급한 라우팅 기법 때문이었다. route() 함수로 하나의 서버 자원에 대한 액션(get, post, put, delete)을 정의하는데 직관적으로 코딩할수 있는 것이 장점이다. 이것을 잘 활용하면 REST기반의 프로토콜을 정의하는데 매우 편리할 것 같다.