---
id: 165
title: $http 테스트 코드 작성
date: 2015-02-10T10:00:11+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=165
permalink: /http-%ed%85%8c%ec%8a%a4%ed%8a%b8-%ec%bd%94%eb%93%9c-%ec%9e%91%ec%84%b1/
categories:
  - Angular.js
tags:
  - $httpBackend
  - angularjs
  - jasmin
  - Mock
  - test
---
앵귤러 $resource로 서비스를 만들고 이것을 활용하면 백엔드 자원을 간편히 사용할 수 있다. 이렇게 내부적으로 $http를 사용하는 앵귤러 서비스는 어떻게 테스트 코드를 작성해야할까? 간단히 설명하면 목(Mock) 백엔드 서버를 구현하여 테스트할 수 있다. <code>$httpBackend</code>는 Mock 서버를 구현할수 있는 서비스로 $httpBackend.whenGET()으로 url과 응답 코드를 연결한 뒤  $httpBackend.flush() 로 가짜 서버를 구동할 수 있다.

우리가 테스트할 코드는 $resource를 사용하여 백엔드에 /foo 자원을 호출하는 <code>MyService</code>라는 서비스다.

<pre class="top-margin:22 bottom-margin:22 toolbar-hide:false whitespace-after:1 lang:js decode:true">angular.module('myApp', [])
  .service('MyService', function ($resource)) {
    return $resource('/foo');
});</pre>

&nbsp;

<h3>1. Mock 서버 만들기</h3>

<a href="http://jasmine.github.io/2.0/introduction.html">Jasmin</a>으로 테스트 코드를 작성한다. beforeEach() 에서 $httpBacked 서비스를 주입하고 Mock 서버를 구축한다.

<pre class="theme:solarized-dark whitespace-before:1 whitespace-after:1 lang:js decode:true ">describe('MyService Test', function () {  
  
  // 테스트할 모듈 주입, angular.module() 과 다름 
  beforeEach(module('myApp'));

  // 테스트할 서비스 초기화 및 Mock 서버 구현을 위한 $httpBackend 서비스 주입
  var MyService, $httpBackend;
  beforeEach(inject(function (_MyService_, _$httpBackend_) {
    MyService = _MyService_;
    $httpBackend = _$httpBackend_;

    // '/foo'백엔드 프로토콜에 대한 mock 응답객체 설정
    $httpBackend.whenGET('/foo')
        .respond({foo: 'boo');
  }));
  
});</pre>

module()함수로 테스트에서 사용할 모듈을 주입한다. 이것은 모듈을 정의하는 함수인 angular.module()과 별개이다. 모듈을 주입했으면 테스트에서 사용할 서비스를 주입할 차례다. Jasmin 프레임웍은 inject() 함수로 서비스 의존성을 처리한다. inject() 함수에 앞뒤로 언더바를 붙여 파라메터를 넘기면 이 함수는 파라메터의 언더바를 제거한다. 따라서 위코드와 같이 작성하면 테스트 코드에서는 정상적인 변수명으로 앵귤러 서비스를 사용할 수 있다.

이렇게 획들한 $httpBackend 서비스의 <code>whenGET().respond()</code> 함수를 통해 Mock 응답을 구현한다. /foo (get) 프로토콜에 대해 {foo: 'boo'}라고 응답하는 서버를 구현했다.

&nbsp;

<h3>2. 백엔드 API 호출</h3>

이렇게 만든 Mock 서버와 통신하는 테스트 코드를 작성해 보자.

<pre class="lang:js decode:true">describe('MyService Test', function () {

  // 테스트 유닛
  it('my test', function () {
    
    // 서비스 호출 
    var myService = MyService.get();
      
    // Mock 서버 구동
    $httpBackend.flush();

    // 응답 데이터 검증
    expect(myService.foo).toBe('boo');
  });

});</pre>

beforeEach() 에서 주입한 MyService로 백엔드 서버를 호출하고 바로 <code>$httpBackend.flush()</code> 함수를 통해 Mock 서버를 구동한다. 실제 서버를 구현하지 않다도 원하는 시점에 서버 응답을 줄수 있어 테스트에 용이하다.

<h3>3. 백엔드 후속처리</h3>

expectGET() 으로 설정한 요청이 모두 이뤄졌는지 검증하고, 테스트 코드에서 기대하지 않는 백엔드 호출이 있었는지를 검증한다.

<pre class="lang:js decode:true">describe('MyService Test', function () {

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});</pre>

&nbsp;

<h3>4. 응답 데이터를 파일로 분리하기</h3>

서버의 응답 데이터가 많을 경우 별도의 파일로 분리하는 것이 좋다. angular.value() 함수를 이용하여 앵귤러 변수를 만들고 이것을 테스트 코드에 주입하면 쉽게 파일로 분리할 수 있다. 아래와 같이 mock.js 파일을 작성하자.

<pre class="lang:js decode:true ">angular.module('testModule', [])
  .value('mock', {
    foo : { /* 많은 데이터 */}
  });</pre>

이제 테스트 코드에 testModule을 함께 주입하고 mock 변수를 통해 foo값을 가지고 올수 있다.

<pre class="lang:js decode:true ">describe('MyService test', function () {

  beforeEach(module('myApp', 'testModule'));

  var MyService, $httpBackend, mock;
  beforeEach(inject(function (_MyService_, _$httpBackend_, _mock_) {
    MyService = _MyService_;
    $httpBackend = _$httpBackend_;
    mock = _mock_;
  }));

  it('my test', function () {
    $httpBackend.whenGET('/foo').respond(mock.foo);

  /* ... */
  });

});
</pre>

&nbsp;

&nbsp;