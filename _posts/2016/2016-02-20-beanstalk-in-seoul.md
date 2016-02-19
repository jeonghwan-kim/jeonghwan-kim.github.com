---
title: '서울에서 Elastic Beanstalk 사용하기'
layout: post
tags:
 - aws
 - elastic beanstalk
---

AWS 한국 리젼이 추가되면서 빈스톡도 서울에 설치해봤다. 프로젝트를 새로 만들고 Git도 설정한 뒤에 
AWS 커맨드라인 명령어로 빈스톡을 초기화 했다.

```bash
$ eb init

Select a default region
1) us-east-1 : US East (N. Virginia)
...
```

결과에 서울 리전이 보이지 않는다. 

```bash
$ eb --version
// EB CLI 3.7.3 (Python 2.7.1) // todo 
```

커맨드라인툴 버전을 업그레이드 해야 한다

```bash
$ pip install --upgrade awsebcli
```

설치 에러 발생.

[문서]()에 커맨드라인툴은 파이썬 3를 지원하지 않는다고 한다. 장고 프로젝트를 하면서 기존 2.7 버전을
3 버전으로 업그레이드 했던것이 문제다. 다시 다운그레이드를 한다. ([참고]())

```bash
$ downgrade
```

다시 업데이트 후 빈스톡을 초기화 하면  9번에 리즌이 나온다. 

```bash
$ eb init

Select a default region
1) us-east-1 : US East (N. Virginia)
2) us-west-1 : US West (N. California)
3) us-west-2 : US West (Oregon)
4) eu-west-1 : EU (Ireland)
5) eu-central-1 : EU (Frankfurt)
6) ap-southeast-1 : Asia Pacific (Singapore)
7) ap-southeast-2 : Asia Pacific (Sydney)
8) ap-northeast-1 : Asia Pacific (Tokyo)
9) ap-northeast-2 : Asia Pacific (Seoul)
10) sa-east-1 : South America (Sao Paulo)
11) cn-north-1 : China (Beijing)
```
 
11번에 베이징도 추가되었다. 도교 8번과 바꿨으면 마케팅 수단이 될수 있지 않았을까?ㅋ 
Asia Pacific으로 분류하지 않고 China로 한걸 보면 더 추가될지도 모르겠다.
