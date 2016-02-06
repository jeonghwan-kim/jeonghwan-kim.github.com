---
id: 205
title: 워드프레스에 Grunt 설정하기
date: 2015-02-18T21:35:59+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=205
permalink: /wordpress-and-grunt/
categories:
  - Grunt.js
  - Php
  - Wordpress
tags:
  - grunt
  - php
  - wordpress
---
자바스크립트를 이용한 프로젝트에서는 <a href="http://gruntjs.com/">Grunt</a>를 이용해 프로젝트를 관리한다. 코드 검사, 압축, 배포 등 grunt의 자동화 기술은 과거 수작업이 많았던 웹 개발을 비교적 편리하게 해주는 유용한 툴이다. 자바스크립트 뿐만 아니라 php 프로젝트에서도 grunt를 이용한 프로젝트 관리 자동화를 구현할 수 있다. php의 대표 오픈소즈 중 하나인 <a href="https://wordpress.org/">워드프레스(wordpress)</a> 개발시 grunt를 적용하는 방법을 알아보자.

<h2>Grunt 설치 폴더</h2>

워드프레스의 어떤 부분을 개발하느냐에 따라 Gruntfile.js 파일의 위치가 달라진다.

<ul>
    <li>테마 개발: 테마 하위 폴더 (wordpress/wp-contents/themes/here)</li>
    <li>플러그인 개발: 플러그인 하위 폴더(wordpress/wp-contents/plugins/here)</li>
    <li>전체 사이트: 워드프레스 루트 폴더 (wordpress)</li>
</ul>

<h2>개발 자동화</h2>

Grunt로 웹개발시 가장 편리한 점은 watch다. 소스파일이 수정되면 바로 브라우저에 반영되는 것이 <a href="https://github.com/gruntjs/grunt-contrib-watch">grunt-contrib-watch</a> 다.

또한 php 개발이므로 php 서버 구동이 필요한다. 예전에는 아파치와 php를 설치하고 /var/www에 폴더에 소스파일을 위치시켜 php 소스코드를 인터프리트 할수 있었다. 그러나 <a href="https://github.com/sindresorhus/grunt-php">grunt-php</a>는 호스팅할 루트 폴더를 개발자가 임의로 지정할 수 있다. 예전처럼 /var/www에 폴더를 복사하지 않고고 바로 프로젝트 폴더를 php 서버로 구동할 수 있다.

브라우저 주소창에 localhost를 입력하는 것도 이젠 귀찮다. <a href="https://github.com/jsoverson/grunt-open">grunt-open</a>은 서버 구동과 동시에 특정 브라우저를 열고 작업중인 프로젝트의 url을 열어준다.

상기 세 가지 태스크의 설정 샘플 코드를 보자.

<pre class="lang:js decode:true" title="Gruntfile.js">module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    php: {
      dev: {
        options: {
          port: 9002,
          hostname: 'localhost',
          base: '../../../' // 플러그인 개발 프로젝트이므로 wordpress 루트 경로를 설정한다.
        }
      }
    },

    open: {
      dev: {
        url: 'http://localhost:9002',
        app: 'Google Chrome' // 크롬 브라우져를 구동한다 (osx에 해당)
      }
    },

    watch: {
      options: {
        livereload: true
      },
      php: {
        files: ['**/*.php'],
        tasks: []
      }
    },

    // open과 watch를 동시에 실행해야 서버가 계속 유지된다.
    concurrent: {
      start: [
        'open',
        'watch'
      ],
      options: {
        logConcurrentOutput: true
      }
    },

    // grunt 명령후 서버가 구동되고 브라우져가 열린다. 이제 개발을 시작한다.
    grunt.registerTask('default', ['php', 'concurrent']);</pre>

<h2>빌드 자동화</h2>

Grunt를 사용하는 프로젝트, 특히 자바스크립트 프로젝트에서는 개발 코드를 그대로 배포하지 않고 압축, 난독화, 인터프리트(coffee scrypt, less 등) 등의 작업 후 dist 폴더를 생성하여 배포용 파일을 생성한다. Php를 사용하는 워드프레스 개발시 less 등을 사용한다면 별도의 빌드작업이 필요할 수 있다. 또한 grunt를 사용하게 되면서 노드 모듈 폴더(node_modules), Gruntfile.js, bower.json 등 프로젝트 세팅 파일들이 섞여 있다. 빌드 과정을 통해 실제 워드프레스 파일만 dist폴더에 별도로 모아두는 것이 프로젝트 관리에 효율적이다.

<a href="https://github.com/gruntjs/grunt-contrib-copy">grunt-contrib-copy</a>와 <a href="https://github.com/gruntjs/grunt-contrib-clean">grunt-contrib-clean</a>은 필요한 파일들을 dist폴더에 복사하고 삭제할 수 있다. 설정 코드를 보자.

<pre class="lang:js decode:true" title="Gruntfile.js">module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: './',
          dest: 'dist/',
          src: [
            '*.php',
            '*.css',
            'bower_components/**/*', // bower를 사용할 경우 
            'scripts/**/*'
          ]
        }]
      }
    },

    // 빌드마다 기존 빌드 파일을 삭제한다.
    clean: {
      dist: ['dist'] 
    },

    // grunt build 명령어로 수행 
    grunt.registerTask('build', ['clean', 'copy']);
</pre>

<h2>배포 자동화</h2>

보통 <a href="https://rsync.samba.org/">rsync</a>를 이용해 개발코드를 서버에 배포했다. <a href="https://github.com/jedrichards/grunt-rsync">Grunt-rsync</a>는 기존 rsync의 기능을 그대로 지원한다.

<pre class="lang:js decode:true" title="Gruntfile.js">module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

  rsync: {
      options: {
        args: ['-zvr', '--delete'],
        exclude: ['.git*', '*.scss', 'node_modules'],
        recursive: true
      },
      prod: {
        options: {
          src: './dist/*', // 빌드 파일을 배포한다.
          dest: '/var/www/wp-content/themes/wp-bootstrap', // 테마 개발 시
          host: 'user@remote-host.com',
          delete: true
        }
      }
    }

  });

  // 빌드 후 rsync로 배포한다.
  grunt.registerTask('deploy', ['build', 'rsync']);
};</pre>

정리하면

<ul>
    <li>개발시: `grunt`</li>
    <li>빌드파일 생성시: `grunt build`</li>
    <li>리모트 서버에 배포시: `grunt deploy`</li>
</ul>

전체 코드: <a href="https://github.com/jeonghwan-kim/wp-bootstrap/blob/Gruntfile.js_sharing/Gruntfile.js">https://github.com/jeonghwan-kim/wp-bootstrap/blob/Gruntfile.js_sharing/Gruntfile.js</a>

&nbsp;