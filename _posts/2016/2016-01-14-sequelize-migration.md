---
id: 1049
title: Sequelize 마이그레이션
date: 2016-01-14T09:21:17+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=1049
permalink: /sequelize-migration/
categories:
  - Sequelize
tags:
  - migration
  - sequelize
---
Sequelize ORM을 사용하면서 편리한 점은 마이그레이션 지원이다. 특히 운영중인 서비스의 데이터베이스를 변경할 때 편리하다. 개발 단계에서는 매번 `sync({force: true})`로 데이터베이스를 갱신할 수 있겠지만 운영중인 서비스에서는 불가능하다. 그렇다고 데이터베이스 스키마를 직접 수정하고 Sequelize 모델링 코드를 변경한다는 것은 번거럽기도 할 뿐만아니라 까딱 잘못하면 돌이킬수 없는 결과를 낳을 수도 있다. 이번 포스팅에서는 Sequelize 마이그레이션 방법에 대해 알아보겠다.


## 마이그레이션 생성

마이그레이션은 필요할 때마다 생성할 수 있다. 데이터베이스 스키마에 변경이 필요할 때마다 마이그레이션 코드를 만들어서 진행하는 것이다. 아래 명령어를 실행하면 migrations 폴더에 타임스탬프가 찍힌 파일이 하나 생성될 것이다. 

```bash
$ sequelize migration:create 
// 20160113211643-unnamed-migration.js
```

물론 파일명을 변경할수 있다. 마이그레이션 내용을 반영할 수 있는 적절한 이름으로 변경하되 유니크 해야한다. 

파일은 실행한 명령어가 만든 코드 템플릿으로 구성되어 있다.

```javascript
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
```

이 모듈은 `up()`과 `down()` 메소드를 노출하는데 각 각 마이그레이션과 롤백을 담당한다. `up()` 함수에 새로운 컬럼을 추가하는 코드를 작성하면, `down()` 함수에는 추가한 컬럼을 삭제하는 코드를 작성하는 식이다. 간단히 User 테이블에 nickname 컬럼을 추가하는 코드를 작성해 보자.

```javascript
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('User', 'nickname', {
      type: Sequelize.STRING
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('User', 'nickname');
  }
};
```

## 마이그레이션 진행

아래 명령어로 마이그레이션을 진행한다.

```shell
$ sequelize db:migrate --env development
```

`--env` 옵션으로 데이터베이스를 선택할수 있는데 로컬에서 운영(production)서버의 데이터베이스를 관리할 때 편리하다. `development`는 기본 값이다. 실행하면 마이그레이션이 진행되는 메세지를 터미널 창에서 볼 수 있다. 

마이그레이션이 완료되면 데이터베이스에는 `SequelizeMeta` 테이블이 생성된다. 

```shell
mysql> describe SequelizeMeta;
+-------+--------------+------+-----+---------+-------+
| Field | Type         | Null | Key | Default | Extra |
+-------+--------------+------+-----+---------+-------+
| name  | varchar(255) | NO   | PRI | NULL    |       |
+-------+--------------+------+-----+---------+-------+
1 row in set (0.00 sec)
```

`name` 컬럼 하나만 있는 테이블이다. 마이그레이션을 수행하면 그 마이그레이션의 파일명을 이 테이블에 기록한다. 반대로 마이그래이션을 취소하면 테이블에 해당 파일명을 삭제한다.

마이그레이션 파일이 여러개 있더라도 신규 마이그레이션만 동작하는 이유가 이것 때문이다. 마이그레이션 명령이 실행되면 SequelizeMeta 테이블을 확인하여 이미 수행한 마이그레이션은 제외하고 신규 마이그레이션만 진행하는 것이다. 만약 마이그레이션 롤백이 안되는 등 예외 사항이 발생한다면 이 테이블에 저장된 값을 삭제/추가하면서 문제를 해결할 수 있다.


## 마이그레이션 취소

아래 명령어로 간단히 롤백할 수 있다.

```shell
$ sequelize db:migrate:undo --env development
```

롤백은 한 단계씩 수행되며, 원하는만큼 실행 하면된다.


## 다중 마이그레이션 

만약 컬럼을 여러개 추가할 때는 어떻게 해야할까? 

`up()` 함수는 프라미스를 리턴하게 되어있는데 프라미스로 구성된 배열을 반환해도 된다. 컬럼을 여러개 추가할 것이라면 `addColumn()`을 배열에 담아 리턴하면 된다. 물론 롤백할 때도 동일하게 `removeColumn()`를 배열에 담아서 반환한다. ([참고](https://github.com/sequelize/cli/issues/133))

```javascript
module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('User', 'name', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('User', 'nickname', {
        type: Sequelize.STRING,
      })
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Challenges', 'name'),
      queryInterface.removeColumn('Challenges', 'nickname')
    ];
  }
};
```

물론 다른 방법도 있다. 직접 로우(raw) 쿼리를 실행할 수도 있다.

```javascript
module.exports = {
  up: function (queryInterface, Sequelize) {
    var sql = 'ALTER TABLE User ADD COLUMN nickname varchar(255) NOT NULL';

    return queryInterface.sequelize.query(sql, {
      type: Sequelize.QueryTypes.RAW
    });
  },

  down: function (queryInterface, Sequelize) {
    var sql = 'ALTER TABLE User DROP COLUMN nickname';

    return queryInterface.sequelize.query(sql, {
      type: Sequelize.QueryTypes.RAW
    });
  }
};
```
