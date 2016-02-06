---
id: 312
title: 워드프레스 자식 테마 만들기
date: 2015-03-28T15:07:50+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=312
permalink: /how-to-build-wordpress-child-theme/
categories:
  - Wordpress
tags:
  - child theme
---
워드프레스에는 무료로 제공하는 멋진 테마들이 많다. 이러한 테마를 그대로 가져다 사용하면서 몇가지 수정하고 싶은 경우에는 자식 테마(Child Theme)를 만들어 사용하면 간편하다. 기존 테마의 기능과 디자인을 모두 가져오면서 추가 기능과 디자인 변경만 코드 수정하면 되기 때문이다. 마치 OOP의 상속과 비슷한 개념이라 보면 될 것 같다.

테마 폴더(wp-contens/themes/)에 자식 테마 폴더를 생성한다. 그리고 style.css 파일을 만들어 아래 주석을 입력한다.
<pre class="lang:css decode:true " title="wp-contents/themes/twentyfifteen-child">/*
Theme Name: Twentyfifteen Child
Theme URI: http://whatilearn.com
Description: Twentyfifteen Child Theme
Author: Jeonghwan Kim
Author URI: http://whatilearn.com
Template: twentyfifteen
Version: 1.0.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Tags: light, dark, two-columns, right-sidebar, responsive-layout, accessibility-ready
Text Domain: twentyfifteen-child
*/</pre>
Twentyfifteen을 부모 테마로하는 자식 테마를 정의한 것이다. 워드프레스에서는 위와 같이 style.css 파일의 주석으로 테마를 정의한다.

관리자 화면으로 접속해보자. 외모 &gt; 테마 메뉴로 가면 Twentyfifteen Child 라는 새로운 테마가 보인다. 테마를 활성화하면 블로그 스타일시트가 적용되지 않았을 것이다. 부모 테마의 스타일 시트를 로딩해야 하는데 이것을 자식 테마 폴더의 functions.php에서 액션훅으로 설정할 수 있다.
<pre class="lang:php decode:true " title="wp-contents/themes/twentyfifteen-child/funcions.php">&lt;?php
function theme_enqueue_styles() {
  wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );
</pre>
다시 로딩하면 부모 테마와 동일한 모습의 테마가 보일 것이다. index.php, page.php 등 수정할 파일을 자식테마 폴더에 생성하여 테마를 개선할 수 있다.

이런 식으로 작업을 하면 추가되는 파일, 특히 스타일시트와 자바스크립트 파일들이 많아지면서 브라우져에서의 로딩속도가 느려질 수 있는 단점도 있다. 이럴 경우는 코드 병합이나 압축을 통해 개선할 수 있을 것이다.