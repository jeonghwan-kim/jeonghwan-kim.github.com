---
id: 892
title: Javascript Decorator Pattern
date: 2015-12-13T08:20:53+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=892
permalink: /javascript-decorator-pattern/
categories:
  - Javascript
tags:
  - coffee
  - decorator
  - decorator_pattern
  - ghost
---
Ghost 소스를 보면서 데코레이터 패턴을 처음 보았다. 이전 포스트에 보면 http() 메쏘드 주석에 이것은 데코레이터 패턴이라고 되어있다.

> Decorator for API functions which are called via an HTTP request. Takes the API method and wraps it so that it gets data from the request and returns a sensible JSON response.

데코레이터 패턴의 정의부터 살펴보자. [위키](https://ko.wikipedia.org/wiki/%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0_%ED%8C%A8%ED%84%B4)에 나온 설명이다. 

> 상황에 따라 어떤 객체에 책임을 덧붙이는 패턴 

그래. 그래서 그게 어떻다는 건가? 코드를 보면서 좀 더 정확하게 이해해 보자.


## 클래스 상속

데코레이터에 앞서 자바스크립트로 클래스 사용하여 상속하는 패턴을 먼저 보자. 자바스크립트에서는 모든게 함수이듯이 클래스도 함수로 표현할 수 있다.

```javascript
function Espresso() {
  this.cost = 2500;
}
```

대부분의 커피는 에스프레소부터 시작하니깐, Espresso 클래스를 슈퍼 클래스로 만들자. 속성은 간단히 가격(cost)만 가지고 있다. 이제 이를 부모클래스로 갖는 서브 클래스를 만들어 아메리카노(Americano)와 카페라떼(CafeLatte)를 만들어 보자.

```javascript
function Americano() {
  Espresso.call(this);
  this.cost = (new Espresso()).cost + 500;
  this.water = 250;
}

function CafeLatte() {
  Americano.call(this);
  this.cost = (new Americano()).cost + 500;
  this.milk = 100;
}
```

아메리카노는 에스프레소에 생수 250ml를 넣고 500원 추가해서 판매한다. 카페라떼는 여기에 우유 100ml를 추가하여 500원 더 추가된 가격으로 판매한다. 각 인스턴스를 확인해 보면 알 수 있다.

```javascript
console.log(new Espresso());
// { cost: 2500 }
console.log(new Americano());
// { cost: 3000, water: 250 }
console.log(new CafeLatte());
//{ cost: 3500, water: 250, milk: 100 }
```

만약 카푸치노를 만든다고 하면 어떻게 해야할까? 에스프레소에 물과 우유를 넣고 거품을 추가로 넣은 클래스를 만들것이다. 더 많은 커피 레시피가 있으면 그만큼 클래스를 만들어서 찍어내는 방식이다. 

그러나 실제 커피 제조하는 방법을 생각해 보자. 아메리카노를 만들때는 에스프레소에 **물**을 첨가한다. 카페라떼를 만들때는 에스프레소에 **물**과 **우유**를 첨가한다. 만약 에스프레소에 **우유**만 넣어서 커피를 만들수는 없을까? 마셔본 적은 없지만 그렇게 커피를 마시기도 한다. ([Espresso with Milk](https://en.wikipedia.org/wiki/List_of_coffee_drinks#Espresso_with_milk)) 레시피가 늘어난만큼 클래스를 만들기 보다는, 첨가하는 재료를 추상화하여 이것을 에스프레소에 덧붙이는 방법으로 커피를 만든다면 좀더 쉽게 다양한 커피 제조가 가능할 것 같다. 다시 말하면 Espresso 클래스에 Water, Milk라는 재료의 조합으로 다양한 커피를 제조할 수 있다는 말이다. 


## 데코레이터 

이렇게 상황에 따라 어떠한 특성 혹은 행동을 덧붙이는 패턴을 데코레이터 패턴이라고 한다. Espresso 클래스에 데코레이터 패턴을 이용해서 커피를 만들어 보자.

```javascript
function Water (espresso) {
  espresso.cost = espresso.cost + 500;
  espresso.water = 250;
  return espresso;
}
```

에스프레소에 물을 추가하는 Water() 함수다. 에스프레소 인스턴스를 파라매터로 넘겨받아 가격을 500원 추가한다. 그리고 물을 250ml 붙는다. 마지막에는 에스프레소 객체를 넘겨주는데 이것은 함수 체이닝 때문이다. 우유를 첨가하는 Milk() 함수도 만들어 보자.

```javascript
function Milk (espresso) {
  espresso.cost = espresso.cost + 500;
  espresso.milk = 100;
  return espresso;
}
```

역시 에스프레소 인스턴스를 받아 500원 추가하고 우유 100ml를 넣는다. 역시 함수 체이닝을 위해 받은 인스턴스를 돌려준다. 재료는 모두 준비 되었다. 커피를 제조해 보자.

```javascript
var espresso = new Espresso();
// { cost: 2500 }
var americano = Water(new Espresso());
// { cost: 3000, water: 250 }
var cafeLatte = Milk(Water(new Espresso()));
// { cost: 3500, water: 250, milk: 100 }
```

위에서 클래스 상속으로 만들었던 에스프레소, 아메리카노, 카페라떼를 만들었다. 에스프레소에 우유를 탄 Antoccino도 만들수 있다.

```javascript
var antoccino = Milk(new Espresso());
// { cost: 3000, milk: 100 }
```

데코레이터 패턴을 이용하면 상당히 유연하게 인스턴스를 생성할 수 있는 장점이 있다.


## Ghost 코드에서 데코레이터 패턴

<a href="http://whatilearn.com/ghost-%eb%9d%bc%ec%9a%b0%ed%8c%85-%eb%a1%9c%ec%a7%81-%eb%b6%84%ec%84%9d/">이전 포스트</a>에서 잠깐 언급한 고스트(Ghost) 코드를 다시 살펴 보자. 라우트 핸들러 코드를 보면 http() 함수로 감싸고 있다. 이것이 데코레이터 패턴이라고 하는데 어떻게 그런가 확인해 보자. 코드의 주석을 참고하라.

```javascript
// 파라매터로 받은 apiMethod 함수를 받는다.
http = function http(apiMethod) {

    return function apiHandler(req, res, next) {
        // request 개체를 통해 넘어온 요청데이터를 정규화 한다. 
        // body, params, query, files 를 object와 options 객체에 모아 담는다.
        var object = req.body,
            options = _.extend({}, req.files, req.query, req.params, {
                context: {
                    user: (req.user && req.user.id) ? req.user.id : null
                }
            });
        if (_.isEmpty(object)) {
            object = options;
            options = {};
        }

        // 정규화된 요청데이터를 파라메터로 넘어온 apiMethod 함수에 넘겨준다.
        return apiMethod(object, options).tap(function onSuccess(response) {
            // 응답 헤더를 설정한다.
            return addHeaders(apiMethod, req, res, (response || {}));
        }).then(function then(response) {
            // 응답 바디를 설정한다.
            res.json(response || {});
        }).catch(function onAPIError(error) {
            // 에러 처리
            next(error);
        });
    };
};
```

http() 데코레이터는 (1) apiMethod라는 함수를 대상으로 (2) 어떤 행동을 추가한다. 요청 데이터를 정규화하여 파라메터로 넘겨주는데 이는 apiMethod 함수에서 요청데이터 사용할 때 편리하도록 하기 위함이다. 그리고 응답에 대한 해더처리를 하고 json() 함수로 바디를 구성하여 응답한다. 만약 에러가 발생한 경우는 다음 단계로 미룬다.

데코레이터 정의에 따라 커피 예제와 고스트 예제를 비교하면 좀더 명확할 것 같다.

* 정의: 상황에 따라 어떤 객체에 책임을 덧붙이는 패턴 
* 커피 예제: 상황에 따라 coffee 객체에 책임(가격, 우유, 물)을 덧붙이는 패턴
* 고스트 예제: 상황에 따라 apiMethod 함수에 책임(요청 데이터 정규화, 응답 헤더 및 바다 설정, 에러 넘김)을 덧붙이는 패턴


## 참고

* [http://addyosmani.com/blog/decorator-pattern/](http://addyosmani.com/blog/decorator-pattern/)
