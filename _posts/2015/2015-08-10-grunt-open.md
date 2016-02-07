---
id: 580
title: grunt open
date: 2015-08-10T09:38:30+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=580
permalink: /grunt-open/
AGLBIsDisabled:
  - 0
categories:
  - Grunt.js
  - Node.js
tags:
  - grunt
  - grunt-open
---
Grunt, Gulp등 프로젝트 빌드툴을 사용하면 편리한 점이 한 두가지가 아니다. 브라우져를 자동으로 띄워주는<a href="https://github.com/jsoverson/grunt-open">grunt-open</a>부터 살펴보자.

# 기능

grunt-open 은 웹개발시 개발 URL로 브라우져를 자동으로 띄워주는 기능을 한다.

# 설치

```
$ npm install grunt-open --save-dev
```

혹은 package.json 파일에 gurnt-open을 추가하여 설치한다.
<pre class="lang:default decode:true">// Gruntfile.js

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    open: {
      dev : {
        path: 'http://127.0.0.1:3000',
        app: 'Google Chrome'
      }
    }
  });

  // Plugins.
  grunt.loadNpmTasks('grunt-open');

  // Default task.
  grunt.registerTask('default', ['open']);
};
</pre>
Grunt 설정 파일에서는 `path`에 개발서버 주소를 설정하고 `app`에 사용할 브라우져를 입력한다.  "Firefox"나 "Safari"를 설정해도 된다.

# 실행

```
grunt open
```
