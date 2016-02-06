---
id: 879
title: 'Atom 플러그인: atom-sync'
date: 2015-11-25T20:48:34+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=879
permalink: /atom-%ed%94%8c%eb%9f%ac%ea%b7%b8%ec%9d%b8-atom-sync/
categories:
  - Atom
tags:
  - atom
  - atom-plugin
  - atom-sync
---
가끔은 리모트 서버에 접속해서 PHP 코드를 수정해야 하는 경우가 있다. 간단한 경우야 리눅스 서버에 설치된 VIM 에디터로 작업할수 있지만 파일간 이동이 잦거나하면 솔직히 답답하다. EditPlus, Coda 처럼 Atom에도 리모트 서버에 접속하여 코드를 수정할 수 있는 플러그인이 있다.

## atom-sync

설치:

```
$ apm insteall atom-sync
```

폴더 루트에 `.sync-config.cson` 파일을 생성하여 싱크할 리모트 서버 정보와 싱크 옵션등을 설정한다.

```
remote:
  host: "remote server ip"
  user: "username"
  path: "/var/www/html"
behaviour:
  uploadOnSave: true
  syncDownOnOpen: true
  forgetConsole: false
  autoHideConsole: true
  alwaysSyncAll: false 
option:
  deleteFiles: true
  exclude: [
    ".sync-config.cson"
    ".git"
    "node_modules"
    "tmp"
    "vendor"
  ]
```

.sync-config.cson 파일이 위치한 폴더를 포함, 하위폴더의 파일은 위 설정을 기준으로 서버와 싱크한다. 폴더 트리에서 우클릭하면 sync 메뉴로 동작할 수 있다.
