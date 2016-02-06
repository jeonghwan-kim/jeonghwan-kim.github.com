---
id: 311
title: 워드프레스 커스텀 메뉴 추가하기
date: 2015-03-28T15:43:26+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=311
permalink: /custom-menu-in-wordpress/
categories:
  - Wordpress
tags:
  - custom menu
  - wordpress
---
워드프레스는 여러개의 메뉴를 배치할 수 있다. 테마에서 제공해주는 것은 보통 상단과 우측 혹은 좌측에 메뉴를 둘수 있다. 우리는 블로그 하단에 메뉴를 추가해 보자.

우선 워드프레스 메뉴 구조에 대해 알아보자. <strong>메뉴 위치</strong>(메뉴가 아닌). 이것은 메뉴를 어디에 위치 시킬 것인가에 대한 정의다. 관리자 화면에서 외모 &gt; 메뉴 &gt; 위치 관리하기 메뉴에서 테마가 제공하는 위치를 확인 할 수 있다. Twentyfifteen 테마의 경우 주메뉴 위치와 소셜 링크 메뉴 위치를 제공한다. 이 두가지 위치에 메뉴를 배치할 수 있는 것이다.

이번엔 메뉴 위치를 추가하고 그 곳에 메뉴를 추가해 보자. functions.php 파일에서 액션훅을 이용해 메뉴 위치를 추가하는 코드를 작성하자.
<pre class="lang:php decode:true" title="functions.php">function twentyfifteen_child_setup() {
  register_nav_menus( array(
    'bottom' =&gt; __( 'Bottom Menu', 'twentyfifteen_child' ),
  ) );
}
add_action( 'after_setup_theme', 'twentyfifteen_child_setup' );
</pre>
'after_setup_theme' 액션 후에 register_nav_menus() 함수로 'bottom'이라는 아이디를 갖는 메뉴 위치를 추가한다.  이 아이디는 다음에 메뉴 출력시 사용하므로 기억하고 있자.

관리자 페이지에 접속하면 Bottom Menu 라는 새로운 메뉴 위치가 추가 되었다.

<img class="alignnone wp-image-320 size-large" src="http://whatilearn.com/wp-content/uploads/2015/03/스크린샷-2015-03-28-오후-3.17.411-1024x471.png" alt="스크린샷 2015-03-28 오후 3.17.41" width="640" height="294" />

이젠 블로그 화면에 Bottom Menu를 직접 출력해 보자. 이름처럼 footer.php에 출력하는게 좋겠다.
<pre class="lang:php decode:true" title="footer.php">/* 생략 */

&lt;footer id="colophon" class="site-footer" role="contentinfo"&gt;

  /* Bottom Menu 위치 추가 */
  &lt;?php if ( has_nav_menu ( 'bottom' ) ) : ?&gt;
    &lt;?php wp_nav_menu( array(
      'theme_location' =&gt; 'bottom', // 새로 생성한 메뉴 위치 id
      'depth' =&gt; 1,
      'before' =&gt; '&lt;div class="bottom-menu-item"&gt;',
      'after' =&gt; '&lt;/div&gt;',
      'link_before' =&gt; '&lt;sapn&gt;',
      'link_after' =&gt; '&lt;/sapn&gt;',
      'container_class' =&gt; 'bottom-menu' ) ); ?&gt;
    &lt;?php endif; ?&gt;

  &lt;div class="site-info"&gt;

  /* 생략 */</pre>
마지막으로 어드민 페이지에서 메뉴를 생성한뒤 Bottom Menu 위치에 배치하면 메뉴를 블로그 하단에 추가할 수 있다.