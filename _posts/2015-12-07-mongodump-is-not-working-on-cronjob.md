---
id: 938
title: mongodump 크론잡이 동작하지 않을 때
date: 2015-12-07T20:55:16+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=938
permalink: /mongodump-is-not-working-on-cronjob/
categories:
  - Linux
tags:
  - crontab
  - Docker
  - mongodump
---
서비스 중인 몽고디비 백업을 위해 크론잡에 등록해 놓았다. `mongodump`로 덤프 뜨고 압축해서 S3로 매일 한번씩 백업하는 스크립트다. 스크립트 파일을 꼼꼼히 작성하고 커맨트창에서 실행해 보니 잘 동작한다. 약 1기가 되는 파일이 생성되었고 수 분내에 S3에 업로드 되는 것도 확인했다. 

그런데 며칠 지나서 S3 버킷을 확인해 보니 백업파일이 없다. 테스트로 업로드한 것 외에는 아무것도 없다. 크론잡이 동작하지 않는 것 같다. 백업 스크립트를 다시 확인해 보자.

```
mongodump -d $DATABASE -o $FOLDER
```

`mongodump`의 경로 문제인 경우도 있다고 한다. ([참고](http://serverfault.com/questions/269977/why-does-my-backup-script-work-when-i-run-it-but-not-when-its-run-via-cron)) 아래와 같이 변경하고 나니 제대로 동작한다.

```
$(which mongodum) -d $DATABASE -o $FOLDER
```

그러나 여전히 의문이다. PATH에 mongodump 경로가 지정되어 있는데 말이다.

```
root@e4ba1f6672ac:/var/worker# which mongodump
/usr/local/bin/mongodump
root@e4ba1f6672ac:/var/worker# echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```
