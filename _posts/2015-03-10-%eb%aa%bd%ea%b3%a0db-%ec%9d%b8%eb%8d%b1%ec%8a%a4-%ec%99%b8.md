---
id: 243
title: 몽고DB 인덱스 외
date: 2015-03-10T00:10:10+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=243
permalink: /%eb%aa%bd%ea%b3%a0db-%ec%9d%b8%eb%8d%b1%ec%8a%a4-%ec%99%b8/
categories:
  - Node.js
  - 미분류
tags:
  - log.io
  - mongodb
---
<h2>몽고DB 인덱스</h2>

노드 몽고디비 모듈을 통해 디비 서버에 쿼리가 갑자기 느려졌다. 길게는 30초까지 걸린다. 아마존 ec2 인스턴스을 올려도 마찬가지다. 백업해둔 몽고 DB를 mongorestore로 복구할 때 인덱싱을 스킵한 것이 원인이다.

<h2>log.io-harvestor</h2>

빈스톡에 log.io-harvestor 데몬을 설정해 놨다. 빈스톡에 새 버전 소스를 배포할때 간헐적으로 이 데몬이 죽는 경우가 발생한다.

원인: log.io-harvestor는 ec2-user 권한으로 실행한다. 빈스톡 배포는 webapp이 실행해서 권한 문제 발생.

ec2-user 계정으로 실행하는 크론잡으로 해결할수 있을 것 같다.