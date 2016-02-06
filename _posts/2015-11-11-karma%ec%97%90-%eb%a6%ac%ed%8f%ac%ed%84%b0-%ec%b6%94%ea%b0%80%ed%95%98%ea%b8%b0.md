---
id: 846
title: karma에 리포터 추가하기
date: 2015-11-11T19:44:34+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=846
permalink: /karma%ec%97%90-%eb%a6%ac%ed%8f%ac%ed%84%b0-%ec%b6%94%ea%b0%80%ed%95%98%ea%b8%b0/
categories:
  - Javascript
tags:
  - karma
  - unit test
---
[karma와 watch로 유닛테스트 코드 개발하기](http://whatilearn.com/karma와-watch로-유닛테스트-코드-개발하기/)에 이어 karma에 리포터 추가 방법에 대해 알아보자.

## 리포터 설정

기본적으로 두 가지 방식의 리포터를 설정할수 있는데, `dots`와 `progress`다. 이를 karma.conf.js 파일에서 설정할 수 있다.

karma.conf.js:

```
module.exports = function(config) {
config.set({

  // possible values: 'dots', 'progress'
  reporters: ['dots'],
```

각각의 테스트 결과는 아래와 같다.

`dots`:

<a href="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-11-오후-7.21.32.png"><img class="alignnone size-large wp-image-850" src="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-11-오후-7.21.32-1024x189.png" alt="스크린샷 2015-11-11 오후 7.21.32" width="640" height="118" /></a>

`progress`:

<a href="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-11-오후-7.21.10.png"><img class="alignnone size-large wp-image-851" src="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-11-오후-7.21.10-1024x172.png" alt="스크린샷 2015-11-11 오후 7.21.10" width="640" height="108" /></a>

성공시 간단한 결과만 보여주고 실패시 에러를 보여준다. Mocha 테스트와 같이 테스트 유닛별로 결과를 보여줬으면 좋겠다. [karma-mocha-reporter](https://www.npmjs.com/package/karma-mocha-reporter)를 사용하면 가능하다

## karma-macha-reporter

모듈을 설치하고,

```
$ npm install --save-dev karma-mocha-reporter
```

karma.conf.js에서 리포터를 변경한다.

```
reporters: ['mocha'],
```

결과:

<img class="alignnone size-large wp-image-852" src="http://whatilearn.com/wp-content/uploads/2015/11/스크린샷-2015-11-11-오후-7.21.57-1024x516.png" alt="스크린샷 2015-11-11 오후 7.21.57" width="640" height="323" />

그냥 이렇게 보여줘야 마음이 편하다.

&nbsp;