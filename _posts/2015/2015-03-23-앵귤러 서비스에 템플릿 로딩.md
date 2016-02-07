---
id: 300
title: 앵귤러 서비스에 템플릿 로딩
date: 2015-03-23T20:28:13+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=300
permalink: /%ec%95%b5%ea%b7%a4%eb%9f%ac-%ec%84%9c%eb%b9%84%ec%8a%a4%ec%97%90-%ed%85%9c%ed%94%8c%eb%a6%bf-%eb%a1%9c%eb%94%a9/
categories:
  - Angular.js
tags:
  - $templateCache
  - angularjs
  - modal
  - service
---
## 상황

상황은 이렇다. 버튼 클릭 이벤트 핸들러에 서비스 함수를 연결하고 서비스 함수에서는 모달창을 띄워야하는 상황이다. 핸들러 함수를 서비스로 만든것은 모듈화를 위함이고 모달창을 앵귤러 서비스 안에서 처리하는 것도 같은 이유다.

## 해결

버튼에 search() 함수를 연결한다.
<pre class="lang:js decode:true" title="template.html">&lt;button type="button" ng-click="search()"&gt;검색&lt;/button&gt;</pre>
연결된 컨트롤러의 search() 함수에서는 우리가 만들 MyService 서비스의 search() 함수를 호출한다. 이 서비스는 모달 창을 띄우고 사용자로부터 검색어를 입력받는다. 모달을 닫으면 검색결과 문자열을 data 변수로 반환한다.
<pre class="lang:js decode:true " title="controller.js">angular.module('myApp')
  .controller('myController', function ($scope, MyService) {

    $scope.search = function() {
      MyService.search().then(function (data) {
        $log.debug('Search result: ', data);
      });
    };

}</pre>
MyService 코드를 살펴보자. tpl 변수에 모달 템플릿 코드를 저장한다. 앵귤러에서는 $templateCache 서비스를 제공하는데 이 서비스의 put() 함수를 통해 템플릿을 등록하고 get() 함수로 템플릿을 불러올 수 있다. tpl에 저장된 템플릿 문자열을 템플릿 캐쉬에 등록한다. 모달창을 띄우기 위해 <a href="http://angular-ui.github.io/bootstrap/#/modal">ui-bootstrap</a> 라이브러리를 사용했다. 모달 생성을 위한 파라메터 중 templateUrl에 방금 등록한 템플릿 url를 설정한다. 모달 후속 처리를 한뒤 마지막에 promise 객체를 반환한다.
<pre class="lang:js decode:true  crayon-selected" title="my-service.js">'use strict';

angular.module('myApp')
  .factory('ssLocations', function ($q, $modal, $log, $templateCache) {

    var tpl = '&lt;div class="info-modal"&gt;' +
                '&lt;div class="modal-header"&gt;' +
                  /* ... */
              '&lt;/div&gt;';
    $templateCache.put('modal.tpl.html', tpl);

    function search () {
      var deferred = $q.defer();

      var modalInstance = $modal.open({
        templateUrl: 'modal.tpl.html',
        controller: 'MyServiceModalCtrl',
        size: 'md'
      });

      modalInstance.result.then(function (result) {
        deferred.resolve(result);
      }, function () {
        $log.debug('Modal dismissed');
        deferred.reject();
      });

      return deferred.promise;
    }

    // Public API here
    return {
      search: search
    };
  });
</pre>
마지막으로 모달 컨트롤러 함수를 살펴보자. $templateCache.put() 으로 등록한 모달 템플릿과 연결된 MyServiceModalCtrl 컨트롤러 함수다. ok() 스코프 함수로 검색 결과를 반환한다.
<pre class="lang:js decode:true" title="modal.controller.js">angular.module('myApp')
  .controller('MyServiceModalCtrl', function ($scope, $modalInstance) {

    $scope.ok = function () {
      $modalInstance.close(/* 검색결과 반환 */);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
</pre>
## 결론

정리해보자. 서비스 안에서 모달창을 위한 템플릿을 등록하고($tempateCache) 모달을 위한 컨트롤러를 연결하여 모달창을 띄운다. 그리고 모달창에서 작업한 결과를 반환하는데 promies를 이용할수 있다. 이런식으로 어디서든 클릭 이벤트에 MyService.search() 함수를 연결하여 모달 창 띄우는 작업을 모듈화 할 수 있다.