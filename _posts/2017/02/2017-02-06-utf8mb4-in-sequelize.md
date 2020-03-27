---
title: 시퀄라이즈에서 이모티콘 저장하기
layout: post
category: dev
permalink: node/2017/02/06/utf8mb4-in-sequelize.html
tags:
  sequelize
videoId: 4
---

## utf8과 utf8mb4

프로젝트를 시작하고 처음 실서버에 배포할 때 겪는 실수가 있다. 데이터베이스 생성시 기본 문자셋인 latin1을 그대로 사용하는 것이다. 영문만 사용할 것이라면 문제될게 없지만 이 문자셋은 한글을 제대로 다루지 못한다. 특히나 요즘처럼 이모티콘(Emoji)를 많이 사용하는 경우라면 한글 서비스가 아니더라도 반드시 인코딩 설정을 확인해야 한다.

```sql
INSERT INTO user (`name`) VALUES  (`김정환`);
```

위의 쿼리를 실행하면 실제 디비에는 name 값이 ‘???’으로 저장된다. 아래 명령어로 데이터베이스 문자셋을 utf8로 변경하자.

```sql
ALTER DATABASE databasename CHARACTER SET utf8 COLLATE utf8_general_ci;
```

이제 한글이 제대로 들어간다.  이번엔 이모티콘을 입력해 보자.

```sql
INSERT INTO user(`name`) VALUES (`😎`);
```

디비에는 또 ‘???’로 저장된다. 이모티콘은 utf8mb4 인코딩을 사용해야 한다.

```sql
ALTER DATABASE databasename CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
이제야 비로소 데이터베이스에 한글과 이모티콘을 저장할 수 있게 되었다.

```sql
INSERT INTO user(`name`) VALUES (`😎`);
```


## 시퀄라이즈에서 이모티콘 사용하기
한글과 이모티콘을 지원하는 데이터베이스를 만들었으니 시퀄라이즈로 데이터베이스 동기화를 진행해 보자.

이런! ORM이 아래 메세지를 던지고 멈춘다.

```bash
SequelizeDatabaseError: ER_TOO_LONG_KEY: Specified key was too long; max key length is 767
```

무엇이 문제일까?  시퀄라이즈로 모델링한 코드를 살펴보자.

```javascript
{
  user: Sequelize.STRING
}
```

시퀄라이즈 상수인 STRING은 varchar(255)를 의미한다.  utf8mb4와 varchar(255)는 어떤 문제를 일으키는 것일까?

name 컬럼을 인덱스 키로 사용한다고 생각해 보자.

(1) utf8의 경우 1글자당 3바이트를 사용한다. 따라서 STRING으로 정의한 컬럼은 765(3 * 255)바이트를 사용하여 인덱스 키를 생성한다.

(2) 반면 utf8mb4는 1글자당 4바이트를 사용한다. 따라서 STRING으로 정의한 컬럼은 1020(4 * 255)바이트를 사용하여 인덱스 키를 생성하게 된다.

[MySQL 문서](https://dev.mysql.com/doc/refman/5.7/en/innodb-restrictions.html)에 보면 Innodb엔진을 사용하는 MySQL 디비의 경우 인덱스 키의 최대 크기는 **767** 바이트다.  따라서 utf8mb4 문자셋은 varchar(255) 컬럼의 경우 1020바이트 인덱스 키를 사용하게 되므로 최대 크기를 넘어서는 문제가 발생하는 것이다.

그럼 해결책은 뭘까? 간단하다. 컬럼 길이가 경계값을 넘지 않는 764(4 * 191)바이트만 사용하도록 varchar(191)로 정의하면 된다.

```javascript
{
  user: Sequelize.STRING(191)
}
```

## 결론
ORM을 사용하면 딱히 디비 스키마에 얽매이지 않고  NoSQL 디비처럼 사용하게 된다. 앞으로는 컬럼 최대 길이만이라도 정해논 상태에서 개발하는 것이 좋겠다.
