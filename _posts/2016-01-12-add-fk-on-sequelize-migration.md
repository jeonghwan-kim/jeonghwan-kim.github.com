---
id: 1046
title: Sequelize로 마이그레이션 시 외래키 추가하기
date: 2016-01-12T22:17:40+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=1046
permalink: /add-fk-on-sequelize-migration/
categories:
  - Sequelize
tags:
  - fk
  - migration
  - sequelize
---
데이터베이스 ORM인 Sequelize는 마이그레이션 기능을 제공한다. 모델링을 마친 데이터베이스에 대해 변경 작업이 필요한 경우, 코드로 변경내용을 기술한 뒤 커맨드라인 명령어를 통해 마이그레이션을 진행할 수 있다. 

`addColumn()`은 기존 테이블에 컬럼을 추가할 경우 사용하는 메소드인데 외래키 설정은 아직 미지원 상태다. ([참고](https://github.com/sequelize/sequelize/issues/966)) 이를 해결하기 위한 방법 중 쿼리를 직접 작성하여 마이그레이션하는 방법이 있다. ([참고](https://github.com/sequelize/sequelize/issues/2943))

User, Friend 테이블을 정의했다고 하자. Friend 테이블에 User 테이블을 참조하는 UserId 컬럼을 추가할때 아래와 같이 마이그레이션 코드를 작성한다.

```
module.exports = {
  up: function (queryInterface, Sequelize) {

    // raw 쿼리
    // 외래키 제한자를 설정한다.
    var sql = "ALTER TABLE `Friend`" +
        "  ADD COLUMN `UserId` BIGINT(20) UNSIGNED DEFAULT NULL" +
        ", ADD CONSTRAINT `fkUserIdInFriend` FOREIGN KEY (`UserId`) REFERENCES `User` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT";

    // 쿼리 실행 
    return queryInterface.sequelize.query(sql, {
      type: Sequelize.QueryTypes.RAW
    });
  },

  down: function (queryInterface, Sequelize) {
    var sql = "ALTER TABLE `Friend`" +
        "  DROP FOREIGN KEY `fkUserIdInFriend`, DROP COLUMN `UserId`";

    return queryInterface.sequelize.query(sql, {
      type: Sequelize.QueryTypes.RAW
    });
  }
};
```

`UserId` 컬럼을 추가하고 여기에 `fkUserIdInFriend` 제한자를 추가한다. 

아래 마이그레이션 명령어를 실행하면 외래키가 설정된 UserId 컬럼을 Friend 테이블에 추가할 수 있다.

```
$ sequelize db:migrate
```
