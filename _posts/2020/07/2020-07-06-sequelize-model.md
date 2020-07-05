---
title: "시퀄라이즈 Model 클래스 활용하기"
layout: post
category: dev
tags: [sequelize]
---

[시퀄라이즈로 모델링](/sequelize-model/)하는 방법을 한 번 정리한 적이 있는데 sequelize.define() 함수를 사용했었다.
시퀄라이즈 4 버전을 사용했는데 노드js에 클래스 문법이 들어오기 전이었다.

이번에 데이터베이스 사용할 기회가 있어서 오랜만에 시퀄라이스 문서를 보는데 Model 클래스를 따로 제공하고 있더라.

리액트도 일반적으로는 Component 클래스를 확장해 리액트 컴포넌트를 만든다.
그렇지 않은 환경은 create-react-class 모듈을 별도로 제공한다.

마찬가지로 클래스 문법이 없는 노드 5 이하에서는 define() 함수로 모델링 하지만, 이제는 **Model 클래스를 확장해서 사용**하는 것 같다.

그럼 간단히 모델 클래스를 정리하고 어떻게 사용하면 좋을지 궁리해 보자.

# 모델 정의

Model 클래스를 확장하면 init()이라는 정적 메소드 사용할 수 있다. 
테이블를 타나내는 모델을 초기화 할 때 사용하는데 공식 문서에 나온 샘플 코드를 보면 이렇다.

```js
class User extends Model {}

User.init({
  // 컬럼 속성
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  }
}, {
  // 기타 옵션
  sequelize, // 데이터베이스 컨넥션
  modelName: 'User' // 모델(테이블) 이름
});

// 클래스 자체가 정의한 모델이다 
console.log(User === sequelize.models.User); // true
```

스키마 생성을 위해 init() 메소드를 호출하는 코드다.
두 개 인자를 사용하는데

- 인자 1: 테이블의 컬럼 이름과 속성 값을 전달한다.
- 인자 2: 테이블 생성에 필요한 기타 값을 전달한다.

그런데 모델을 클래스로 정의한 뒤, 클래스 외부에서 스키마를 생성하려고 메소드를 호출하는 코드가 불편해 보였다.
이 코드를 클래스 안으로 넣으면 좀 더 관리하기 쉬운 코드가 될 것 같다. 

찾아보니 이러식으로 래핑해서 사용하는 방법이 있었다([참고](https://codewithhugo.com/using-es6-classes-for-sequelize-4-models/)).

```js
class User extends Model {
  // 초기화하는 정적 메소드
  static initialize(sequelize, DataTypes) {
    // 클래스 외부에서 호출했던 init() 메소드를 클래스 안으로 옮겼다 
    super.init({
      firstName: { /* ... */ },
      lastName: { /* ... */ }
    }, { /* ... */ })
  }
}
```

클래스에 테이블 스키마를 정의하는 initialize()라는 정적 메소드를 만들었다.
그리고 외부에서 호출한 init() 메소드를 이 안으로 옮겨 클래스 안으로 관련된 코드를 모았다.

# 모델 간의 관계 정의

Model 클래스로 확장한 모델은 belongsTo() 따위의 메소드로 모델 간의 관계를 정의할 수 있다. 

```js
User.belongsTo(Group);
```

이러한 코드도 클래스 정의부 안으로 넣어 버리면 좋겠다. 

```js
class User extends Model {
  // 모델간의 관계를 정의하는 메소드 
  static associate(models) {
    // 클래스 외부에서 호출했던 belongsTo() 메소드를 클래스 안으로 옮겼다 
    this.belogsTo(models.Group)
  }
}
```

모델 간의 관계를 설정하는 associate()라는 정적 메소드를 만들었다.
그리고 외부에서 호출한 belongsTo() 메도드를 이 안으로 옮겨 클래스 안으로 관련된 코드를 모았다.

# 스키마 동기마 

샘플 코드에서는 init()과 belongsTo()를 직접 호출했지만 이를 클래스 정의부로 옮겼기 때문에 아직은 데이터베이스와 동기화 되지는 않았다.
이 두 메소드를 호출하는 코드가 필요한 시점이다.

보통 시퀄라이즈를 사용할 때 모든 모델을 한 번에 동기화하는 작업을 하는데, 이 때 initialize()와 associate() 메소드를 호출하면 되겠다. 

```js
// 시퀄라이즈 인스턴스를 만든다
const sequelize = new Sequelize("sqlite::memory:");

fs
  // models 폴더의 모든 파일을 읽는다 
  .readdirSync(__dirname)
  // 모델 정의 파일만 필터링한다
  .filter(file => 
    (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js')
  )
  // 모델 초기화 함수를 호출한다 
  .forEach(file => {
    const Model = require(path.join(__dirname, file));
    Model['initialize'](sequelize);
  })

```

models 안에 있는 모델 정의 파일을 읽어서 initialize 메소드를 호출한다.
이 안에는 스키마를 설정하는 Model.init() 메소드를 호출하기 때문에 모델링 할 수 있다.

```js
// sequelize 객체에 등록된 모델 목록을 가져온다 
Object.values(sequelize.models)
  // associate 함수가 있는 모델만 필터링한다.
  .filter(model => typeof model.associate === 'function')
  // associate() 함수를 실행하여 테이블간 관계를 설정한다
  .filter(model => model.associate(sequelize.models))
```

모델을 생성하고 나면 시퀄라이즈 객체의 models에 생성한 모델이 등록된다. 
`{[key: string]: Model}` 형식인데 모델만 배열로 가져온다.
외래키가 있는 모델은 associate() 메소드가 있을 것이기 때문에 이러한 모델들만 필터링 한다.
그리고 이미 로드한 모델을 인자로 associate() 메소드를 호출하면 외래키를 설정할 수 있다. 

# 정적 메소드 

Model은 간편한 쿼리를 위한 여러 정적 메소드를 제공한다([참고](https://sequelize.org/master/class/lib/model.js~Model.html)). 
이걸 잘 사용하면 적은 코드로 데이터베이스에 접근할 수 있다. 

그럼에도 불구하고 쿼리를 커스터마이징 해야 한다면 원하는 이름의 정적 메소드를 추가해 사용할 수 있다.

```js
class User extends Model {
  // 그룹 기준으로 조회한다 
  static findByGroup(GroupId) {
    return this.findAll({where: {GroupId}})
  }
}
```

# 인스턴스 메소드 
 
데이터베이스에서 정적 메소드로 데이터베이스에 접근하면 데이터를 모델 인스턴스로 만들어 반환한다.
테이블을 모델링 할 때 init() 메소드로 컬럼을 정의했는데 바로 인스턴스 멤버 변수로 접근할 수 있다.

```js
const user = new User({name: 'user1'})
console.log(user.name) // 'user1'
```

계산된 값을 얻으려면 인스턴스 메소드 형태로 추가할 수 있다.

```js
class User extends Model {
  // 전체 이름을 계산한다 
  get fullname() {
    return this.firstname + ' ' + this.lastname
  }
}

const user = new User({firstname: 'user1', lastname: 'kim'})
console.log(user.fullname); // 'user1 kim'
```

# 결론 

define()을 사용하면 function 키워드로 클래스를 사용하듯 시퀄라이즈 모델을 다루었다.

반면 시퀄라이즈 5부터 나온 Model 클래스를 확장해서 모델링하는 것이 비교적 관리하기 쉬운 방법인 것 같다.
class 문법이 단일 블록 스코프 안에서 관련된 로직을 모아 놓을 수 있기 때문이다.

참고
- 소스 코드: https://github.com/jeonghwan-kim/post_sequelize-model