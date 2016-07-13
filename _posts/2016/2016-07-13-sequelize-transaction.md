---
title: 'Sequelize Transaction'
layout: post
tags:
  sequelize
summary: Sequelize로 디비 트랜잭선 사용하는 방법에 대한 정리
---


하나 이상의 쿼리를 한번에 실행할 때 데이터베이스의 트랜잭션(transaction) 기능을 이용한다.
데이터베이스에 사용자 계정을 지운다고 생각해 보자.

1. UserId가 외래키(foreign key)로 지정된 테이블의 데이터를 모두 제거한 뒤
2. User 테이블의 데이터를 삭제한다.

만약 1번 작업 도중에 에러나는 상황을 생각해 보자.
1번 작업이 완료되지 않고 데이터가 덜 삭제 된 상태에서 2번 작업을 진행할 수 없다.
따라서 지금까지 했던 모든 작업을 취소하고 원래대로 복원시켜야하는데 이것을 롤백(rollback)이라고 한다.

디비에서는 이러한 구조의 쿼리 로직을 트랜젝션이고 하고 대표적인 ORM 라이브러리인 Sequelize에서도 이 기능을 제공한다.
이번 포스트에서는 Sequelize를 이용해 트랜젝션 처리하는 방법에 대해 알아보자.

## sequelize.transaction()

`transaction()` 함수로 트랜젹션 변수 `t`를 얻을 수 있다.
t는 하나의 트랜젝션을 의미하는데 시작하는 쿼리부터 마지막 쿼리까지 이 트랜젝션 변수를 쿼리 함수의 파라매터로 넘겨줘야 한다.
각 함수별로 트랜제션 파라매터 인터페이스는 다음과 같다.

* `create(options, {transaction: t})`
* `update(options, {transaction: t})`
* `find({transaction: t})`
* `delete({transaction: t})`


sequelzie의 transaction() 함수로 사용


```javascript
function deleteUser(userId, t) {
  return models.User.destroy({
    where: {id: userId}
  }, {transaction: t});
}

function deletePostsByUserId(userId, t) {
  return models.Post.destroy({
    where: {UserId: userId}
  }, {transaction: t});
}

function clearUser(userId) {
  return models.sequelize.transaction(function (t) {
    return Promise.resolve()
        .then(() => deletePostsByUserId(userId, t))
        .then(() => deleteUser(userId, t))
        .then(() => true)
        .catch((err) => {
          console.error(err);
          t.rollback();
          return Promise.reject(err);  
        });
  });
}
```

## create() 하고 findOne() 하는 경우 주의할 점

```javascript
models.sequelzie.transaction(t => {
  return models.User.create(userData, {transaction: t}).then(user => {
    t.commit();

    models.User.findOne({
      where: {
        id: user.id
      }
    }).then(user => user); // null!
  })
})

```
