---
id: 562
title: sequalize 쿼리
date: 2015-08-22T15:22:13+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=562
permalink: /sequalize-%ec%bf%bc%eb%a6%ac/
AGLBIsDisabled:
  - 0
categories:
  - Sequelize
tags:
  - sequelize
---
ORM을 써보기 시작했다. <a href="http://sequelize.readthedocs.org/en/latest/">Sequeilize</a>.

편리한 점이 한 두가지가 아니다.  (1) 무엇보다 쿼리를 주저리 주저리 입력하지 않아도 알아서 보내준다는 점이 편리하다. (2) 특히, 자바스크립트 코드로 테이블을 디자인하면 자동으로 쿼리가 실행되어 테이블을 만든다. 물론 외래키(foreign key)도 자동으로 만들어 준다. (3) 테이블 컬럼별로 검증자(validator)를 설정하여 CRUD 작업시 맞지 않는 컬럼 값을 입력하면 에러메세지를 보내주는데, 프로토콜 개발시에 이 에러 메세지가 꽤 유용하다.

SQL 쿼리문 작성이 손에 익어서 일까? Sequalize 문법이 종종 햇갈린다. 이 글에서는 Sequelize에서 자주 사용하는 쿼리 사용법을 정리해 본다.

# like
<pre class="lang:default decode:true">models.Foo.findAll({
  where: {name: {like: '%keyword%'}}
});

models.Foo.findAll({
  where: ['name like ?', '%keyword%']
});
</pre>
라이크 조건절은 위와 같이 두 가지 방법으로 사용한다. 둘다 동일하게 동작한다.

# lt, gt, lte, gte, between
<pre class="lang:default decode:true">models.Foo.findAll({
  where: {createdAt: {lt: new Date()}}
});

models.Foo.findAll({
  where: {createdAt: {gt: Date.parse('2014-01-01')}}
});

models.Foo.findAll({
  where: {createdAt: {between: [new Date(), Date.parse('2012-01-01')]}}
});</pre>
값의 대소를 비교하는 경우 lt, gt, lte, gte를 사용한다. `Date.parse()` 같은 날짜 함수를 사용할 수도 있다. 만약 구간을 검색할 경우 `between` 을 사용한다.

# join
<pre class="lang:default decode:true ">models.Foo.find({
  include: [models.boo]
});

models.Foo.find({
  include: [{
    model: models.boo
    where: {}
  }]
});</pre>
조인할 대상을 `include`에 배열로 넘겨준다. 배열이기 때문에 여러 테이블을 조인하는 것이 가능하다. 조인 조건은 테이블 스키마 작성시 설정한 Association 관계에 따라 알아서 선택된다. 외래키 이외에 조인 조건을 추가해야 한다면 `{model: , wehre: }` 객체에 조인 조건을 설정하여 배열에 추가한다.

# orderby, limit
<pre class="lang:default decode:true ">models.Foo.findAll({
  offset: 0,
  limit: 100,
  order: 'createdAt desc'
});</pre>
페이징 기능을 구현할 때 많이 사용하는 쿼리다.

# groupby, count()
<pre class="lang:default decode:true">models.User.findAll({
  attributes: ['GroupId', [models.sequelize.fn('count', '*'), 'count']],
  group: 'GroupId'
});</pre>
특정 키로 그룹핑하고 결과를 카운팅하여 `count`로 이름 붙인다.

# attributes, alias, left()
<pre class="lang:default decode:true">models.Foo.findAll({
  attributes: [
    'id',
    ['name', 'userName'],
    [models.sequelize.fn('left', models.sequelize.col('createdAt'), 10), 'date']
  ],
  where: {}
});</pre>
특정 필드만 얻고자 할 경우 `attributes`에 배열로 필드명을 넘겨준다. 배열안에 ['필드명', 'alise 명'] 배열로 alise를 설정할 수도 있다. 필드명에 함수를 적용할 때는 `models.sequelize.fn()`을 사용한다. 배열의 세번째 코드는 createdAt 필드 값의 좌측 10자리 문자열을 반환하여 `date`로 이름 붙인 예제이다.

# Raw Query
<pre class="lang:default decode:true ">var query = 'select * form Foo where name = :name';
var values = {
  name: 'chris'
};

models.sequelize.query(query, {replacements: values})
  .spread(function (results, metadata) {
      // 쿼리 실행 성공

    }, function (err) {
      // 쿼리 실행 에러 

    });</pre>
직접 쿼리를 돌려야 할때는 `models.sequelize.query()` 함수를 사용한다. 쿼리문에 `:name`으로 설정한뒤 replacements에 해당 name 키가 있는 객체를 넘겨주면 쿼리의 `:name`을 replacements에 있는 값으로 치환하여 쿼리를 실행한다.

# findOrCreate()
<pre class="lang:default decode:true ">models.User.findOrCreate({
    where: {id: req.user.id}
  }).spread(function (user, created) {
    if (created) {
      // create 실행됨 
    }

    // user 객체
  });</pre>
테이블의 특정 로우를 찾는 것이고 만약 없을 경우 INSERT 구문을 실행하여 로우를 생성한다. 몽고디비의 upsert() 와 비슷하다.

&nbsp;

&nbsp;