---
id: 733
title: Forever와 Docker
date: 2015-09-19T14:12:03+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=733
permalink: /forever-and-docker/
categories:
  - Docker
tags:
  - Docker
  - forever
---
포에버(Forever)는 노드를 구동해주는 모듈이다.

```
$ forever app.js
```

이렇게 실행하면  (1) 노드 프로그램을 구동해 주고 (2) 노드에서 내뿜는 콘솔 로그를 파일로 기록한다. 몇가지 옵션을 추가해서 사용한다.

```
$ forever start --uid MyApp app.js
```

이렇게 실행하면 노드 프로그렘을 데몬으로 돌릴수 있고 로그파일도 MyApp.log로 기록되기 때문에 좀 편리하다. 무엇보다 로그를 볼수 있다는게 편하다.

문제
===

도커(Docker)에서도 노드 프로그램을 구동하기 위해 포에버 실행 명령을 도커파일(Dockerfile)에 기록했다. 그러나 생각대로 돌아가지 않는다. 포에버가 동작하지 않거나, 혹은 동작했어도 로그가 기록되지 않는 문제다. 

컨테이너를 실행할때는 Foreground 모드의 명령어를 실행야하는데 start 옵션으로 포에버를 구동하는 것은 Background 모드이기 때문에 컨테이너 구동에 실패한다.

해결
===

포에버를 포그라운드 모드로 실행하도록 Dockerfile 을 변경한다.

```
forever app.js
```

대신 도커 명령어로 로그를 확인할 수 있다.

```
$ docker logs -f -t MyApp
```

* -f: Follow log output
* -t: timestampes













