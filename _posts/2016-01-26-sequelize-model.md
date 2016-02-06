---
id: 955
title: Sequelize Modeling
date: 2016-01-26T23:27:50+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=955
permalink: /sequelize-model/
categories:
  - Sequelize
tags:
  - sequelize-modeling
---
글 순서가 반대로 되었다. 이왕 Sequelize ORM에 대해 정리할 것이라면 개발 순서에 따라 모델링부터 작성했으면 보기 좋았을 것 같다. 이번 글은 Sequelize로 테이블을 정의하는 방법(모델링)에 대해 알아보자

<img src="http://whatilearn.com/wp-content/uploads/2016/01/sequelize-logo-2016-01-26-1024x412.png" alt="sequelize-logo-2016-01-26" width="640" height="258" class="alignnone size-large wp-image-1082" />.


# Definition

데이터베이스 테이블을 정의하기 위해서는 `define()` 함수를 사용한다.

```javascript
module.exports = function(sequelize, DataTypes) {

  // define() 함수로 테이블을 정의한다 
  var User = sequelize.define('User', {
    name: DataTypes.String,
    birthday: type: DataTypes.DATEONLY,
    userType: {
      DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    }
};
```

첫번째 파라메터 `'User'`가 테이블 이름인데 기본적으로 복수형 이름을 갖는 테이블이 생성된다. 이 경우 Users 테이블이 생성된다. 두번째 파라메터가 테이블 컬럼을 정의하는 객체다. 여기서 키(key)는 컬럼명, 값(value)은 컬럼 속성을 정의하는데 `DataTypes`에 정의된 데이터 타입을 사용한다.


## Getter, Setter

DataTypes에 정의된 속성 말고 좀 더 구체적인 속성을 지정하고 싶다면 `get`/`set` 키를 사용할 수 있다. `get`에 함수를 정의하여 테이블에서 컬럼 값을 가져올 때 뭔가 후속 작업을 할 수 있도록 한다. 반대로 `set`에 정의한 함수는 테이블에 해당 컬럼 값이 입력될때 전처리 작업을 처리할 수 있다. 비밀번호를 처리는 부분을 예로 들 수 있겠다.

```javascript
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    password: {
      DataTypes.STRING

      // 데이터 입력시 전처리 
      set: function (val) {
        this.setDataValue('password', require('crypto').createHash('md5').update(val).digest('hex'))
      },

      // 데이터 조회시 후처리 
      get: function () {
        return null;
      },
    }
};
```

비밀번호를 받아 저장할 경우 Setter를 통해 암호화 하여 저장하고 비밀번호를 조회할 때는 Getter 함수에서 null을 반환하여 숨김처리를 할 수 있다.


## Validator 

REST API를 구현한다면 POST Body에 대한 검증시 Sequelize의 도움을 받을 수 있다. 이메일 주소를 입력받아 User 테이블에 넣는 상황을 생각해 보자. req.body.email로 요청값을 얻을 수 있다. RegExp 객체로 입력 문자열을 검증한 뒤 그 결과에 따라 작업을 진행할 수 있을 것이다. 

```javascript
function(req, res) {

   // 이메일 문자열 체크. 아래 정규표현식은 테스트용 임. 
   if (!/^account@email.com$/.test(req.body.email)) {
     return res.status(400).json({warn: 'check the email pattern'});
   }

   // 다음 작업: 데이터베이스 저장 
   // ...
}
```

만약 Sequelize로 모델링 할때 validate 키를 사용하면 좀 더 간단한 코드를 만들 수 있다.

```javascript
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
      DataTypes.STRING
      validate: {
        isEmail: true // 이메일 주소 형식을 검증한다 
      }
    }
};
```

email 컬럼의 validate 키를 추가하고 `{isEmail: true}` 객체를 추가했다. 이 모델을 이용해 데이터를 입력하면 Sequelize에서 입력값에 대한 이메일 주소 패턴을 검증한다. 만약 검증에 통과하지 못하면 Sequelize는 데이터입력을 하지않고 에러를 반환하도록 되어있다.

```javascript
function(req, res) {

   // 정의한 User 모델로 데이터를 추가한다 
   models.User.create({
     email: req.body.email
   }).then(function (result) {

     // 입력에 성공함 
     res.status(201).json(result);
   }).catch(function (err) {

     // 이메일 검증 실패인 경우 
     if (err.name === 'SequelizeValidationError') {
       return res.status(400).json({warn: 'check the email pattern'});
     }

     // 그 외의 서버측 에러 경우 
     res.status(500).json({error: err});
    });
}
```


## Unique

컬럼에 유니크 속성을 추가할 경우 `unique`키를 추가한다.

```javascript
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    birth: {
      type: DataTypes.DATEONLY,
      unique: true // birth 컬럼값이 유일해야 한다 
    }
  }
};
```

만약 두 컬럼을 조합하여 유일성을 보장해야 한다면 어떻게 할까? 불리언 값이 아니라 문자열을 설정하면 된다. 예를들어 생일(birth)과 이름(name)을 조합한 값이 유일해야 된다면 우리는 이렇게 코딩할 수 있다.

```javascript
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    birth: {
      type: DataTypes.DATEONLY,
      unique: 'userBirthAndNameUnique' // 문자열로 유니크를 지정한다.
    },
    name: {
      type: DataTypes.STRING,
      unique: 'userBirthAndNameUnique' // 문자열로 유니크를 지정한다.
    }
  }
};
```

실제 테이블 정의에는 이러한 정보를 확인할 수 없고, User 모델로 데이터를 입력하면 Sequelize 단에서 유니크 검증을 처리한다. 중복값을 입력할 경우 validate와 마찬가지로 에러를 반환한다.
