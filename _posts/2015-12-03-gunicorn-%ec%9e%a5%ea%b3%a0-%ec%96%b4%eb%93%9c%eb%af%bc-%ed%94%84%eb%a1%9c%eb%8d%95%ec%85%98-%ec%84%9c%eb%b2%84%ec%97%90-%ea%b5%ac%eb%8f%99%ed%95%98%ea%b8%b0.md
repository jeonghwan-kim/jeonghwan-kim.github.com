---
id: 907
title: 'gunicorn: 장고 어드민 프로덕션 서버에 구동하기'
date: 2015-12-03T17:12:21+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=907
permalink: /gunicorn-%ec%9e%a5%ea%b3%a0-%ec%96%b4%eb%93%9c%eb%af%bc-%ed%94%84%eb%a1%9c%eb%8d%95%ec%85%98-%ec%84%9c%eb%b2%84%ec%97%90-%ea%b5%ac%eb%8f%99%ed%95%98%ea%b8%b0/
categories:
  - Django
tags:
  - django
  - gunicorn
---
runserver로 장고 서버를 구동할수 있지만 운영서버에서는 사용하지 말아야한다. ([참고](https://docs.djangoproject.com/en/1.9/ref/django-admin/#runserver-port-or-address-port)) 백그라운드 프로세스로 구동할 수 있지만 성능이나 안전성 이슈가 있는가 보다.

[gunicon](http://gunicorn.org/)은 장고 서버를 관리하는 툴이다. 포에버가 노드를 관리하는 것과 비슷한 역할인 것 같다. 데몬으로 구동하고 워커를 생성하는 기능이 있다. gunicon을 이용해 장고 서버를 구동해 보자.

## 설치

```
$ pip install gunicorn
```

소스 설치나 apt, yum으로 설치하려면 [여기](http://docs.gunicorn.org/en/latest/install.html) 참고


## static 파일 호스팅

js, css 파일등은 nginx로 호스팅 해야한다. 

settings.py에 정적 파일을 저장할 폴더를 설정한다.

```
STATIC_ROOT = '/static/files/path/'
```

`collectstatic` 명령으로 스태틱 파일을 생성한다.

```
$ python manage.py collectstatic
```

nginx로 해당파일을 호스팅한다.

```
server {
    listen localhost:8000;

    location / {
        proxy_pass http://127.0.0.1:8001;
    }

    location /static/ {
        autoindex on;
        alias /static/files/path/;
    }
}
```


## gunicon 실행

```
gunicorn project.wsgi:application --bind=127.0.0.1:8001 --daemon --reload
```

* `--daemon`: 데몬 프로세스로 실행
* `--reload`: 소스 변경시 재구동 


## 참고

* [https://docs.djangoproject.com/en/1.9/ref/django-admin/#runserver-port-or-address-port](https://docs.djangoproject.com/en/1.9/ref/django-admin/#runserver-port-or-address-port)
* [http://agiliq.com/blog/2013/08/minimal-nginx-and-gunicorn-configuration-for-djang/](http://agiliq.com/blog/2013/08/minimal-nginx-and-gunicorn-configuration-for-djang/)