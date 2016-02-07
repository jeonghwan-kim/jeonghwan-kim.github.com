---
id: 307
title: 익스프레스 파일 업로드
date: 2015-03-28T14:13:12+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=307
permalink: /fileupload-in-expressjs/
categories:
  - Express.js
tags:
  - elastic beanstalk
  - expressjs
  - nginx
  - nodejs
---
노드 익스프레스에서 파일 업로드를 위해서는  <a href="https://github.com/expressjs/multer">multer</a> 모듈을 로딩해야 한다. 로딩 후 리퀘스트 객체를 통해 업로드한 파일을 핸들링 할수 있다. (<code>req.files</code>)

만약 서버로부터 <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.14">413 (Request Entry Too Large) 상태 코드</a>가  반환된다면 서버 설정을 변경해야 한다. 아마존 빈스톡(Elastic Beanstalk)을 사용 한다면 앞단에 엔진엑스가 붙어있기 때문에 엔진엑스에서 파일 업로드 설정을 해줘야한다. 빈스톡에서는 프로젝트 루트 폴더에 .ebextensions 폴더를 생성하여 서버 설정 정보를 기록할 수 있다. 엔진엑스의 파일 업로드 최대용량 설정을 아래와 같이 작성한다.

<pre class="lang:yaml decode:true " title=".ebextensions/01_files.config">files:
  "/etc/nginx/conf.d/proxy.conf" :
    mode: "000777"
    owner: ec2-user
    owner: ec2-user
    content: |
      client_max_body_size 8M;</pre>

&nbsp;