---
title: 토이프로젝트_페이스북 분석기
layout: post
category: dev
permalink: toy_project/2017/01/16/facebook-analysis.html
tags: toy-project
---

4년전 페이스북 초창기에 몇가지 아이디어가 타임라인에 올라왔다.

> 페북 텍스트를 분석하면 사용자의 성향을 파악할수 있지 않을까요?

> 친구 관계를 점수로 매겨보는 건 어떨까요?

그래프 API를 이용해서 특정 유저의 페이스북 분석기를 만들었다.  OAuth 인증을 통과하면 5~10초 정도 분석시간이 소요되고 세 가지 결과를 보여준다.

* 자주 사용한 단어
* 게시물 생성 패턴
* 친구관계

페이스북의 모든 게시물을 가져와 의미있는 한글 명사만으로 워드 클라우드를 만들었다. 명사 추출을 위해 [루씬 한글 분석기 카페](http://cafe.naver.com/korlucene.cafe)에서 제공하는 단어사전을 사용했다.

게시물의 시간 정보를 활용해 일자별 게시 시간을 그래프로 출력했다. 가로축(날짜)이 버그인것 같지만 그당시 나의 페북 사용시간은 별 의미는 없었던 것 같다.

![](/assets/imgs/2017/fb-analysis1.png)

페이스북 친구 중 내 게시물에 좋아요를 클릭하거나 댓글을 남긴 횟수를 각각 가로축 세로축으로 한 그래프를 만들었다. 페이스북 안에서 친밀도라는 의미로 해석할 수 있었다.

![](/assets/imgs/2017/fb-analysis2.png)

코드: [https://github.com/jeonghwan-kim/facebook-analysis.git](https://github.com/jeonghwan-kim/facebook-analysis.git)
