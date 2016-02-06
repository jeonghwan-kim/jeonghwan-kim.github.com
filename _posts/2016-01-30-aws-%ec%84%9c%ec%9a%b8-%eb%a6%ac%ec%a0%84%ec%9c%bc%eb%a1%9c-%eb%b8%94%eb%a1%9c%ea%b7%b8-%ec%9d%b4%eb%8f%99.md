---
id: 1086
title: AWS 서울 리전으로 블로그 이동
date: 2016-01-30T19:35:32+00:00
author: Chris
layout: post
guid: http://52.79.96.80/?p=1086
permalink: /aws-%ec%84%9c%ec%9a%b8-%eb%a6%ac%ec%a0%84%ec%9c%bc%eb%a1%9c-%eb%b8%94%eb%a1%9c%ea%b7%b8-%ec%9d%b4%eb%8f%99/
categories:
  - 미분류
tags:
  - aws
  - migration
---
아마존웹서비스 서울 리전 출시전에는 지리적으로 한국과 가장 가까운 곳이 도쿄였다. 블로그를 도쿄에 EC2 하나로 구성한 것을 이번 기회에 서울로 옮기기로 작정했다. 이따금 데이터베이스 데몬이 죽는 경우가 발생해서 여간 귀찮지 않았기 때문. 이왕 하는김에 RDS로 분리하자. 장애를 고치는 것보다 돈 조금내고 신경 안쓰는게 더 낫다.


## 도쿄에서 서울로 EC2 인스턴스 복제

서울 리전이라고해서 새로울 것은 없었다. 아니다. EC2를 다른 리전에 복제할 경우는 좀 달랐다. 방법은 이렇다. 도쿄 EC2 인스턴스를 AMI로 스샷을 만든다. 그리고 스샷을 복사해 서울 리전으로 옮긴다. 그럼 서울리전의 EC2 대쉬보드에서 복사된 스냅샷을 확인할 수 있을 것이다. 이를 이용해 EC2 인스턴스를 만들 수 있었다.

이번에 보니 micro 인스턴스보다 작은 nano 인스턴스라고 새로 생긴것 같다. 1 vCPU에 1 GiB Memory. 이걸로 했다. 나중에 서버 부하가 생기면 ELB로 오토스케일링을 설정하면 되겠다.


## RDS

도쿄에 있는 EC2에 접속해서 mysqldump로 디비를 백업한다. 

```
mysqldump -h localhost -u ubuntu -p > dump.sql
```

그리고 서울 리전에 생성한 RDS로 백업한다.

```
mysql -h rds_address -u user -p db_name < dump.sql
```

RDS 설정할 때마다 궁금해서 검색하는게 있는데 private ip 설정이다. 같은 리전에 있기는 하나 사설 네트웍으로 묶여있는 건지는 확실치 않다. 우선 연결만 해놓고 보자.


## Route53

새로운 EC2 주소만 변경했다.

