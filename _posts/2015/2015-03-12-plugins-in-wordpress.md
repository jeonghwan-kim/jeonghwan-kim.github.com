---
id: 252
title: 워드프레스 플러그인 정리
date: 2015-03-12T20:32:16+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=252
permalink: /plugins-in-wordpress/
categories:
  - Wordpress
tags:
  - plugin
  - wordpress
---
워드프레스로 홈페이지 개발을 처음으로 진행했다. 50불짜리 유료테마를 구입하고 부족한 기능은 무료 플러그인을 사용하거나 직적 소스를 수정하는 방법으로 진행했다. 사용자 인증, 게시판 등 사용한 플러그인을 정리해보자.

<h2>폼(Form)</h2>

사용자로부터 폼 입력을 받고 싶다면 <a href="https://wordpress.org/plugins/contact-form-7/">Contact From 7</a> 플러그인을 사용하자. 텍스트는 물론이고 이메일, 전화번호, 날짜를 입력받는 폼을 만들수 있고, 체크박스, 라디오박스, 파일 업로드 같은 인풋필드를 정의할수 있다. 커스텀 폼을 만든 뒤 자동으로 생성되는 숏코드를 포스트나 페이지에 붙여 넣으면 폼을 출력할 수 있다.

사용자가 폼을 작성하고 제출(Submit)하게 되면 이메일로 내용을 수신할 수 있다. 폼을 생성했던 관리자 페이지에서 수신 이메일 주소와 메일 본문 형식을 설정하면 된다.  혹시 이메일 발송이 동작하지 않는다면 워드프레스 서버에 sendmail이 설치되었는지 체크해보자. 설치되지 않았다면 <code>sudo apt-get install sendmail</code>로 설치할 수 있다.

<h2>게시판</h2>

워드프레스 자매 프로젝트 중 포럼이라고 부르는 bbPress를 이용해 게시판을 만들수 있다고 한다. 그러나 제로보드, 그누보드 같은 한국형 게시판과는 많이 달라서 개발하는 저자 조차도 헷갈리고 어렵다.

<a href="http://www.cosmosfarm.com/products/kboard">KBoard</a>는 한국형 게시판을 사용할수 있게 해주는 플러그인이다. 관리자페이지에서 게시판을 만들고 워드프레스 페이지와 연동하면 바로 사용할 수 있다.

<h2>인증</h2>

워드프레스 인증은 아이디, 이메일을 입력하면 자동생성된 비밀번호가 이메일 주소로 전송되는 방식이다. 회원가입에 관리자 승인 기능을 추가하고 싶다면 <a href="https://wordpress.org/plugins/new-user-approve/">New User Approve</a> 플러그인을 설치하자.

또한 회원가입/로그인 페이지를 커스터마이징 하고 싶다면 <a href="https://wordpress.org/plugins/theme-my-login/">Theme My Login</a>을 설치하면 된다. 플러그인 설치후 "회원가입", "로그인" 등 페이가 자동으로 생성되는데 이 페이지 링크가 인증 페이지로 연결된다. 이를 커스터마이징 하려면 플러그인의 폴더의 templates 폴더의 하위 파일을 테마 폴더로 복사해서 수정하면 가능하다.

<h2>번역</h2>

번역은 <a href="http://biscuitpress.kr/471">여기</a>에서도 설명하듯 BCP Custom Translate 가 가장 편리한 것 같다. <code>wp-content/mu-plugins</code> 폴더 생성 후 플러그인 파일을 업로드 하는 방식으로 설치하는 것이 좀 특이하다. 설치 후 각 도메인 별로 번역 문자열을 입력하는 방식이다.

<h2>데이테베이스 초기화</h2>

초기 개발시 이것 저것 삽질하다가 워드프레스 초기화할 필요가 있는데 <a href="https://wordpress.org/plugins/wordpress-reset/">WordPress Reset</a>을 사용해서 손쉽게 데이터베이스를 초기화할 수 있다.