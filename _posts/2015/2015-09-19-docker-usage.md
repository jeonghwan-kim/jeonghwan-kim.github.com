---
id: 740
title: 도커 활용기
date: 2015-09-19T15:16:40+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=740
permalink: /docker-usage/
categories:
  - Docker
tags:
  - Docker
  - forever
---
도커를 활용한 예제입니다.
우분투 서버에 노드를 설치하고 익스프레스 엔진으로 서버를 구현하는 방법에 대해 설명합니다.
우리는 포에버를 이용해 서버를 구동할 것입니다.

서버 구성은 아래와 같습니다.

* Ubuntu 14.04
* Node.js 0.12
* Exoress.js
* Forever

다음은 위 환경을 도커로 구성하는 방법에 대해 설명합니다.

## 프로젝트 폴더

프로젝트 폴더를 하나 만듭니다.

```
$ mkdir docker-forever-sample
```

노드 패키지를 초기화 합니다.

```
$ npm init
```

## 샘플 코드

간단한 익스프레스 코드를 작성합니다.

```javascript
// indxe.js

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  console.log('GET /');
  res.send('Hello world');
});

// 포에버 동작을 확인하기 위한 코드
app.get('/exit', function(req, res) {
  process.exit(1); // Uncaught Fatal Exception
});

app.listen(3000, function () {
  console.log('Server is running at 3000 port.');
});
```

## 도커 파일

도커 이미지를 작성하기 위해 도커파일(Dockefile)을 작성합니다.
다음은 도커파일 코드를 부부적으로 설명합니다.

도커 허브에 저장된 이미지중 ubuntu:14.04 이미지를 기본으로 합니다.

```Dockerfile
FROM ubuntu:14.04
```

위에서 만든 샘플 코드가 저장될 서버상의 위치를 설정합니다.
우리가 작성한 코드는 우분투 서버의 `/var/docker-forever-sample` 폴더에 저장될 것입니다.

```Dockerfile
ENV PROJECT_PATH /var/docker-forever-sample
```

노드 0.12 버전을 설치합니다.
이전 버전에서는 명령어가 nodejs 였지만 이번에는 node, nodejs 둘 다 동작합니다.
npm은 git을 이용해 모듈을 가져오기 때문에 git도 함께 설치합니다.

```Dockerfile
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install -y nodejs git git-core
```

노드 프로그램을 관리할 forever 모듈을 설치합니다.

```Dockerfile
RUN npm install -g forever
```

위에서 작성한 소스코드를 서버 이미지로 복사합니다.
도커파일 상단에 정의한 환경변수 `PROJECT_PATH`에 파일을 복사합니다.

```Dockerfile
ADD index.js ${PROJECT_PATH}/index.js
ADD package.json ${PROJECT_PATH}/package.json
```

프로젝트 폴더로 이동한 뒤 샘플 프로그램에 필요한 노드 모듈을 설치합니다.

```Dockerfile
WORKDIR ${PROJECT_PATH}
RUN npm install
```

마지막으로 forever 명령어로 샘플 프로그램을 구동합니다.
샘플에서는 3000번 포트를 사용했기 때문에 이미지의 3000번 포트를 개방합니다.

```Dockerfile
CMD forever index.js
EXPOSE 3000
```

이상으로 이미지 생성에 필요한 `Dockerfile` 작성을 마쳤습니다.

## 이미지 생성

도커 이미지를 생성하려면 컴퓨터에 도커를 설치해야 합니다.
리눅스에서는 패키지 관리자로 'docker' 를 검색해서 설치할 수 있습니다.
맥에서는 [boot2docker](https://github.com/boot2docker/boot2docker)를 사용할 수 있습니다.
boot2docker를 이용해 계속 진행합니다.

도커 실행:

```
$ boot2docker
```

쉘 모양이 변경되면서 'docker@boot2docker$' 로 변경 됩니다.
작성한 샘플 코드가 있는 경로로 이동합니다.

도커 파일이 있는 폴더에서 도커 이미지를 생서합니다.
이미지 이름은 forever-sample, 버전은 1.0 으로 합니다.
명령어 마지막에 현제 폴더 (`.`)를 지정해야 합니다.

```
docker@boot2docker$ docker build --tag forever-sample:1.0 .
```

이미지 생성을 확인합니다.

```
docker@boot2docker$ docker images
```

forever-sample 이라는 도커 이미지가 생성되었습니다.

```
REPOSITORY          TAG                 
forever-sample      1.0                 
```

## 컨테이너 생성

forever-sample 이미지로 컨테이너를 구동합니다.

```bash
docker@boot2docker$ docker run -d -p 3000:3000 --name forever-sample forever-sample:1.0
```

* `-d`: 컨테이너를 백그라운드로 구동합니다.
* `-p 3000:3000`: 외부의 3000 포트와 컨테이너의 3000번 포트를 연결(bind)합니다.
* `--name forever-sample`: 컨테이너 이름을 지정합니다.

컨테이너가 생성되었는지 확인합니다.

```bash
docker@boot2docker$ docker ps
```

forever-sample 이라는 이름으로 컨테이너가 생성되어 구동되고 있습니다.

```
CONTAINER ID        IMAGE                NAMES
9c442f1807ff        forever-sample:1.0   forever-sample
```

## 컨테이너 로그

샘플 코드에서 작성한 로그가 제대로 나오는지 확인해 봅니다.

```bash
docker@boot2docker$ docker logs -f -t forever-sample
```

* `-f`: follow output
* `-t`: timestamp

서버 구동 메세지가 보입니다.

```
2015-09-19T05:49:30.847883601Z Server is running at 3000 port.
```

브라우져로 서버에 접속하여 로그를 확인해 봅니다.
구동된 컨테이너에 접속하기 위해서는 가상 머신의 ip로 접속해야합니다.

boot2docker 명령어로 가상 머신의 ip를 확인합니다.

```
$ boot2docker ip
```

브라우져로 해당 ip의 3000번 포트로 접속하여 페이지를 확인합니다.

```
2015-09-19T05:51:24.359774787Z GET /
```

어플리케이셔이 죽을 때 포에버가 이를 재구동시키는지 확인하기 위해 `GET /exit` 로 접속합니다.

```
2015-09-19T05:54:32.104332191Z error: Forever detected script exited with code: 0
2015-09-19T05:54:32.129647422Z error: Script restart attempt #1
2015-09-19T05:54:32.525295447Z Server is running at 3000 port.
```

서버가 재 구동되는 것을 확인할 수 있습니다.

## 참고
* 소스코드: [https://github.com/jeonghwan-kim/docker-forever-sample](https://github.com/jeonghwan-kim/docker-forever-sample)