---
title: "Sequelize Transaction 사용할때 주의할 점"
layout: post
category: dev
tags: [sequelize]
slug: /2016/07/13/sequelize-transaction.html
date: 2016-07-13
---

노드에서 데이터베이스 ORM으로 [Sequelize](http://docs.sequelizejs.com/en/latest/)를 사용한다.
성능상의 단점이 있지만 개발 속도와 가독성을 생각해 대부분 프로젝트에서 사용하는 편이다.
사실 그동안 트랜젝션 처리해야할 부분을 많이 놓쳐서 이번엔 제대로 트랜젝션을 걸어서 사용해 보기로 했다.
예를 들어 회원가입 API를 만든다고 생각해 보자.

1. 사용자 정보를 테이블에 추가하고 2) 추가된 사용자 정보와 몇가지 관련된 테이블의 데이터까지 조회하여 응답하는 로직을 만들 것이다.
   그래서 아래와 같은 코드를 작성했다.

```javascript
exports.register = (req, res) => {
  let userData = userDataForm(req.body);

  models.sequelize.transaction(t => {

      // User 추가
      return models.User.create(userData, {transaction: t}))
          .then(user => {

            // 추가된 User가 속한 Group 정보 조회
            modles.Group.findOne({id: user.GroupId}))
                .then(group => {

                  // 응답
                  return res.json({
                    user: user,
                    group: group
                  });
                });
          });
  });
}
```

코드가 돌아가는 것 같지만 가끔 Group 조회 결과 빈값이 나오는 경우가 있었다.
원인은 트렌젝션 처리를 잘못한 것인데 디비에 데이터를 추가/변경하는 경우만 트랜젝션을 걸어야한다고 착각했기 때문이다.
그래서 트랜젝션 걸려있는 부분 즉 User 추가하는 로직과 Group를 조회하는 로직이 따로 따로 실행된다.
조회하는 쿼리에도 같은 트랜젝션으로 묶어 줘야 하는 것이다.

```javascript
// modles.Group.findOne({id: user.GroupId}))
modles.Group.findOne({id: user.GroupId}, {transaction: t}))
```

findOne() 함수의 두번째 파라매터로 트랜젝션 변수를 넘겨줬다.
여전히 문제를 해결하지 못했다.
Sequelize의 데이터 조회/삭제 함수에 트랜젝션을 넘겨줄땐 첫번째 파라매터로 넘겨줘야 하는데 문제를 제대로 읽지 않은 탓이다.

```javascript
modles.Group.findOne({
  id: user.GroupId,
  transaction: t
}))
```

이제보니 참 사소한 내용이다.
