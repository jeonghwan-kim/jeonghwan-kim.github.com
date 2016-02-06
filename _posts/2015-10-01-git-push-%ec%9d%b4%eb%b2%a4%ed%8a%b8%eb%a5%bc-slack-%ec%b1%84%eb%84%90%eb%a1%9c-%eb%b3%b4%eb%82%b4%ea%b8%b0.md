---
id: 774
title: git push 이벤트를 slack 채널로 보내기
date: 2015-10-01T19:59:03+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=774
permalink: /git-push-%ec%9d%b4%eb%b2%a4%ed%8a%b8%eb%a5%bc-slack-%ec%b1%84%eb%84%90%eb%a1%9c-%eb%b3%b4%eb%82%b4%ea%b8%b0/
categories:
  - Git
tags:
  - Git
  - slack
---
회사에 슬랙을 도입하면서 모든 알람을 이곳에서 확인할 수 있다. 깃(Git) 훅을 이용해 서버를 재가동하는 구조라면 서버 재가동시마다 이벤트를 슬랙의 특정 채널로 보낼수 있다. 이번 글에서는 슬랙 API를 깃 훅커에 적용하는 방법에 대해 알아보자.

슬랙 그룹 페이지 좌측 상단에 Menu를 클릭. Integrations 페이지로 이동한다. All Services 에서 incoming webhooks 를 검색하여 페이지로 이동한다. 

<a href="http://whatilearn.com/wp-content/uploads/2015/10/스크린샷-2015-10-01-오후-7.46.33.png"><img src="http://whatilearn.com/wp-content/uploads/2015/10/스크린샷-2015-10-01-오후-7.46.33-1024x543.png" alt="스크린샷 2015-10-01 오후 7.46.33" width="640" height="339" class="alignnone size-large wp-image-781" /></a>

메세지를 보내려는 채널을 선택하고 Add Incomking WebHooks Integration 버튼을 클릭한다. 

<a href="http://whatilearn.com/wp-content/uploads/2015/10/스크린샷-2015-10-01-오후-7.47.18.png"><img src="http://whatilearn.com/wp-content/uploads/2015/10/스크린샷-2015-10-01-오후-7.47.18-1024x543.png" alt="스크린샷 2015-10-01 오후 7.47.18" width="640" height="339" class="alignnone size-large wp-image-783" /></a>

그러면 해당 채널과 연결된 Incoming Webhooks 페이지로 이동한다.

<a href="http://whatilearn.com/wp-content/uploads/2015/10/스크린샷-2015-10-01-오후-7.43.39.png"><img src="http://whatilearn.com/wp-content/uploads/2015/10/스크린샷-2015-10-01-오후-7.43.39-1024x810.png" alt="스크린샷 2015-10-01 오후 7.43.39" width="640" height="506" class="alignnone size-large wp-image-779" /></a>

인커밍 웹훅은 curl를 이용해 특정 url를 호출하는 방식이다. git 후커를 사용할 것이므로 깃 후커에 curl을 호출하는 스크립트를 작성하면 보낼 수 있다.

아래는 깃 저장소에 작성할 `hooks/post-receive` 스크립트 파일 내용이다.

```bash
#!/bin/bash

# 프로젝트 홈
APP_DIR=/project-home

# 최신 커밋으로 체크아웃 
GIT_WORK_TREE=$APP_DIR git checkout -f

# 커밋 해쉬태그
REVISION=$(expr substr $(git rev-parse --verify HEAD) 1 7)

# 서버 재구동 작업
# ...

# Incoming hook 호출 
curl -X POST --data-urlencode 'payload={"channel": "#mychannel", "username": "chris", "text": "Production server is restarted! revision: '"${REVISION}"'"}' https://hooks.slack.com/services/xxxxxxx/yyyyyyy/zzzzzzzz
```

이제 서버에 깃 푸시를 보낼 때마다 깃 후커가 동작할 것이다. 깃 후커는 curl을 이용해 슬랙의 Incoming hook을 호출한다. 슬랙 채널에서는 아래 메세지가 전송될 것이다.

> Production server is restarted! revision: xxyyzz

