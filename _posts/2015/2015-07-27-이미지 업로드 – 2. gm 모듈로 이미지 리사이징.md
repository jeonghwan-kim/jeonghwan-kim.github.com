---
id: 504
title: 이미지 업로드 – 2. gm 모듈로 이미지 리사이징
date: 2015-07-27T17:10:21+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=504
permalink: /%ec%9d%b4%eb%af%b8%ec%a7%80-%ec%97%85%eb%a1%9c%eb%93%9c-2-gm-%eb%aa%a8%eb%93%88%eb%a1%9c-%ec%9d%b4%eb%af%b8%ec%a7%80-%eb%a6%ac%ec%82%ac%ec%9d%b4%ec%a7%95/
categories:
  - Express.js
  - Node.js
tags:
  - gm
  - GraphicsMagick
  - resizing image
  - thumb
  - 이미지 리사이징
---
<a href="http://whatilearn.com/%ec%9d%b4%eb%af%b8%ec%a7%80-%ec%97%85%eb%a1%9c%eb%93%9c-1-multer-%eb%aa%a8%eb%93%88%eb%a1%9c-%ed%8c%8c%ec%9d%bc-%ec%97%85%eb%a1%9c%eb%93%9c/">Multer 모듈로 이미지 업로드</a>에 성공했다면 서버에 업로드된 이미지 파일 경로을 알수 있다. 이번 글에는  <a href="http://aheckmann.github.io/gm/">gm</a> 모듈을 사용하여 이미지 리사이징 하는 방법에 대해 알아본다.

# 설치

노드에서 많이 사용하는 이미지 프로세싱 라이브러리 중 하나인 <a href="http://aheckmann.github.io/gm/">gm</a>을 설치하자.

<code>`$ npm install --save gm`</code>

gm 라이브러리를 사용하기 위해서는 <a href="http://www.graphicsmagick.org/" target="_blank">GraphicsMagick</a> 이나  <a href="http://www.imagemagick.org/" target="_blank">ImageMagick</a> 등의 라이브러리를 추가 설치해야한다.  GraphicsMagick을 설치한다.

<code>`$ sudo apt-get install graphicsmagick`</code>

# 섬네일 이미지

라이브러리 사용법은 매우 간단하다.  `require('gm')('파일 경로')` 를 함수 체인으로 이용하여 이미지 처리를 할수 있다. 썸네일 이미지를 만들고자 하면 `thumb()` 함수를 이용한다.
<pre class="lang:js decode:true ">gm('image.jpg')
    .thumb(100, 100, 'imgs/thumb.jpg', function (err) {
      if (err) console.error(err);
      else console.log('done - thumb');
    });</pre>
# 메타 데이터 제거

이미지 메타정보(EXIF profile data) 제거시에는 `noProfile()` 함수를 사용한다.
<pre class="lang:js decode:true crayon-selected">gm('image.jpg')
    .noProfile()
    .write('noprofile.jpg', function (err) {
      if (err) console.error(err);
      else console.log('done - noprofile');
    });
</pre>
&nbsp;

[caption id="attachment_514" align="aligncenter" width="311"]<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-28-오후-9.47.44.png"><img class="wp-image-514 size-full" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-28-오후-9.47.44.png" alt="원본파일" width="311" height="164" /></a> 원본파일[/caption]

[caption id="attachment_515" align="aligncenter" width="241"]<a href="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-28-오후-9.47.56.png"><img class="wp-image-515 size-full" src="http://whatilearn.com/wp-content/uploads/2015/07/스크린샷-2015-07-28-오후-9.47.56.png" alt="noProfile() " width="241" height="69" /></a> noProfile()[/caption]

# 블러 이미지

`blur()` 함수로 블러 이미지를 생성할 수 있다.
<pre class="lang:js decode:true ">gm('image.jpg')
    .blur(19, 10)
    .write('blur.jpg', function (err) {
      if (err) console.error(err);
      else console.info('done - blur')
    });</pre>
# 리사이징

`resize(width, height)` 함수로 리사이징 한다. 파라매터로 넘겨주는 width와 height중 이미지 비율을 유지할 수 있는 값으로 width나 height 값을 취하여 리사이징한다. 이것은 `thumb()`이 이미지를 잘라 내는 것과 다른 점이다.
<pre class="lang:js decode:true ">gm('image.jpg')
  .resize(100, 200)
  .write('100_200.jpg', function (err) {
    if (err) console.error(err)
    else console.log('done')
  });</pre>
&nbsp;

소스코드: <a href="https://github.com/jeonghwan-kim/gm-test">https://github.com/jeonghwan-kim/gm-test</a>