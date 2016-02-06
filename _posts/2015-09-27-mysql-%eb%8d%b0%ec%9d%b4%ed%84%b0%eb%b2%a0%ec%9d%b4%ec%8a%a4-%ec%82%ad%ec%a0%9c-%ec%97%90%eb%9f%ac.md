---
id: 754
title: mysql 데이터베이스 삭제 에러
date: 2015-09-27T12:27:46+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=754
permalink: /mysql-%eb%8d%b0%ec%9d%b4%ed%84%b0%eb%b2%a0%ec%9d%b4%ec%8a%a4-%ec%82%ad%ec%a0%9c-%ec%97%90%eb%9f%ac/
categories:
  - MySql
tags:
  - mysql
  - troubleshooting
---
## 문제 

mysql 테이블을 삭제할 경우 아래 오류 메세지를 보는 경우가 있다.

```
DROP DATABASE db_name;
ERROR 1010 (HY000): Error dropping database (can't rmdir './db_name', errno: 66)
```

osx에서 homebrew로 mysql을 설치한 환경이다. 이럴 경우 직접 테이블 폴더를 삭제하면 해결할 수 있다.

## 데이터 폴더 삭제

mysql 데몬을 실행할때 `mysql.server start` 명령어로 실행한다. 명령어 위치를 찾자.

```
$ which mysql.server
/usr/local/bin/mysql.server
```

파일을 열어보면 스크립트 코드로 되어 있다. `datadir` 로 검색하면 `datadir=/usr/local/var/mysql` 폴더가 데이터 폴더이다.

```
$ ls -al /usr/local/var/mysql
```

이 폴더를 살펴보면 테이블별로 폴더가 구성된 것을 확인할 수 있다. 삭제할 폴더를 지우고 데몬을 재실행하면 테이블을 삭제할 수 있다.

```
$ rm -rf removed_folder
$ mysql.server restart
```




