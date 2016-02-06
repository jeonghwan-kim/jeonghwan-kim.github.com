---
id: 707
title: 크론을 사용할때 서버 시간을 정확히 맞추자
date: 2015-09-08T20:10:54+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=707
permalink: /%ed%81%ac%eb%a1%a0%ec%9d%84-%ec%82%ac%ec%9a%a9%ed%95%a0%eb%95%8c-%ec%84%9c%eb%b2%84-%ec%8b%9c%ea%b0%84%ec%9d%84-%ec%a0%95%ed%99%95%ed%9e%88-%eb%a7%9e%ec%b6%94%ec%9e%90/
AGLBIsDisabled:
  - 0
categories:
  - Linux
tags:
  - cron
  - linux
  - ntpdate
  - ubuntu
---
일정한 주기로 서버에서 어떤 일을 처리할 때, 크론(Cron)을 사용한다. 모바일로 푸시노티피케이션을 주기적으로 보내야 할때, 혹은 실시간으로 처리하지 않고 쌓아둔 작업을 한번에 처리할 때 크론을 사용하면 좋다. 노드(Nodejs)에서는 [node-cron](https://github.com/ncb000gt/node-cron) 모듈을 사용하여 크론잡 관리를 할수 있다. 

문제
===

그런데 서버에 설정한 잡이 제 시간에 돌지 않은 것 같다. 로컬 컴퓨터에서는 1초도 틀리지 않고 정확히 수행되던 잡이 서버에 올라가면 늦게 동작한다. 타임존 이슈인가 체크해 봤지만 한국이나 도쿄(서버가 도쿄에 있음)나 같은 시간대이다. 게다가 12분 차이는 타임존 오차도 아니다.

시간 설정
=======

로컬 노드 쉘에서 Date.now()로 확인한 시간과 서버 노드 쉘에서 확인한 시간이 다르다.

```
node> Date.now()
```

우분투 서버 Bash 쉘에서 다시 시간을 확인해 봤다.

```
$ date
$ ntpdate
```

두 명령어의 결과가 다르다. 아래 명령어로 서버 시간을 갱신할 수 있다.

```
$ ntpdate ntp.ubuntu.com
```


참고
====

* [https://help.ubuntu.com/community/UbuntuTime#Time_Synchronization_using_NTP](https://help.ubuntu.com/community/UbuntuTime#Time_Synchronization_using_NTP)