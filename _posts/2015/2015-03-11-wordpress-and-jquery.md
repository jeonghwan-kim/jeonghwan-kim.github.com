---
id: 246
title: 워드프레스와 제이쿼리 등
date: 2015-03-11T00:16:00+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=246
permalink: /wordpress-and-jquery/
categories:
  - Wordpress
tags:
  - jquery
  - wordpress
  - yeoPress
---
<h2>워드프레스와 제이쿼리</h2>

워드프레스에는 기본적으로 제이쿼리 라이브러리가 포함되어 있다. <code>wp_enqueue_scripts</code> 액션훅을 이용해 wp_enqueue_script( 'jquery' ) 함수로 로딩한다. 그럼에도 불구하고 <code>$</code> 사용시 <code>undefined</code>라는 에러가 나왔다. 몇가지 솔루션을 찾았는데 (1) 함수 사용시 의존성을 해결하는 방법과 (2) 즉시 실행함수를 사용해 jQuery 키워드를 파라매터로 넘겨주고 받는 쪽에서 <code>$</code> 변수로 받는 방법이었다. 그러나 이 두가지 방법으로도 해결할 수 없었다.

<a href="http://api.jquery.com/jQuery.noConflict/">jQuery.noConflict()</a> 함수로 해결할 수 있었다.

<pre class="lang:js decode:true ">&lt;script src="other_lib.js"&gt;&lt;/script&gt;
&lt;script src="jquery.js"&gt;&lt;/script&gt;
&lt;script&gt;
$.noConflict();
jQuery( document ).ready(function( $ ) {
  // Code that uses jQuery's $ can follow here.
});
// Code that uses other library's $ can follow here.
&lt;/script&gt;</pre>

<h2>YeoPress</h2>

노드 프로젝트에서는 yeoman.io에서 제공하는 제너레이터를 주로 사용한다. 워드프레스에서도 요맨으로 코드 스켈톤을 작성할수 있는데 <a href="https://github.com/wesleytodd/YeoPress">YeoPress</a>가 그것이다. (<a href="https://www.youtube.com/watch?v=WSG0P5VpSUk">동영상 샘플</a>) 로컬에서 테스트 해봤으나 중간에 실패한다.