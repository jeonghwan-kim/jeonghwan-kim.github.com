---
id: 85
title: 'WordPress study 01 &#8211; misfit.kr'
date: 2015-01-09T21:52:58+00:00
author: Chris
layout: post
guid: http://www.whatilearn.com/?p=85
permalink: /wordpress-study-01-misfit-kr/
categories:
  - Wordpress
tags:
  - wordpress
---
<a href="http://misfits.kr/">Misfits.kr</a> 웹사이트를 따라하면서 학습한 내용을 정리한 글이다.

<a href="https://github.com/jeonghwan-kim/misfits-copy">https://github.com/jeonghwan-kim/misfits-copy</a>

<h3>상단 이미지 슬라이더</h3>

<a href="http://www.woothemes.com/flexslider/">flexslider</a> 라이브러리를 사용한다. 부트스트립 Carousel과 다른점은 화면 크기 변화에도 이쁘게 나온다는 점. 포스트의 <a href="http://stackoverflow.com/questions/11261883/how-to-get-wordpress-post-featured-image-url">특성 이미지</a> 만을 가져와 슬라이더로 구성한다. 이미지의 위의 카테고리명은 <a href="http://codex.wordpress.org/Function_Reference/the_category">the_category()</a> 함수를 이용한다.

<h3>우측 이미지 슬라이더</h3>

상단 이미지 슬라이더와 달리 별도의 플러그인을 사용한다.(<a href="https://wordpress.org/plugins/master-slider/">Master Slider</a>) 이미지 파일을 로딩하고 이를 슬라이드 하는 방법이 쉽다. 이미지를 이용한 컨텐츠 구성시 유용하게 쓰일 수 있다.

<h3>사이드바 및 메인 페이지</h3>

<a href="https://wordpress.org/plugins/shortcodes-ultimate/">Shortcode Ultimate</a>는 굉장한 플러그인이다. 블로그의 어떤 컨텐츠든지 커스텀 템플릿으로 보여줄 수 있다. 이건 코드를 직접봐야 실감할 수 있다. <code>/templates</code> 폴더를 확인하자.

<h3>메뉴 네비게이터</h3>

원래 블로그에서는 직접 구현했지만 <a href="https://wordpress.org/plugins/dropdown-menu-widget/">Dropdown Menu Widget</a> 플러그인을 사용했다. 부족한 면이 있다.