---
id: 680
title: Docker + Git
date: 2015-09-07T10:55:26+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=680
permalink: /docker-git/
AGLBIsDisabled:
  - 0
categories:
  - Docker
tags:
  - Docker
  - Git
---
도커랑 깃이랑 연동해서 사용해 보자. 그전에 빈스톡에서 개발한 경험을 되새겨 보자.

1. 코딩
1. 배포용 코드 빌드
1. 빌드파일 커밋
1. 빈스톡 커맨드라인으로 커밋 푸시 (eb push)
1. 서버 재 구동

도커 관련들을 살펴보니 위와 비슷한 개발 환경을 꾸밀수 있었다. (참고) 생각해보니 빈스톡에서도 커밋을 푸시하고 깃 서버에서는 훅을 걸어서 서버 재구동 작업을 수행한 모양이다. 이쪽 서버 재구동 작업을 도커 작업으로 변경해서 처리해 보자.

서버코드 작성
===========

간단히 익스프레스로 설치

```
$ express docker-app
```

도커파일 작성. 커밋된 도커파일이 서버로 올라가서 이미지를 만들어야 하니깐.

```
FROM ubuntu:14.04

RUN apt-get update
RUN apt-get install -y nodejs npm

ADD app.js /var/www/app.js
ADD package.json /var/www/package.json

WORKDIR /var/www
RUN npm install

CMD nodejs ./bin/www
```

도커, 깃 설치
=============

개발 서버에 도커 설치.

```
$ sudo apt-get install docker.io
$ sudo ln -sf /usr/bin/docker.io /usr/local/bin/docker
```

깃 서버도 설치하고 이쪽으로 커밋하자.

```
$ sudo apt-get install git-core
$ sudo adduser git
$ sudo passwd git
```

깃을 도커 그룹에 추가. 도커를 관리자 권한 없이 사용하기 위해서.

```
$ sudo usermod -aG docker git
```

깃 저장소 생성. 이쪽으로 푸시할거다.

```
$ su git
$ cd ~/
$ git init docker-app
$ git config receive.denycurrentbranch ignore // 로컬 푸시를 받기위해 
```

ssh key 설정
===========

로컬의 ssh key를 서버에 저장하여 비빌번호 없이 깃을 사용한다. 우선 로컬 환경에서 키 파일을 만든다. 기존에 있으면 스킵.

```
$ ssh-keygen -t rsa
$ scp ~/.ssh/id_rsa.pub ubuntu@remote.com:id_rsa.pub
```

서버에 접속하여 인증서 파일을 git 유저 폴더에 이동한다.

 
<pre>
$ cat /home/ubuntu/id_rsa.pub > /home/git/.ssh/authorized_keys
</pre> 

접속 테스트

```
$ ssh git@remote.com
```

접속 성공

깃 후커
======

깃 후커를 이용해 커밋 되었을때 도커 관련 작업을 설정 한다. /home/git/docker-app/.git/hooks/post-recieve를 아래와 같이 작성.

```
#!/bin/bash
APP_NAME=docker-app
APP_DIR=$HOME/$APP_NAME
REVISION=$(expr substr $(git rev-parse --verify HEAD) 1 7)

GIT_WORK_TREE=$APP_DIR git checkout -f

cd $APP_DIR
docker build --tag $APP_NAME:$REVISION .
docker stop $APP_NAME
docker rm $APP_NAME
docker run -d --name $APP_NAME -p 3000:3000 $APP_NAME:$REVISION
```

파일에 실행 권한 추가
```
$ chmod +x /home/git/docker-app/.git/hooks/post-receive
```

커밋, 푸시
=========

소스 커밋

```
$ git add .
$ git commit -am "Install express"
```

리모트 저장소 설정

```
$ git remote add origin git@remote.com:docker-app
```

설정 완료. 이제 커밋을 푸시하면 서버에서 이커밋을 기준으로 이미지를 생성하고 컨테이너를 실행한다.

```
$ git push origin master
```

도커 이미지가 생성되었다. 두번 푸시함

```
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
docker-app          11ff567             bcccc767926f        16 seconds ago      373.1 MB
docker-app          88fb249             c83f84bdb5a9        3 minutes ago       373.1 MB
ubuntu              14.04               91e54dfb1179        2 weeks ago         188.4 MB
```

도커 컨테이너도 돌고 있다.

```
$ docker ps
CONTAINER ID        IMAGE                COMMAND                CREATED             STATUS          NAMES
db2e3770d797        docker-app:11ff567   /bin/sh -c 'nodejs .   56 seconds ago      Up 55 seconds   docker-app          
```