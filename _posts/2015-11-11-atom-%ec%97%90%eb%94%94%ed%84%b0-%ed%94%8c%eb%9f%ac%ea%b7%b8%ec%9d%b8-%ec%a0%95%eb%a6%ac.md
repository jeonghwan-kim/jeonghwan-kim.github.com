---
id: 856
title: Atom 에디터 플러그인 정리
date: 2015-11-11T20:34:05+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=856
permalink: /atom-%ec%97%90%eb%94%94%ed%84%b0-%ed%94%8c%eb%9f%ac%ea%b7%b8%ec%9d%b8-%ec%a0%95%eb%a6%ac/
categories:
  - Atom
tags:
  - atom
  - atom-plugin
---
Atom 에디터가 손에 익었다. 초반에 이것 저것 플러기인을 설치해보며 테스트해본 결과 지금까지 삭제하지 않고 사용하는 플러그인을 소개한다.

<h2>file-icons</h2>

파일명 앞에 아이콘을 붙여주는 플러그인이다. 이것이 에디터 본연의 기능과 무슨 상관이냐라고 할지 모르지만 에티터는 보기 좋아야 한다고 생각한다.

<pre><code>$ apm install file-icons
</code></pre>

<a href="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-11-오후-8.10.08.png"><img class="alignnone size-large wp-image-858" src="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-11-오후-8.10.08-1024x656.png" alt="스크린샷 2015-11-11 오후 8.10.08" width="640" height="410" /></a>

<h2>linter &amp; linter-jshint</h2>

IDE를 사용하는 이유 중 하나는 문법오류 체크 기능 때문일 것이다. 아톰에서도 이러한 플러그인이 있는데 linter가 그것이다. linter 는 혼자서 동작하지 않고 언어별로 필요한 패키치를 추가 설치하여야 한다. 자바스크립트를 사용한다면 jshint를 사용할 것이다. 두 패키지 모두 설치하자.

<pre><code>$ apm install linter linter-jshint
</code></pre>

<a href="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-11-오후-8.14.03.png"><img class="alignnone size-large wp-image-859" src="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-11-오후-8.14.03-1024x458.png" alt="스크린샷 2015-11-11 오후 8.14.03" width="640" height="286" /></a>

입력한 코드를 체크하여 에러 코드 줄을 표시하고 하단 패널에 메세지를 출력한다. <code>Disable When No Jshintrc File in Path</code>옵션을 사용하면 프로젝트 폴더에 .jshintrc 파일이 있는 경우에만 동작한다. <a href="https://gist.github.com/jeonghwan-kim/7be4d6bf7622fba126ab">.jshintrc 샘플</a>을 참고하자

<h2>project-manager</h2>

프로젝트로 저장할 수 있는 패키지다. 여러개 폴더를 관리할때 유용하게 사용할 수 있다.

설치 후

<pre><code>$ apm install project-manager
</code></pre>

cmd + shift + p, save project를 선택하여 프로젝트를 저장한다. cmd + ctrl + p를 누르면 저장된 프로젝트 목록을 확인하고 로딩할 수 있다.

<a href="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-11-오후-8.21.01.png"><img class="alignnone size-large wp-image-860" src="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-11-오후-8.21.01-1024x653.png" alt="스크린샷 2015-11-11 오후 8.21.01" width="640" height="408" /></a>

&nbsp;