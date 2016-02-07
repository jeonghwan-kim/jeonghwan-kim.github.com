---
id: 972
title: 'Sequelize Seed &#8211; 시드 데이터 관리하기'
date: 2016-02-03T12:02:53+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=972
permalink: /sequelize-seed-%ec%8b%9c%eb%93%9c-%eb%8d%b0%ec%9d%b4%ed%84%b0-%ea%b4%80%eb%a6%ac%ed%95%98%ea%b8%b0/
dsq_thread_id:
  - 4553996042
categories:
  - Sequelize
tags:
  - migration
  - seed
  - sequelize
---
API 서버를 만들다 보면 테스트가 필요하다. 코드단에서 유닛테스트 따위를 말하는게 아니다. 
서버 개발자가 만든 코드를 개발 서버에 배포한뒤 모바일 개발자가 API 서버를 사용할 때를 말한다. 
서버를 업데이트 할 때마다 데이터베이스가 텅텅 비어있기 때문에, (개발초기에 디비 스키마가 확정되지 않은 상태라면 매번 디비 스키마를 갱신한다) 뭔가 샘플 데이터를 입력해야만 모바일 개발자가 편하다. 

그 동안은 seed 모듈을 만들어서 서버 구동시에 데이터베이스 싱크가 종료된 직후 seed 데이터를 입력하도록 코딩했다. [Sequelize](https://github.com/sequelize/sequelize)에서 [seed 기능](https://github.com/sequelize/cli#seed)을 지원하는지 알기 전까지는...

```javascript
// 디비 스키마를 초기화 한다.
models.sequelize.sync({force: true})
      .then(function () {

        // 시드 데이터를 입력한다.
        return require('./seed').insert();
      })
      .then(function () {

        // 서버 리슨.
        server.listen(PORT, IP);
      });
```

이제는 [Sequelize-cli](https://github.com/sequelize/cli)로 migration를 한것과 유사하게 seed 데이터를 관리할 수 있다.


## 시더 초기화

Sequelize-cli 로 아래 명령어를 실행하면 `seeders` 폴더가 생성된다. `migrations` 폴더처럼 앞으로 `seeders` 폴더에 시드 데이터를 관리할 수 있다.

```
sequelize init:seeders
// seeders 폴더 생성됨
```


## 시더 파일 생성

`seed:create`로 시드 파일을 생성한다. 마이그레이션을 생성했던 것처럼 타임스탬프가 찍인 자바스크립트 파일이 seeders 폴더에 생성될 것이다.

```
sequelize seed:create
// seeders/timestamp-unnamed-seeder.js 생성됨
```

이 파일 구조를 살펴보자. 많이 보던 구조다. up, down 함수로 구성된 것이 마이그레이션 파일과 똑같은 형식이다. Users 테이블에 데이터를 추가해 보자.

```
module.exports = {
  up: function (queryInterface, Sequelize) {

    // 시드 데이터를 추가한다.
    return queryInterface.bulkInsert('Users', [{
      email: 'user1@mail.net',
      name: 'user1'
    }, {
      email: 'user2@mail.net',
      name: 'user2'
    }], {});
  },

  down: function (queryInterface, Sequelize) {

    // 추가했던 데이터를 삭제한다. 
    return queryInterface.bulkDelete('Users', {
      email: {
        $in: ['user1@mail.net', 'user2@mail.net']
      }
    }, {});
  }
};

```


## 시더 실행 

`sequelize db:seed` 명령으로 시더를 입력한다. 

```
sequelize db:seed

Starting 'db:seed'...
Finished 'db:seed' after 71 ms
== 20160131203128-users-seeder: migrating =======
== 20160131203128-users-seeder: migrated (0.016s)
```

마이그레이션을 실행했을 때와 비슷한 결과를 보여준다. 데이터베이스 테이블에는 `SequelizeData` 테이블이 생성되고 방금 실행한 seed 파일명이 기록된다. 입력을 취소할 때는 `db:seed:undo`나 `db:seed:undo:all` 명령어를 사용한다.


# 좀 더 생각할 점

자 이제 서버 코드에서 직접 샘플 데이터 입력해야하는, 서버 본연의 기능과는 좀 거리가 있는 코드를 제거할 수 있게 되었다. Sequelize-cli의 seed 명령으로 데이터를 관리할 수 있기 때문이다. 그러나 디비 마이그레이션과 관련해서 생각해 볼 필요가 있다.

가정해 보자.

1. Users 테이블에 name이 'chris'인 데이터를 추가하는 시드 파일 생성.
1. 시드 실행.
1. Users 테이블의 name 컬럼을 nickname으로 변경하는 마이그레이션 파일 생성.
1. 마이그레이션 실행.

시드와 마이그레이션이 빈번한 개발 단계에서는 순서에 맞게 실행하면 문제가 없을거다. 그리나 이게 프로덕션 서버로 올라가서 여러 개의 시드와 마이그레이션이 한번에 실행된다고 하면 어떨까? 마이그레이션을 모두 수행한 다음 시드를 수행한다면? 시드에서는 name 컬럼에 값을 입력하도록 했는데 name을 nickname으로 변경하는 마이그레이션을 먼저 실행했기 때문에 실패할 것이다.

그렇다고 순서를 반대로하면 문제가 없을까?

반대로 가정을 해보자.

1. Users 테이블의 name 컬럼을 nickname으로 변경하는 마이그레이션 파일 생성.
1. 마이그레이션 실행.
1. Users 테이블에 name이 'chris'인 데이터를 추가하는 시드 파일 생성.
1. 시드 실행.

처음과 반대로 seed를 먼저 실행하면 바로 오류가 난다. Users 테이블의 nickname 컬럼이 아직 없기 때문이다.


