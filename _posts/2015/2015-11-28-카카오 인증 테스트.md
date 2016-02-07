---
id: 882
title: 카카오 인증 테스트
date: 2015-11-28T18:53:58+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=882
permalink: /%ec%b9%b4%ec%b9%b4%ec%98%a4-%ec%9d%b8%ec%a6%9d-%ed%85%8c%ec%8a%a4%ed%8a%b8/
categories:
  - 미분류
tags:
  - kakao api
  - oauth
---
카카오 API를 이용해서 인증하는 과정을 정리해보자. 카카오 로그인 페이지를 띄워서 사용자로부터 로그인 및 각 리소스의 접근 권한 동의를 얻은 다음 액세스 토큰을 얻는다. 이후에 사용하는 API는 획득한 액세스 토큰을 가지고 요청할 수 있다.

## 인증 페이지

요청 주소:

```
https://kauth.kakao.com/oauth/authorize?client_id=&redirect_uri=&response_type=code
```

요청 쿼리:

```json
{
  "client_id": "앱 고유의 API 키",
  "redirect_uri`: "요청 후 콜백주소", //이 주소의 파라메터로 code 값이 반환된다. 테스트에서는 내부 서버를 돌려 http://localhost:9000로 설정할 수 있다. 
}
```

각 각의 파라메터를 설정하여 URI를 호출하면 카카오 로그인 페이지가 로딩된다. "Accept" 버튼을 클릭하면 redirect_uri에 설정된 주소로 code 파라메터와 함께 리다이렉트 될 것이다.

응답형식:

```
{redirect_url}?code={할당된 코드값}
```

## 엑세스 토큰 요청

보통 다른 서비스는 사용자가 수락후 바로 액세스 코드가 반환된다. 그러나 카카오 인증은 code 값을 먼저 받고 이를 통해 엑세스 토큰을 요청해야 한다.

요청 주소:

```
POST https://kauth.kakao.com/oauth/token
```

요청 바디:

```json
{
  "code": "반환받은 code값",
  "grant_type": "authorization_code",
  "client_id": "설정한 앱의 클라이언트 아이디",
  "redirect_uri": "리다이렉트 주소" // 실제 이 쪽으로 콜백되지는 않는다. 바로 응답 바디를 확인할 수 있다.
}
```

응답 형식:

```json
{
    "access_token": "string", //액세스 코드 
    "token_type": "bearer", // 토큰 타입. bearer로 고정 
    "refresh_token": "string", // 리프레시 토큰
    "expires_in": "string", // 만료일
    "scope": "story_publish story_read profile" // 권한 범위 
}
```

## 유저 프로필 요청 

이후에서는 이 액세스토큰으로 요청할 수 있다. 사용자 프로필을 조회해 보자.

요청 주소: 

```
https://kauth.kakao.com/v1/user/me
```

엑세스 토큰은 헤더값에 설정한다. 설정시 'Bearer ' 문자을 액세스토큰 앞에 추가하여 요청한다.

```
Authorization: Bearer {엑세스 토큰}
```

응답 형식:

```json
{
    "id": "number", // 카카오 아이디 
    "properties": {
        "nickname": "string", // 이름 
        "profile_image": "string", // 프로필 이미지 주소
        "thumbnail_image": "string" // 프로필 이미지 썸네일 주소 
    }
}
```

## 참고

* 개발 가이드: [https://developers.kakao.com/docs/restapi#사용자-관리-사용자-정보-요청](https://developers.kakao.com/docs/restapi#사용자-관리-사용자-정보-요청)