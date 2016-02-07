---
id: 117
title: eb-cli 툴 사용법 정리
date: 2015-01-17T14:10:57+00:00
author: Chris
layout: post
guid: http://www.whatilearn.com/?p=117
permalink: /eb-cli-%ed%88%b4-%ec%82%ac%ec%9a%a9%eb%b2%95-%ec%a0%95%eb%a6%ac/
categories:
  - AmazonWebService
tags:
  - aws
  - eb-cli
  - elastic beanstalk
---
아마존 웹서비스의 엘라스틱 빈스톡(<a href="http://aws.amazon.com/elasticbeanstalk/">Elastic Beanstalk</a>)은 웹 콘솔뿐만 아니라 커맨드 툴(eb-cli)을 제공한다. 이를 사용하면 웹콘솔에 직접 접속하지 않아도 빈스톡에 새로운 어플리케이션을 생성하고 로컬에서 작업중인 프로그램을 명령어 한줄로 아마존에 배포할수 있다. 현재 최신버전인 <a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-getting-set-up.html">eb-cli 3.x</a> 버전을 기준으로 사용법을 알아보자.

<h1>환경 설정</h1>

커맨드라인 툴 설치후 중요한 것은 아마존 웹서비스의 IAM에서 유저를 생성하고 아마존 서비스에 접근권한을 설정해야 한다. 빈스톡을 사용할 것이기 때문에 <code>AWS Elastic Beanstalk Full Access</code> 권한을 설정한다. 크리덴셜 파일을 다운받고 이를  <code>~/.aws/config</code>에 등록시킨다.

<pre class="lang:sh decode:true" title="~/.aws/config">[profile eb-cli]
aws_access_key_id = MY_AWS_ACCESS_KEY_ID
aws_secret_access_key = MY_AWS_SECRET_ACCESS_KEY</pre>

eb-cli 툴은 이 환경설정 파일을 참고하여 빈스톡을 관리한다.

<h1>배포</h1>

작업중인 프로젝트 폴더로 이동한다. <code>eb init</code> 으로 빈스톡 어플리케이션을 생성한다. 배포 지역 등 몇가지 질문에 대해 답변하고 종료한다. 그후 <code>eb crate</code>으로 빈스톡에 어플리케이션 환경을 생성한다. 환경(env)는 빈스톡에서 사용하는 용어로 아마존 서버스를 묶어놓은 서버 '환경'을 의미한다. <code>eb create</code>은 작업중인 프로젝트의 최종 커밋파일을 서버로 배포한다. 향후 수정된 다른 버전을 배포할 경우 변경사항을 커밋한 뒤 <code>eb deploy</code> 명령어로 서버를 업데이트 할 수 있다. 참고로 형상관리툴은 git을 사용해야 eb-cli 툴 사용이 가능하다.

<h1>다중 계정</h1>

아마존 서버 계정 혹은 유저가 여럿일 경우 크리덴셜 파일에 대해 고민할 수 있다. IAM에서 받은 이 정보는 환경설정 파일(<code>~/.aws/config</code>)에 저장되어 있고, eb-cli 툴은 이 파일을 참조해 빈스톡을 관리한다.

이럴 경우는 <code>~/.aws/config</code>에 아래처럼 크리덴셜 정보를 별도로 기록한다. 그러면 eb-cli툴은 profile 뒤에 입력한 값으로 계정을 식별한다.

<pre class="lang:sh decode:true" title="~/.aws/config">[profile user01]
aws_access_key_id = USER01_ACCESS_KEY_ID
aws_secret_access_key = USER_01_AWS_SECRET_ACCESS_KEY

[profile user02]
aws_access_key_id = USER02_ACCESS_KEY_ID
aws_secret_access_key = USER_02_AWS_SECRET_ACCESS_KEY
</pre>

만약 user01에 설정한 크리덴셜을 사용할 경우 <code>eb-init --profile user01</code>로 초기화 할 수 있다. 뿐만 아니라 모든 eb-cli 명령어에 <code>--profile user01</code>을 사용할 수 있다.

<h1>기타 명령어들</h1>

<ul>
    <li>`eb open`: 빈스톡 주소를 웹브라우져로 접속한다.</li>
    <li>`eb status`: 빈스톡 상태를 확인한다.</li>
    <li>`eb config`: 빈스톡 세팅값을 변경한다.</li>
    <li>`eb ssh`: 빈스톡 환경에 있는 EC2 인스턴스에 ssh로 접속한다. 단 ~/.ssh 폴더에 키페어파일(.pem)이 있어야한다.</li>
</ul>

나머지 명령어는 <code>eb --help</code>로 확인한다.