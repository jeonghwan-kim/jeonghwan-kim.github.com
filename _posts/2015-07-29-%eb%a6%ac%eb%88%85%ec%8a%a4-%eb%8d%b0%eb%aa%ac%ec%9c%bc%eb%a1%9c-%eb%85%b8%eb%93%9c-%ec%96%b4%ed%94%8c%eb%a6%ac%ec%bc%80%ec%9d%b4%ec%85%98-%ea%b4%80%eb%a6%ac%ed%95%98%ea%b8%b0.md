---
id: 521
title: 리눅스 데몬으로 노드 어플리케이션 관리하기
date: 2015-07-29T23:04:12+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=521
permalink: /%eb%a6%ac%eb%88%85%ec%8a%a4-%eb%8d%b0%eb%aa%ac%ec%9c%bc%eb%a1%9c-%eb%85%b8%eb%93%9c-%ec%96%b4%ed%94%8c%eb%a6%ac%ec%bc%80%ec%9d%b4%ec%85%98-%ea%b4%80%eb%a6%ac%ed%95%98%ea%b8%b0/
categories:
  - Node.js
tags:
  - forever
  - linux deamon
  - linux service
---
운영 서버에서 노드 어플리케이션은 <a href="https://github.com/foreverjs/forever">forever</a> 모듈로 관리한다.

`forever start app.js`

기본적으로는 이러한 명령이지만 `NODE_ENV`, `PORT`등의 환경 변수를 설정한다거나 forever 명령어에 옵션값을 추가하여 구동하는 경우, 또는 기존의 forever 로그 파일을 지워야 하는 경우 등이 있다면 별도의 쉘스크립트로 관리할수 있을 것이다.

리눅스에서는 데몬 형태로 어플리케이션을 구동할 수 있는데 이를 서비스(Service)라고 한다. 엔진엑스가 대표적이다. `service nginx start` 명령어로 엔진엑스를 실행하고, `service nginx stop`로 중지할 수 있다.

이번 글에서는 리눅스 서비스와 forever 모듈로 노드 어플리케이션을 등록하고 관리하는 방법에 대해서 알아보자.

# bin/myapp

서비스 등록에 관련된 파일을 프로젝트의 bin 폴더를 만들어 그곳에 저장하자. 그 중 myapp 파일은 리눅스 서비스에 등록되는 정보를 기록한 파일이다.
<pre class="lang:sh decode:true" title="bin/app">#! /bin/sh

### BEGIN INIT INFO
# Provides:          myapp
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start daemon at boot time
# Description:       Enable service provided by daemon.
### END INIT INFO
PROJECT_PATH=/home/ubuntu/myapp
FOREVER_PATH=${PROJECT_PATH}/node_modules/forever/bin

start() {
    rm /root/.forever/myapp.log
    NODE_ENV=production PORT=8500 ${FOREVER_PATH}/forever start --uid myapp ${PROJECT_PATH}/app.js
}

stop() {
    ${FOREVER_PATH}/forever stop myapp
}

case "$1" in
    start|stop) $1;;
    restart) stop; start;;
	*) echo "Run as $0 &lt;start|stop|restart&gt;"; exit 1;;
esac</pre>
이 파일이 리눅스 서비스로 등록되면 우리는 `service myapp start`로 노드 프로그램을 구동할 수 있다. 그렇게 할 수 있는 것은 `start()` 구문이 있기 때문이다. 자세히 보면 1) myapp.log 라는 기존의 forever 로그를 삭제한다. 그 후 2) 노드 환경변수를 설정하고, 3) myapp이란 이름으로 노드 프로그램을 구동한다.  `stop()`은 구동했던 노드 프로그램을 종료하는 forever 구문이다.

# bin/install.sh

위 파일은 서비스에 등록에 필요한 파일인데, 아래 install.sh 스크립트 실행을 통해 리눅스 서비스로 등록되어진다.
<pre class="lang:default decode:true" title="bin/install.sh">#! /bin/sh

cp /home/ubuntu/myapp/bin/myapp /etc/init.d/myapp
chmod 755 /etc/init.d/myapp
update-rc.d -f myapp remove
update-rc.d myapp defaults 99</pre>
스크립트 내용을 하나씩 짚어보자. 1) /etc/init.d에 myapp 파일을 복사한다. 2) 그리고 파일 접근권한 설정 후, 3) `update-rc.d` 명령어를 이용하여 데몬으로 최종 등록한다.

이제 커맨드라인에서 `sh install.sh` 명령어로 스크립트를 실행하여 myapp을 리눅스 서비스로 등록할 수 있다. 그러면 `service myapp start`, `service myapp stop`, `service myapp stop` 명령어를 통해 노드 프로그램을 관리할 수 있게 된다.

# bin/uninstall.sh

리눅스 서비스로 등록한 myapp 데몬을 제거하기 위해서는 아래 코드를 작성한다.
<pre class="lang:sh decode:true" title="bin/uninstall">#! /bin/sh

rm /etc/init.d/myapp
update-rc.d -f myapp remove
exit 0</pre>
샘플코드: <a href="https://github.com/jeonghwan-kim/forever-with-service-sample">https://github.com/jeonghwan-kim/forever-with-service-sample</a>

&nbsp;