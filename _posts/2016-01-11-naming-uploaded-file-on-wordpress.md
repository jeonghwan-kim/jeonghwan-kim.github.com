---
id: 1041
title: 워드프레스 파일 업로드 시 파일명 처리
date: 2016-01-11T21:15:30+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=1041
permalink: /naming-uploaded-file-on-wordpress/
categories:
  - Wordpress
tags:
  - image-upload
  - wordpress
---
이번해 블로그 방향은 사진을 함께 첨부하는 것이다. Feedly 같은 곳에 썸네일과 함게 RSS 피드 목록이 보이니 그럴듯해 보인다. 그런데... 가끔 이미지 링크가 깨지는 것을 발견했다. 크롬, 파이폭스, 그리고 오페라 브라우져에서도 잘 보이는 이미지 파일이 유독 사파리 브라우저에서만 보이지 않는다. 

이미지 파일의 링크를 확인해 보니 좀 이상하다. `캡처001.png`가 `ㅋㅐㅂㅊㅓ001.png`로 되어 있다. 어쩌다 이미지 파일명이 이렇게 변경된 것일까? 사파리 브라우져로 이미지 파일을 하나 첨부해 봤다. `캡처001.png`로 제대로 업로드 된다. 그동안 크롬에서만 포스팅을 작성했는데 몇몇 경우에는 파일명이 임의로 변경되는것 같았다. 

워드프레스 훅을 이용해서 업로드할 파일명을 안전하게 변경하면 해결할수 있을 것 같다. 파일명에 알파벳, 숫자, 그리고 몇 가지 특수 기호를 제외한 문자가 들어오면 `_`로 치환하는 로직을 추가한다. `functions.php` 에 다음 코드를 추가해 보자.

<script src="https://gist.github.com/jeonghwan-kim/d05212a80d300a21b481.js"></script>

이제 `캡처001.png`를 업로드 해보자.

<img src="http://whatilearn.com/wp-content/uploads/2016/01/_______________001.png" alt="캡쳐001" width="589" height="587" class="alignnone size-full wp-image-1042" />

이미지 파일명이 `_______________001.png`로 변경되었다. 

슬랙(Slack)에 첨부한 이미지도 이와 같은 형식으로 파일명으로 변경되는데 같은 이유일 것 같다.

<img src="http://whatilearn.com/wp-content/uploads/2016/01/______________________________-2016-01-11-____________-9-01-27-1024x384.png" alt="스크린샷 2016-01-11 오후 9.01.27" width="640" height="240" class="alignnone size-large wp-image-1044" />


