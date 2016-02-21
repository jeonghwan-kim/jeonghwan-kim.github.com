---
title: '서울에서 Elastic Beanstalk 사용하기'
layout: post
tags:
 - aws
 - elastic beanstalk
---

AWS 한국 리젼이 추가되면서 빈스톡도 서울에 설치해봤다. 프로젝트를 새로 만들고 깃 커밋을 작성한 뒤에 
AWS 커맨드라인 명령어로 빈스톡을 초기화 했다.

```bash
$ eb init

Select a default region
1) us-east-1 : US East (N. Virginia)
...
```

결과에 서울 리전이 보이지 않는다. 하긴 빈스톡 사용한지도 좀 오래됐다. 커맨드라인 툴의 버전을 확인해 봤다.

```bash
$ eb --version
// EB CLI 2.x.x (Python 2.7.1)  
```

가장 최근 버전이 v3.7이다. 파이썬 패키지 툴로 업그레이드 한다. 

```bash
$ pip install --upgrade awsebcli
```

PIP로 업그레이드가 안된다.  
[문서](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)에 
커맨드라인툴은 파이썬 3를 지원하지 않는다고 한다. 장고 프로젝트를 하면서 기존 2.7 버전을
3 버전으로 업그레이드 했던것이 문제다. 다시 다운그레이드를 한다. 
([참고](http://stackoverflow.com/questions/5621952/uninstall-python-3-2-on-mac-os-x-10-6-7))


다시 업데이트 후 빈스톡을 초기화 하면  9번에 서울 리즌을 확인할 수 있다.  

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
 
11번에 베이징도 추가되었다. 도교 8번과 바꿨으면 마케팅 수단이 될수 있지 않았을까?ㅋㅋㅋ 
Asia Pacific으로 분류하지 않고 China로 한걸 보면 더 추가될지도 모르겠다.
