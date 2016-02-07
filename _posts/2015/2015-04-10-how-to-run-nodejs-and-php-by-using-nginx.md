---
id: 350
title: nginx를 이용하여 nodejs와 php 어플리케이션 함께 구동하기
date: 2015-04-10T10:04:00+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=350
permalink: /how-to-run-nodejs-and-php-by-using-nginx/
categories:
  - 미분류
tags:
  - apache2
  - nginx
  - reverse proxy
  - virtual host
---
기존에는 아파치 가상호스트 설정을 이용해 한 서버에서 여러개의 php 어플리케이션을 구동하였다. 그러나 Nodjs 어플리케이션을 함께 구동한다면 어떻게 해야할까? 우선 기존의 가상호스트 환경을 살펴보자.

<a href="http://whatilearn.com/wp-content/uploads/2015/04/스크린샷-2015-04-10-오전-9.37.53.png"><img class="alignnone size-large wp-image-351" src="http://whatilearn.com/wp-content/uploads/2015/04/스크린샷-2015-04-10-오전-9.37.53-1024x243.png" alt="스크린샷 2015-04-10 오전 9.37.53" width="640" height="152" /></a>

PHP와 아파치가 연동되어 있고 가상 호스트마다 사이트 경로를 설정하였다. <span style="line-height: 1.5;">그러나 노드 어플리케이션은 단독으로 서버를 구성하기 때문에 특정 폴더를 지정하는 방식과는 맞지 않다. 내부의 특정 포트만 설정하는 형식이다. </span>

nginx 설정을 보니 아래와 같은 문구가 눈에 띈다.

<code>proxy_pass: http://127.0.0.1:9000</code>

노드 어플리케이션을 이런식으로 돌리면 되겠다는 생각이든다. 그럼 nginx를 이용해 가상호스트 설정하는 것으로 변경하자.

<a href="http://whatilearn.com/wp-content/uploads/2015/04/스크린샷-2015-04-10-오전-9.38.16.png"><img class="alignnone size-large wp-image-353" src="http://whatilearn.com/wp-content/uploads/2015/04/스크린샷-2015-04-10-오전-9.38.16-1024x657.png" alt="스크린샷 2015-04-10 오전 9.38.16" width="640" height="411" /></a>

우선 웹서버 역할을 하게될 엔진엑스를 설치하자.

$sudo apt-get install nginx

엔진엑스와 함께 php 스크립트 구문을 해석할  php-fpm 모듈을 추가한다.

$ sudo apt-get install php5-fpm

$ vi /etc/php5/fpm/pool.d/www.conf

cgi.fix_pathinfo = 0; # 주석 제거

$ sudo service nginx restart

php 어플리케이션을 구동할수 있는 nginx 서버를 설치했다. 위 구성도를 만들기 위해 nginx 가상호스트와 리버스프록시를 설정한다.

$ sudo vi /etc/nginx/sites-available/site01
<pre class="lang:sh decode:true ">server {
        listen 80;
        server_name site01.com;
        root /var/www/site01;
        index index.php index.html;

        location ~ \.php$ {
                fastcgi_split_path_info ^(.+\.php)(/.+)$;
                fastcgi_pass unix:/var/run/php5-fpm.sock;
                fastcgi_index index.php;
                include fastcgi_params;
        }
}
</pre>
$ sudo ln -s /etc/nginx/sites-available/site01 /etc/nginx/sites-enable/site01

site01을 설정한 것처럼 site02도 동일한 방법으로 가상호스트 설정을 한다.

노드 어플리케이션은 리버스프록시로 설정한다.

$ sudo vi /etc/nginx/sites-available/site03
<pre class="lang:sh decode:true">server {
        listen 80;
        server_name site03.com;
        location / {
                proxy_pass http://127.0.0.1:9000;
        }
}
</pre>
$ sudo ln -s /etc/nginx/sites-available/site03 /etc/nginx/sites-enable/site03

엔진엑스 데몬을 재구동 하면 하나의 서버에 php 어플리케이션 2개와 nodejs 어플리케이션 1개각 각각 구동되는 것을 확인할 수 있다.

그러나 아파치 설정으로도 동일한 구조를 구성할수 있다는 <a href="http://blog.grotesq.com/post/448">포스트</a>도 있다. 음... 이미 설정했으니 이건 다음 기회에.

참고
<ul>
	<li><a href="http://lesstif.com/pages/viewpage.action?pageId=21430345">포워드 프록시(forward proxy) 리버스 프록시(reverse proxy) 의 차이</a></li>
</ul>