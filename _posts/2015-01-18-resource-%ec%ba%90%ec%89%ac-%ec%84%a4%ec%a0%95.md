---
id: 127
title: $resource 캐쉬 설정
date: 2015-01-18T21:39:09+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=127
permalink: /resource-%ec%ba%90%ec%89%ac-%ec%84%a4%ec%a0%95/
categories:
  - Angular.js
tags:
  - $cacheFactory
  - $resource
  - angularjs
  - cache
---
<a href="https://docs.angularjs.org/api/ngResource/service/$resource">$resoure</a>는 앵귤러에서 백엔드 자원을 추상화한 서비스다. 레스트(REST) 방식의 백엔드 프로토콜이 지원된다면 $resoure의 장점을 충분히 활용할 수 있다. url로 $resoure 서비스를 생성하고 사용할때는 get(), query(), post() 등 메소드 이름으로 함수를 호출하면 된다. 또한 프라미스(promise)를 반환하기 때문에 비동기 방식의 코딩도 깔끔하게 유지할 수 있다.

이번엔 캐쉬 사용법을 알아보자. 앵귤러에서 캐쉬는 <a href="https://docs.angularjs.org/api/ng/service/$cacheFactory">$cacheFactory</a> 서비스가 담당한다. <code>var cache = $cacheFactory('myCache')</code> 로 캐쉬 저장소를 생성한다. <code>cache.put("key1", "value1")</code> 으로 캐쉬에 키/밸류 방식으로 데이터를 저장하고 <code>cache.get("key1")</code>을 저장한 value1을 찾을 수 있다.

$resouce 서비스도 내부적으로는 $cacheFacotry 서비스를 사용한다. 기본적으로 $resouce는 캐쉬를 사용하지 않지만 <code>cache: true</code> 옵션으로 추가하여 사용하면 $cacheFactory 서비스를 사용하여 백엔드 데이터를 캐쉬에 저장한다. $resource 서비스는 백엔드 호출후 <code>$cacheFactory("$http")</code>을 사용해 캐슁한다. 아래 코드를 보자.

<pre class="lang:js decode:true">var r = $resouece("/api/books", {}, {
  get: {
    cache: true
  }
});


var books = r.get();

// books는 booksCahce에 데이터를 캐쉬한다.
var booksCache = $cacheFactory.get("$http").get("/api/books");
</pre>

$resource 서비스로 백엔드 호출한 데이터는 <code>cache: true</code> 옵션에 의해 캐쉬 데이터로 저장된다. <code>$http</code>이름으로 생성된 캐쉬팩토리 인스턴스는 "/api/books"라는 키와 백엔드 리턴값을 밸류로하는 키/밸류 데이터를 이 인스턴스에 저장한다.

캐쉬를 리프레시 할수도 있다. 어떤 상황일까? 만약 /api/books (update) 프로토콜로 백엔드 자원을 수정했다면 캐쉬에도 반영해야한다. <code>$cacheFactory("$http").remove("/api/books")</code> 로 캐쉬 데이터를 삭제한다. 그러면 $resource가 다음 호출시 캐쉬 데이터가 비어있는 것을 확인하고 백엔드 통신을 시도하고 그 결과를 다시 캐쉬에 저장한다. 참고로 <code>removeAll()</code>은 $cacheFactory("$http") 의 모든 캐쉬를 비운다.

&nbsp;