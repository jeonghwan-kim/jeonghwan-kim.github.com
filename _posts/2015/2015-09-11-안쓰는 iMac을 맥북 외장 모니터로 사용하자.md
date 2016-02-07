---
id: 720
title: 안쓰는 iMac을 맥북 외장 모니터로 사용하자!
date: 2015-09-11T21:56:33+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=720
permalink: /%ec%95%88%ec%93%b0%eb%8a%94-imac%ec%9d%84-%eb%a7%a5%eb%b6%81-%ec%99%b8%ec%9e%a5-%eb%aa%a8%eb%8b%88%ed%84%b0%eb%a1%9c-%ec%82%ac%ec%9a%a9%ed%95%98%ec%9e%90/
dsq_thread_id:
  - 4554050881
categories:
  - osx
tags:
  - imac
  - macbook
  - tdm
---
맥북에 아이맥을 연결해서 사용해 보자.

<h1>목표</h1>

<ul>
<li>아이맥을 맥북의 외장 모니터로 사용한다.</li>
<li>아이맥에 연결된 애플 키보드와 매직 마우스도 맥북에 연결해 사용한다.</li>
</ul>

<h1>외장 모니터</h1>

아이맥은 타겟 디스플레이 모드(TDM)를 제공한다. 아이맥이 켜져있는 상태에서 디스플레이만 다른 컴퓨터의 외장 모니터로 연결해 주는 기능이다. 썬더볼트 연결을 통해 맥북의 화면을 아이맥으로 보내준다. 중고나라에서 2미터짜리 썬더볼트 케이블 2미터를 구매했다. (2만원)

맥북과 아이맥을 연결한 뒤, 아이맥에서 cmd + f2를 누르면 바로 TDM으로 진입한다. 연결된 맥북의 외장 모니터로 된 것이다. 가끔 화면이 어두워진 상태에서 밝기 조절이 안되는 경우가 있는데 cmd + f2를 눌러 TDM에서 나와 다시 들어가면 밝기 조절이 가능하다.

TDM 설정을 위해 cmd +f2 조합키를 사용해야 하는데 다른 일반 키보드로는 불가능하다. 오직 애플 키보드로만 모드 변경이 가능하다. 만약 아이맥의 블루투스를 원격에서 끌수만 있다면, 맥북과 키보드/마우스를 블루투스로 연결할 수 있을 것 같다.

<h1>키보드, 마우스 연결</h1>

<a href="http://www.frederikseiffert.de/blueutil/">blueutil</a>은 osx의 블루투스를 on/off할 수 있는 프로그램이다.

<pre><code>$ blueutil off
$ blueutil on
</code></pre>

맥북에서 아이맥으로 ssh 접속하여 blueutil로 아이맥의 블루투스를 끄면 맥북과 키보드/마우스를 페어링할 수 있다.

먼저 아이맥에서 blueutil를 다운로드하고 설치하자. 그리고 시스템 환경설정 > 공유에서 원격로그인을 켜자. cmd + f2로 TDM로 진입후 맥북에서 아이맥으로 ssh 연결을 시도한다. 단 아이맥과 맥북은 동일한 사설 네트웍에 연결되어 있어야한다.

<pre><code>$ ssh username@imac-host 
</code></pre>

연결이 제대로 안되면 아래 명령어도 시도해 보자.

<pre><code>$ ssh -o IdentitiesOnly=yes username@imac-host 
</code></pre>

아이맥에 접속한 뒤, 블루투스를 끈다.

<pre><code>$ blueutil off
</code></pre>

이제 맥북과 키보드/마우스를 블루투스 페이링할 수 있다. 아이맥의 스피커도 덤으로 사용할수 있게 되었다.