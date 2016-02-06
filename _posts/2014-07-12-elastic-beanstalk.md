---
id: 4
title: Elastic Beanstalk
date: 2014-07-12T08:18:53+00:00
author: Chris
layout: post
guid: http://54.64.213.117/?p=4
permalink: /elastic-beanstalk/
categories:
  - AmazonWebService
tags:
  - elastic beanstalk
  - nodejs
  - npm
---

아마존 클라우드 서비스에는 다양한 IaaS를 제공한다. 서버 컴퓨터를 제공하는 EC2, 데이터베이스 서버 RDS, 파일서버 S3 등 계속해서 그 종류가 늘어나고 있고 
EB([Elastic Beanstalk](http://aws.amazon.com/ko/elasticbeanstalk/))도 이러한 제품 중 하나다. 
EC2, RDS, S3 등을 간단하게 연결하고 오토 스케일 설정, 플랫폼 설치 등을 한 번에 진행해 주는 것이 장점이다. 
노드([nodejs](http://nodejs.org/))와 깃(git) 그리고 EB를 통해 프로젝트를 생성하고 서버에 배포하는 방법에 대해 알아보자.


## 시작

EB를 사용하기 위해서는 몇 가지 사전 준비 사항이 있다. 

1. [eb 커맨드라인툴 설치](http://aws.amazon.com/code/6752709412171743) 설치 
2. 액세스 아이디(AWS Access Key ID)와 시크릿 키(AWS Secret Access Key) 발급받기([IAM](http://aws.amazon.com/ko/iam/)) 
3. 깃 설치

EB는 [아마존 문서](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.sdlc.html)만 봐도 쉽게 사용법을 알 수 있다.

우선 프로젝트에 깃 저장소를 만들고(git init) 작성한 소스를 커밋, 그 후 EB환경을 초기화한다(eb init). 
대화형 메세지가 나오고 각 질문에 잘 답변하면 서버환경을 설정해 준다. eb start 명령어로 서버를 생성하자. 
약 3분정도 기다리면 EB 웹 콘솔에서 방금 생성한 서버를 확인할 수 있다. 이후에 소스를 수정할고 배포할 때마다 간단히 git aws.push 명령어 한 줄이면 끝이다. 
이게 가장 편리한 기능이라고 생각한다.


## 실행모드

기본적으로는 EB에 배포한 노드 프로그램은 development 모드로 실행된다. Production 모드로 실행하기 위해서는 프로젝트 폴더에 .ebextenstions 폴더를 생성하고 settings.config 파일을 만든 후 환경변수 정보를 기록한다. 이것을 커밋 후 재 배포하면 된다.

```
option_settings:
- option_name: NODE_ENV
value: production
```

더 간단한 방법도 있다. EB콘솔 > Configuration > Software Configuration 에 접속한 뒤 `NODE_ENV=production` 환경변수를 추가하고 저장하면 EB 환경이 재부팅되고 
노드프로그램은 production 모드로 실행된다.


## 오토 스케일링 (Auto Scaling)

EB에서는 기본적으로 networkout을 기준으로 스케일아웃(scale out) 된다. 사용해본 결과 이러한 설정은 예상했던 것보다 쉽게 스케일아웃 되버린다. 
EC2 인스턴스 갯수가 세 배로 늘었으니 요금도 세 배 더 지불했다. 스케일업 기준을 Cpu utilization로 변경하면 다소 덜 민감하게 스케일링을 할 수 있다. 
변경한 뒤로는 아직까지 한 번도 스케일아웃된 적이 없었다.


## 로그확인

늘 하던대로 ssh로 서버 접속하여 로그를 확인할 수 있다. EC2는 ssh 접속시 키페어 파일을 사용하므로 확인하자. EB 콘솔 > Configuration > Instances 에서 키페어를 변경하면 EB는 설정한 키페어에 맞는 새로운 EC2를 생성한다. 
물론 기존의 EC2 인스턴스는 자동으로 삭제(terminate)된다. ssh 접속 후 `/var/log/nodejs/nodejs.log` 파일에 노드 로그를 확인한다.

서버 접속도 귀찮으면 EB 웹콘솔에서 확인할 수 있다. 이것도 꾀 유용하다. 
EB 콘솔 > Logs 에 접속하여 Snapshot Logs 버튼을 클릭하면 현 시점의 로그파일들을 캡쳐해서 문자열 형태로 제공한다.


## 노드 명령어 (node, npm)

EB로 생성된 EC2에 접속하면 node, npm 명령어가 커맨드라인에서 실행되지 않는다. 당황하지 말자. PATH 환경변수에 기록되지 않았기 때문이다. 
해당 명령어 파일은 `/opt/elasticbeanstalk/node-indstall/node-v0.10.26-linux-x64/bin` 에서 찾을 수 있다. 
가끔 노드 패키지를 수동으로 설치하거나 테스트 목적으로 노드를 실행할 경우에 사용하면 유용하다.


## 참고

* [AWS Elastic Beanstalk](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.sdlc.html)
* [Deploying a Git Branch to a Specific Environment](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-reference-branch-environment.html)
* [forever](https://github.com/nodejitsu/forever)
* [18가지의 Node.js Runtime에서 지켜야할 필수 조건들](http://nodeqa.com/nodejs_ref/65)
