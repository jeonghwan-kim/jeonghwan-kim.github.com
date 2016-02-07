---
id: 923
title: 우분투에 Django-admin, mysql-python 설치
date: 2015-12-03T18:04:28+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=923
permalink: /%ec%9a%b0%eb%b6%84%ed%88%ac%ec%97%90-django-admin-mysql-python-%ec%84%a4%ec%b9%98/
categories:
  - Django
  - Linux
tags:
  - django
  - mysql
  - pip
  - ubuntu
---
## 우분투에서 pip가 동작하지 않을 때

로컬에서 장고 프로젝트 테스트를 모두 마쳤다. 이를 우분투 실서버에 올려서 웹에 공개하는 일만 남았다. 장고 설치를 위해 pip 커맨드를 사용하자 에러가 발생한다.

```
Cannot fetch index base URL https://pypi.python.org/simple/ 
```

아래 몇가지 시도를 했으나 문제는 여전하다.

* pip 최신버전(7.1)을 설치
* 파이선 최신버전(3.x)을 사용
* apt-get 으로 설치. 장고 구버전이 설치됨.

pip 명령중 --proxy 옵션을 사용해 프록시서버를 거치라고 한다. 아마도 실서버에 뭔가 네트웍 제한이 있는가 보다. 그러나 프록시 서버를 사용할 환경도 아니고 솔직히 잘 모르겠다.


## Django 설치 

장고 소스를 받아서 직접 설치하자. [https://github.com/django/django/releases](https://github.com/django/django/releases)에서 장고 최신 소스를 다운받아 압축을 푼다. 폴더에 들어가서 장고를 설치한다.

```
$ python setup.py install
$ django-admin --version
1.9
```

## 파이썬 mysql 모듈 설치 

mysql 모듈도 마찬가지. pip로 설치시 동일한 에러가 발생한다. 이것은 apt로 설치 가능하다.

```
$ apt-get install python-mysqldb
```

만약 아래와 같이 에러메세지가 나온다면 mysql 클라이언트 설치가 필요한한 경우다.

```
  File "setup_posix.py", line 25, in mysql_config

    raise EnvironmentError("%s not found" % (mysql_config.path,))

EnvironmentError: mysql_config not found

----------------------------------------
Cleaning up...
Command python setup.py egg_info failed with error code 1 in /tmp/pip_build_root/mysql-python
Storing debug log for failure in /home/ubuntu/.pip/pip.log
```

Mysql 클라이언트 모듈을 설치한뒤 재 시도하면 설치된다.

```
$ sudo apt-get install libmysqlclient-dev
```

## 참고

* [https://github.com/django/django/releases](https://github.com/django/django/releases)
* [https://github.com/farcepest/MySQLdb1/blob/master/INSTALL](https://github.com/farcepest/MySQLdb1/blob/master/INSTALL)