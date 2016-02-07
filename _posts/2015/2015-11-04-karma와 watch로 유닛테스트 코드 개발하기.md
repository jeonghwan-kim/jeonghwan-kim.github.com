---
id: 840
title: karma와 watch로 유닛테스트 코드 개발하기
date: 2015-11-04T10:49:41+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=840
permalink: /karma%ec%99%80-watch%eb%a1%9c-%ec%9c%a0%eb%8b%9b%ed%85%8c%ec%8a%a4%ed%8a%b8-%ec%bd%94%eb%93%9c-%ea%b0%9c%eb%b0%9c%ed%95%98%ea%b8%b0/
categories:
  - Javascript
tags:
  - grunt
  - karma
  - unit test
  - watch
---
[Karma](https://github.com/karma-runner/karma)는 프로론트엔드 유닛테스를 위한 라이브러리다. Grunt와 함께 사용하는 방법에 대해 살펴보자.

Grunt에서 사용할 Karma를 설치한다.

```
npm install grunt-karma --save
```

## Gruntfile.js

Gruntfile을 작성한다.

```javascript
use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        singleRun: true,
      }
    },

  });

  grunt.registerTask('default', [
    'karma:unit'
  ]);

};
```

Gruntfile에서는 먼저 karma 작업에 대한 설정을 한다. configFile을 karma.conf.js로 설정한다. 그리고 서브 테스크 unit을 정의하여 `singleRun: true` 옵션을 추가한다. 그럼 테스트를 한번만 구동하고 마치는 것이다. 그 다음 default 태스크를 정의하여 `karma:unit` 태스크를 수행하도록 한다. 커맨드창에 `grunt` 명령을 수행하면 karma 러너가 동작할 것이다. 


## karma.conf.js

그전에 karma.conf.js 파일을 작성해야 한다. 이 파일은 Karma 구동시 필요한 정보들을 담고 있다.

```javascript

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/jquery/dist/jquery.js',
      'src/app.js',
      'src/**/*.js',
      'src/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
```

여러가지 옵션 중 몇가지만 살펴 보자. frameworks에는 어떤 밸리데이터를 사용할지 설정한다. 우리는 jasmine을 사용한다. files 에는 테스트를 위해 브라우저가 로딩해야할 자바스크립트 파일 들이다. 프로넥트에서 사용한 라이브러리를 모두 로딩하면 된다. 마지막의 singleRun 옵션은 Gurntfile과 중복되지만 문제 없다. 

이제 명령 줄에 grunt를 수행해 보자. 

```
$ grunt
Running "karma:unit" (karma) task
INFO [karma]: Karma v0.12.31 server started at http://localhost:9876/
INFO [launcher]: Starting browser Chrome
INFO [Chrome 46.0.2490 (Mac OS X 10.11.1)]: Connected on socket K4N6nIH1RbDQZ91eGg4E with id 31910259
Chrome 46.0.2490 (Mac OS X 10.11.1): Executed 34 of 34 SUCCESS (0.286 secs / 0.271 secs)

Done, without errors.
```

총 34개 테스트 유닛이 성공적으로 수행되었다.

## Watch

grunt watch 기능을 사용하면 더 쉽게 개발할 수 있다. 이를 이용하면 파일 변동이 있을때 마다 자동으로 테스트를 수행할 수 있도록 개발 환경을 구성할 수 있다.

[grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) 모듈을 설치한다.

```
npm install grunt-contrib-watch --save
```

Gruntfile.js 에 watch 태스크와 그 서브 태스크를 추가한다.

```javascript
watch: {
  karma: {
    files: ['src/**/*.js'],
    tasks: ['karma:continuous:run']
  }
}
```

src 폴더에 모든 js 파일을 감자하여 karma:continuous 서브 태스크를 수행하도록 설정했다. 그럼 karma:continuous 서브 태스크 정의를 살펴보자.

```javascript
karma: {
  continuous: {
    background: true,
    singleRun: false
  }
}
```

기존 karma:unit 태스크와 달리 `singleRun: false`로 설정하여 태스크 수행후 종료하지 않고 계속 진행하도록 하였다. 그리고 `background: true` 옵션도 추가하였다. 

마지막으로 unit-test 테스크를 추가해 보자. 

```
grunt.registerTask('unit-test', [
  'karma:continuous:start',
  'watch:karma'
]);
```

grunt unit-test를 실행하면 방금 정의한 karma:continuous 를 시작한 뒤 watch:karma가 수행될 것이다. 자바스크립트 파일이 변경될 때마다 테스트가 수행되는 것을 확인할 수 있다. 

```
$ grunt unit-test
Running "karma:continuous:start" (karma) task

Running "watch:karma" (watch) task
Waiting...
>> File "src/Directives/autofocus/autofocus.directive.spec.js" changed.
Running "karma:continuous:run" (karma) task
[2015-11-04 10:33:56.138] [DEBUG] config - Loading config /Users/Chris/Codes/angular-utility/karma.conf.js
Chrome 46.0.2490 (Mac OS X 10.11.1): Executed 34 of 34 SUCCESS (0.276 secs / 0.266 secs)

Done, without errors.
Completed in 1.784s at Wed Nov 04 2015 10:33:56 GMT+0900 (KST) - Waiting...
```
