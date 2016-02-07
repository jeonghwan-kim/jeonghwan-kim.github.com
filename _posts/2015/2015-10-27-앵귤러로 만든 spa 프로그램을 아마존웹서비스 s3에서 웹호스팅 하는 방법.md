---
id: 819
title: 앵귤러로 만든 spa 프로그램을 아마존웹서비스 s3에서 웹호스팅 하는 방법
date: 2015-10-27T10:08:59+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=819
permalink: /%ec%95%b5%ea%b7%a4%eb%9f%ac%eb%a1%9c-%eb%a7%8c%eb%93%a0-spa-%ed%94%84%eb%a1%9c%ea%b7%b8%eb%9e%a8%ec%9d%84-%ec%95%84%eb%a7%88%ec%a1%b4%ec%9b%b9%ec%84%9c%eb%b9%84%ec%8a%a4-s3%ec%97%90%ec%84%9c-%ec%9b%b9/
categories:
  - AmazonWebService
tags:
  - angular
  - s3
  - spa
---
## 앵귤러 코드

SPA를 위한 앵귤러 코드를 살펴보자.

```javascript
angular
  .module('myApp', [
    'ngRoute',
    // ...
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .otherwise({
        redirectTo: 'views/404.html'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });
```

`angular.config()` 함수에서 `$locationProvider.html5Mode()`를 호출한다. 이렇게 설정하면 `/`, `/about`로 라우팅 할수 있다. 없는 페이지는 404.html 파일을 렌더링 하도록한다.

## S3 호스팅 설정

AWS S3 콘솔에서 버킷 생성. 생성한 버킷에 소스를 업로드 한다. 생성한 버킷을 선택하고 Permissions 메뉴로 이동하여 getObject 권한을 추가한다. 그리고 Static Website Hosting 메뉴로 이동. Enable website hosting을 클릭하고 index Document에 index.html을 설정한다.

여기까지가 기본적인 s3 웹호스팅 설정 방법이다. 아래 링크에서 확인해 보자.

[http://angular-spa-in-aws-s3.s3-website-ap-northeast-1.amazonaws.com/](http://angular-spa-in-aws-s3.s3-website-ap-northeast-1.amazonaws.com/)


## S3에 업로드한 SPA 코드의 문제

다시 SPA에 대해 생각해 보자. SPA는 기본적으로 서버 사이드 기능이 필요하다. 브라우저에서 서버에 페이지를 요청하면 서버는 하나의 페이지만 서버로 내려준다. 브라우져는 서버로부터 받은 페이지를 가지고 라우팅을 수행한다. 그래서 브라우져에서 초기에 받은 페이지에서 클릭하여 다른 페이지로 이동하는 것은 전혀 문제가 되지 않는다. 그러나 세부 페이지를 바로 서버에 요청하는 경우는 문제가 될 수 있다.

아래는 angular와 expressjs을 결합한 angular-fullstack의 SPA 구현 부분이다. 서버 사이드를 확인하자. 라우팅 코드다.

```javascript
module.exports = function(app) {

  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
```

`/api/*` 패턴의 라우팅은 ajax 호출을 위한 프로토콜이다. 그 다음 `/auth`는 인증을 위한 프로토콜. 그 다음은 404 페이지를 서버에서 별도로 내려주는 부분. 마지막 코드가 중요하다. 위에서 정의한 모든 라우팅을 제외한 요청은 `index.html` 파일을 내려 주도록 하고 있다. 브라우져가 수신할 index.html 코드는 본 문서 상단의 코드와 유사하다. app.js 자바스크립트 코드를 로딩하여 자체적으로 라우팅을 구현했다.

참고: [https://github.com/DaftMonk/fullstack-demo/blob/master/client/app/app.js](https://github.com/DaftMonk/fullstack-demo/blob/master/client/app/app.js)

이러한 서버측 로직때문에 서버에서는 세부 페이지 라우팅 요청에도 index.html 파일을 내려줄 수 있다. 그러나 S3에 구현된 서버는 그렇지 않다. 이러한 로직를 구현할 수 없다. 그래서 세부 페이지를 바로 요청하면 없는 페이지라고 404 에러코드로 응답한다.

## 리다이렉션 설정

그렇기 때문에 백엔드 서버로 활용할 S3에서도 이러한 기능을 설정해야 한다. Static Website Hosting 메뉴에서 Enable website hosting을 설정하면 마지막에 Edit Redirection RoutingRules 메뉴가 있다. 이 부분의 텍스트필드에 아래 코드를 붙여 넣는다.

```xml
<RoutingRules>
  <RoutingRule>
    <Condition>
      <HttpErrorCodeReturnedEquals>404</HttpErrorCodeReturnedEquals>
    </Condition>
    <Redirect>
      <HostName>angular-spa-in-aws-s3.s3-website-ap-northeast-1.amazonaws.com</HostName>
      <ReplaceKeyPrefixWith>#/</ReplaceKeyPrefixWith>
    </Redirect>
  </RoutingRule>
</RoutingRules>
```

`<Condition>` 과 `<Redirect>` 부분으로 생각할 수 있다. 404 에러 코드를 수신할 경우 리다이렉트를 설정한다고 보면된다. `<Hostname>`에 설정된 도메인으로 리다이렉트 하도록 하는데,  `<ReplaceKeyPrefixWidh>`에 설정한 해쉬태그(`#/`)를 추가하여 리다이렉트한다.

[가이드라인 문서](https://docs.aws.amazon.com/AmazonS3/latest/dev/HowDoIWebsiteConfiguration.html)

이제 `도메인명/about` 주소로 접속한다고 생각해보자. S3 서버쪽에서는 해당 버킷이 없기 때문에 404 에러를 반환한다. 그럼 리다이렉션 규칙에 따라 `도메인명/#/about`으로 이동하게 된다. 서버에서는 해쉬태그를 인지하고 `도메인명`에 해당하는 버킷을 보내준다. 브라우져에서는 해쉬태그 이후의 경로를 해석하여 about 페이지를 보여주는 것이다.

아래 주소로 직접 확인해 보자.

* [http://angular-spa-in-aws-s3.s3-website-ap-northeast-1.amazonaws.com](http://angular-spa-in-aws-s3.s3-website-ap-northeast-1.amazonaws.com)
* [http://angular-spa-in-aws-s3.s3-website-ap-northeast-1.amazonaws.com/about](http://angular-spa-in-aws-s3.s3-website-ap-northeast-1.amazonaws.com/about)
* [http://angular-spa-in-aws-s3.s3-website-ap-northeast-1.amazonaws.com/foo](http://angular-spa-in-aws-s3.s3-website-ap-northeast-1.amazonaws.com/foo)

소스코드: [https://github.com/jeonghwan-kim/angular-spa-in-aws-s3](https://github.com/jeonghwan-kim/angular-spa-in-aws-s3)
