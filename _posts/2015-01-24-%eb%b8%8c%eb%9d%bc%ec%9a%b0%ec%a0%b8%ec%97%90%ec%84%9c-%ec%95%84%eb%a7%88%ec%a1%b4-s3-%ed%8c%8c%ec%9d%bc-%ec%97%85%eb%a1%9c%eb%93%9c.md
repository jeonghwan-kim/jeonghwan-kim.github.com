---
id: 137
title: 브라우져에서 아마존 S3 파일 업로드
date: 2015-01-24T17:32:45+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=137
permalink: /%eb%b8%8c%eb%9d%bc%ec%9a%b0%ec%a0%b8%ec%97%90%ec%84%9c-%ec%95%84%eb%a7%88%ec%a1%b4-s3-%ed%8c%8c%ec%9d%bc-%ec%97%85%eb%a1%9c%eb%93%9c/
categories:
  - AmazonWebService
tags:
  - aws
  - browser
  - file upload
  - javascript
  - s3
---
아마존 웹 서비스를 사용할 때 이미지 같은 스테틱 파일들은 아마존 S3에 업로드하여 관리하는 경우가 많다. 브라우저 단에서 아마존 S3로 이미지를 업로드하고 조회하고 삭제하는 방법에 대해 알아보자.

<h1>1. 버킷생성</h1>

우선 S3에서 버킷(폴더라고 생각하면 된다)을 생성하고 버킷의 접근권한을 설정해야한다. 리눅스 서버에서 호스팅할 서버상의 폴더를 지정하고 파일 권한을 설정하는 것과 같은 개념이다. 버킷 선택후 Properties &gt; Permissions &gt; Edit bucket policy를 클릭하여 <code>"Action": "s3:GetObject"</code> 권한을 추가한다. 이것은 외부에서 S3에 저장되어 있는 파일(Object)에 read 권한을 설정하는 것이다. 브라우저에서 S3에 콜을 날릴 경우 <a href="http://huns.me/development/1291">크로스도메인 문제</a>도 발생한다. Edit CORS Configuration에서 설정할 수 있다.

<pre class="lang:default decode:true">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/"&gt;
  &lt;CORSRule&gt;
    &lt;AllowedOrigin&gt;*&lt;/AllowedOrigin&gt;
    &lt;AllowedMethod&gt;GET&lt;/AllowedMethod&gt;
    &lt;AllowedMethod&gt;POST&lt;/AllowedMethod&gt;
    &lt;AllowedMethod&gt;PUT&lt;/AllowedMethod&gt;
    &lt;AllowedMethod&gt;DELETE&lt;/AllowedMethod&gt;
    &lt;ExposeHeader&gt;ETag&lt;/ExposeHeader&gt;
    &lt;ExposeHeader&gt;x-amz-meta-custom-header&lt;/ExposeHeader&gt;
    &lt;AllowedHeader&gt;*&lt;/AllowedHeader&gt;
  &lt;/CORSRule&gt;
&lt;/CORSConfiguration&gt;</pre>

<h1>2. IAM Role 등록</h1>

리눅스 파일서버에 접속하여 파일을 등록하고 삭제하는 경우 계정명과 비밀번호로 접속한다. S3도 마찬가지로 그러한 인증 절차를 요구하는데 IAM 서비스를 통해 설정할 수 있다. IAM 웹 콘솔에서 User를 추가한 뒤 Attach User Policy를 클릭한다. 간단하게 AmazonS3FullAccess 권한을 선택하여 S3에 대한 모든 권한을 설정한다. 그렇지 않고 S3중 getObjct, putObject, deleteObject 권한만 설정하고 특정 버킷만 접근하도록 설정할 수도 있다. 모든 설정을 마친 뒤 Credencials 파일을 다운로드 받는다. 이 파일은 실제 코딩시 사용할 것이다.

<h1>3. 코딩</h1>

코딩은 <a href="http://aws.amazon.com/ko/developers/getting-started/browser/">아마존 문서</a>를 참고한다. 아마존 sdk에 인증정보를 설정한다. <a href="http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/browser-configuring.html">아마존 문서</a>에 따르면 예전처럼 페이스북 인증과 연동하거나 아마존 Cognito와 연동해야 한다. 아래처럼 하드코딩하는 것은 테스트 용으로만 사용하자.

<pre class="lang:js decode:true">AWS.config.update({
  accessKeyId: "Access Key",
  secretAccessKey: "Secret Access Key"
});</pre>

크리덴셜 정보를 설정한 뒤 아마존 S3 객체를 생성하고 이 객체를 통해 putObject()나 deleteObject()로 업로드/삭제를 진행할 수 있다.

<pre class="lang:js decode:true">// 아마존 S3 객체 생성 
var bucket = new AWS.S3({
  region: 'region',
  params: {
    Bucket: 'bucket name'
  }
});

// 등록한 Object 정보 설정 
var params = {
  Key: 'object key', // 경로
  ContentType: 'file type', // 파일 타입 
  Body: 'file', // 파일 본문 
  ACL: 'public-read' // 접근 권한 
};

// 파일 업로드 
bucket.putObject(params, function (err, data) {
  // 업로드 성공 
});</pre>

연관 포스팅: <a title="아마존 S3를 이용한 이미지 업로드 서버 구축" href="http://whatilearn.com/%ec%95%84%eb%a7%88%ec%a1%b4-s3%eb%a5%bc-%ec%9d%b4%ec%9a%a9%ed%95%9c-%ec%9d%b4%eb%af%b8%ec%a7%80-%ec%97%85%eb%a1%9c%eb%93%9c-%ec%84%9c%eb%b2%84-%ea%b5%ac%ec%b6%95/">아마존 S3를 이용한 이미지 업로드 서버 구축</a>