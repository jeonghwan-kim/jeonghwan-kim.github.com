---
id: 744
title: osx 노트 글꼴 변경
date: 2015-09-28T15:48:23+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=744
permalink: /osx-%eb%85%b8%ed%8a%b8-%ea%b8%80%ea%bc%b4-%eb%b3%80%ea%b2%bd/
categories:
  - osx
tags:
  - notes
  - osx
---
iOS9이 나오면서 노트 앱에도 큰 변화가 있었다. 점점 노트 어플리케이션으로서 다른 프로그램에 뒤지지 않을 기능을 갖춰 나가는 것 같다. 한 가지 아쉬운 점은 활자가 너무 작다. 좀 키우고 싶은데 메뉴에 없다. plist를 편집해서 폰트를 키울 수 있다.

<pre><code>$ ls /Applications/Notes.app/Contents/Resources
</code></pre>

노트앱 폴더의 Resoureces 폴더에는 언어셋에 따라 하위 폴더가 있다. <code>ko.lproj</code> 폴더로 이동한다.

<pre><code>$ cd ko.lproj
</code></pre>

<code>DefaultFonts.plist</code> 파일을 열어보면 기본 폰트 정보를 확인할 수 있다.

<pre><code class="xml">?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"&gt;
&lt;plist version="1.0"&gt;
&lt;array&gt;
    &lt;dict&gt;
        &lt;key&gt;FontName&lt;/key&gt;
        &lt;string&gt;Helvetica Neue&lt;/string&gt;
        &lt;key&gt;Size&lt;/key&gt;
        &lt;integer&gt;12&lt;/integer&gt;
    &lt;/dict&gt;
    &lt;dict&gt;
        &lt;key&gt;FontName&lt;/key&gt;
        &lt;string&gt;Noteworthy-Light&lt;/string&gt;
        &lt;key&gt;Size&lt;/key&gt;
        &lt;integer&gt;12&lt;/integer&gt;
    &lt;/dict&gt;
    &lt;dict&gt;
        &lt;key&gt;FontName&lt;/key&gt;
        &lt;string&gt;MarkerFelt-Thin&lt;/string&gt;
        &lt;key&gt;Size&lt;/key&gt;
        &lt;integer&gt;12&lt;/integer&gt;
    &lt;/dict&gt;
&lt;/array&gt;
&lt;/plist&gt;
</code></pre>

설정되어있는 폰트크기 12를 14로 변경한 뒤, 노트앱을 재실행하면 기본 폰트 크기가 변경된 것을 확인할 수 있다.