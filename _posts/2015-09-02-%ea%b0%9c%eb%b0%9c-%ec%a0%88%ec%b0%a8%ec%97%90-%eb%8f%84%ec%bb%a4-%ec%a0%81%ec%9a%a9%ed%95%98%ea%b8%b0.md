---
id: 664
title: 개발 절차에 도커 적용하기
date: 2015-09-02T11:13:03+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=664
permalink: /%ea%b0%9c%eb%b0%9c-%ec%a0%88%ec%b0%a8%ec%97%90-%eb%8f%84%ec%bb%a4-%ec%a0%81%ec%9a%a9%ed%95%98%ea%b8%b0/
AGLBIsDisabled:
  - 0
categories:
  - Docker
tags:
  - Docker
  - express
  - nodejs
---
저의 개발 순서는 이렇습니다.

(1) 소스코드를 작성한다. Node.js로 서버를 띄우고 노드 이외에 필요한 라이브러리는 Homebrew로 설치합니다. 소스코드는 깃(Git)으로 버전관리 합니다.

(2) 로컬에서 작성한 소스를 빌드하여 개발 서버에 배포한다. 개발서버는 원격 호스트에 구동되어 있고 보통 우분투를 사용합니다.

(3) 개발서버의 테스트가 완료되면 상용서버를 만들어 배포합니다.

자 그럼 제가 도커를 사용하고 싶은 부분이 어디일까요? 네 맞습니다. 2번째 단계입니다. 1단계에서 소스코드를 버져닝 한것 처럼 2단계에서 개발 서버 자체를 버저닝하고 싶은 것입니다. 3번째 단계에서는 버저닝한 개발서버 이미지를 가져와(pull) 컨테이너로 만들면 상용서버를 금방 만들수 있는 것입니다.

작업 순서를 알아봅시다.

<h1>로컬 작업</h1>

$ express hello-express

$ cd hello-express

$ npm installl

$ npm start

브라우져로 페이지 확인

<a href="http://whatilearn.com/wp-content/uploads/2015/09/스크린샷-2015-09-02-오전-10.17.28.png"><img class="alignnone size-full wp-image-671" src="http://whatilearn.com/wp-content/uploads/2015/09/스크린샷-2015-09-02-오전-10.17.28.png" alt="스크린샷 2015-09-02 오전 10.17.28" width="885" height="490" /></a>

$ git init

$ git add --a

$ git commit -am "Install express"

Dockerfile을 작성합니다.

<pre class="lang:default decode:true">FROM ubuntu:14.04
MAINTAINER Jeonghwan&lt;ej88ej@gamil.com&gt;

RUN apt-get update
RUN apt-get install -y nodejs npm

ADD bin /var/www/bin
ADD public /var/www/public
ADD routes /var/www/routes
ADD views /var/www/views
ADD app.js /var/www/app.js
ADD package.json /var/www/package.json

WORKDIR /var/www
RUN npm install
CMD nodejs ./bin/www

EXPOSE 3000</pre>

우분투에서 패키지 관리툴로 노드를 설치하면 기본명령어가 nodejs로 되어있습니다. 위 파일의 하단에 nodejs 명령어로 프로그램을 실행합니다.

$ git add --a

$ git commit -am "Add Dockerfile"

소스코드를 깃헙에 배포합니다. <a href="https://github.com/jeonghwan-kim/hello-express">https://github.com/jeonghwan-kim/hello-express</a>

rsync를 이용해 개발 서버로 코드 배포합니다.

&nbsp;

<h1>개발서버</h1>

개발 서버의 독커를 설치합니다. (스킵)

로컬에서 푸시된 Dockerfile을 이용해 도커 이미지를 생성합니다.

$ docker build --tag jeonghwan/hello-express:0.1 .

처음 도커 이미지를 만들때는 시간이 좀 소요됩니다.

<a href="http://whatilearn.com/wp-content/uploads/2015/09/스크린샷-2015-09-02-오전-9.40.34.png"><img class="alignnone size-full wp-image-667" src="http://whatilearn.com/wp-content/uploads/2015/09/스크린샷-2015-09-02-오전-9.40.34.png" alt="스크린샷 2015-09-02 오전 9.40.34" width="917" height="249" /></a>

&nbsp;

$ docker images 로 빌드한 이미지 확인합니다.

생성한 이미지로 컨테이너를 만듭니다. 외부의 8888번 포트를 3000번으로 포트포워딩합니다.

$ docker run -d -p 8888:3000 --name hello-express jeonghwan/hello-express:0.1

&nbsp;

<h1>이미지 공유</h1>

개발 서버 이미지를 도커 허브에 공유합니다. 나중에 상용서버에서 도커 허브에 공유된 최신 버젼의 이미지로 컨테이너를 생성할 수 있기 때문입니다.

$ docker push jeonghwan/hello-express

<a href="https://hub.docker.com/r/jeonghwan/hello-express/">https://hub.docker.com/r/jeonghwan/hello-express/</a>

&nbsp;

&nbsp;