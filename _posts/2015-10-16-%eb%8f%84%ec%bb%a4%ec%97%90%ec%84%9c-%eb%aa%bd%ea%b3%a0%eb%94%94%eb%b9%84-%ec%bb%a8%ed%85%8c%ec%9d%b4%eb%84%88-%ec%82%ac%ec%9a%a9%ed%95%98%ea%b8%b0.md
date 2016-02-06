---
id: 813
title: 도커에서 몽고디비 컨테이너 사용하기
date: 2015-10-16T17:33:59+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=813
permalink: /%eb%8f%84%ec%bb%a4%ec%97%90%ec%84%9c-%eb%aa%bd%ea%b3%a0%eb%94%94%eb%b9%84-%ec%bb%a8%ed%85%8c%ec%9d%b4%eb%84%88-%ec%82%ac%ec%9a%a9%ed%95%98%ea%b8%b0/
categories:
  - Docker
tags:
  - Docker
  - mongo
---
몽고디비는 이를 사용하는 서버(API 서버등)와 별도로 구현한다.
도커를 사용하여 각각 별도의 컨테이너로 실행하여 서버를 구성할 수 있다.

## 몽고 서버 만들기

### 몽고 이미지 다운로드
[hub.docker.com](https://hub.docker.com) 에서 'mongo'로 검색.
[첫번째 저장소](https://hub.docker.com/r/library/mongo/)를 클릭한다.
필요한 버전의 몽고 이미지를 당겨온다.

```
docker pull mongo:2.4
```

### 몽고 컨테이너 구동

몽고디비 서버는 아래 사항을 만족해야 한다.

* 디비를 사용하는 서버와 내부 망으로 연결되어야 한다.
* 컨테이너 밖에서 데이터를 저장해야한다.

위 사항을 만족하기위해 아래 옵션으로 컨테이너를 구동한다.

```
docker run --name mongo -d -v /data:/data/db  mongo:2.4

// 결과
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
dc7e8809da9b        mongo:2.4           "/entrypoint.sh mongo"   1 seconds ago       Up 1 seconds        27017/tcp           mongo
```

몽고 데몬은 기본적으로 /data/db 폴더에 데이터를 기록한다.
호스트의 /data 폴더를 컨테이너의 /data/db 폴더에 마운트한다.
결과적으로 호스트의 /data 폴더에 몽고디비 데이터가 저장된다.

몽고디비를 사용하는 서버쪽에서는 `--link` 옵션을 이용해 내부망으로 연결할 수 있다.

## 다른 컨테이너에서 몽고 컨테이너 접속

### 다른 컨테이너 생성 

다운로드한 mongo:2.4 이미지로 컨테이너를 하나더 생성한다.
이 컨테이너에서 기존에 생성한 몽고 컨테이너로 연결하기 위해 --link 옵션을 사용한다.

```
docker run -it --name mongo-test --link mongo:mongo mongo:2.4 /bin/bash
```
### 몽고 컨테이너로 접속 

생성된 컨테이너의 쉘로 접속된다.
이 컨테이너에서는 `$MONGO_PORT_27017_TCP_ADDR`, `$MONGO_PORT_27017_TCP_PORT` 환경변수에 `--link` 옵션으로 연결된 컨테이너의 IP, PORT 정보를 얻을 수 있다.

```
echo $MONGO_PORT_27017_TCP_ADDR
172.17.0.5
echo $MONGO_PORT_27017_TCP_PORT
27017
```

몽고쉘로 접속해 보자.

```
mongo $MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT
MongoDB shell version: 2.4.14
connecting to: 172.17.0.5:27017/test
Welcome to the MongoDB shell.
For interactive help, type "help".
For more comprehensive documentation, see
	http://docs.mongodb.org/
Questions? Try the support group
	http://groups.google.com/group/mongodb-user
>
```
