---
id: 139
title: $resource와 service
date: 2015-01-22T01:13:07+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=139
permalink: /resource%ec%99%80-service/
categories:
  - Angular.js
tags:
  - $resource
  - angularjs
  - javascript
---
$resource는 $http에 리소스 주소를 설정하여 추상화해 놓은 앵귤러 서비스다. 이것을 한번더 앵귤러 Service()로 감싸면 백엔드 자원에 대해 한단계 더 추상화 할 수 있다. 결과만 놓고 보면  User 서비스로 간단하게 백엔드 자원을 다룰 수있다.

<pre class="lang:js decode:true">$scope.user = User.get({ userId: 123 }); // 유저 데이터를 얻는다.
$scope.user.name = "Edited Username"; // 유저 데이터를 수정한다.
$scope.user.$save(); // 수정한 유저 데이터를 저장한다.</pre>

위와 같은 User 서비스를 구현해 보자. service()함수로 User 서비스를 만드는데 $resource를 통해 백엔드 리소스 주소와 파라메터(userId)를 설정한 뒤 $resource 객체를 반환한다.  이제 어디에서건 User 서비스를 주입하여 백엔드 자원에 접근할 수 있다.

<pre class="lang:js decode:true">angular.module('myApp')
  .service('User', function ($resource) {

    // 리소스 객체를 반환한다.
    return $resource(
      '/user/:userId
      {
        userId: '@userId'
      }
    );

  });</pre>

$resource 객체를 서비스로 감싸면 $resource 객체 생성시 추가 설정을 User 서비스에서 설정할 수 있는 장점이 있다. 만약 그렇지 않고 $resource 객체 생성시마다 설정한다면 코드 중복이 상당할 수 있기 때문이다. 아래 코드를 보자. $resourece 객체는 메소드 별로 요청 데이터나 응답데이터를 수정할 수 있고 캐쉬를 설정하거나 해제할 수 있다. 이런 복잡한 정보들을 User서비스에서 한번만 설정하고 다른 컨트롤러나 서비스에서 User 서비스만 호출하여 간단히 사용할 수 있다.

<pre class="lang:js decode:true ">angular.module('myApp')
  .service('User', function ($resource, $cacheFactory) {
    return $resource(
      '/user/:userId',
      {
        userId: '@userId'
      },
      {
        get: {
          isArray: false,
          cache: true, // 캐쉬 설정 

          // get 메소드 응답 데이터를 수정할 한다.
          transformResponse: function(data) {

            data = angular.fromJson(data); // 문자열 데이터를 객체화 한다.
            
            // 프론트앤드에서 사용하기 적합한 형태로 data 객체를 수정한다. 

            return data; // 수정한 data 객체를 반환한다.
          }
        },
        update: {
          method: 'PUT',
          isArray: false,
          transformResponse: function(data) {
            $cacheFactory.get('$http').removeAll(); // 캐쉬데이터를 삭제한다.

            data = angular.fromJson(data);

            // 프론트앤드에서 사용하기 적합한 형태로 data 객체를 수정한다. 

            return data;
          }
        }
      });
  });</pre>

&nbsp;