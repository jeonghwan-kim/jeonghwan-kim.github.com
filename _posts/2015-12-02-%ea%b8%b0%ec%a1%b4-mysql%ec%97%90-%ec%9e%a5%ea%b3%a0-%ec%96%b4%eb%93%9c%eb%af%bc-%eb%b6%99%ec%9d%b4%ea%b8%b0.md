---
id: 903
title: 기존 데이터베이스에 장고 어드민 통합하기
date: 2015-12-02T20:19:58+00:00
author: Chris
layout: post
guid: http://whatilearn.com/?p=903
permalink: /%ea%b8%b0%ec%a1%b4-mysql%ec%97%90-%ec%9e%a5%ea%b3%a0-%ec%96%b4%eb%93%9c%eb%af%bc-%eb%b6%99%ec%9d%b4%ea%b8%b0/
categories:
  - Django
tags:
  - django
  - django-admin
  - python
---
운영중인 서비스의 MySql 데이터베이스에 [장고](https://www.djangoproject.com/) 어드민을 붙일 일이 생겼다. 몇가지 이유 때문에 망설여 진다. '노드로 만든 서비스에 파이썬 프레임웍을 얹으라고?', '장고 어드민으로 실수하면 서비스에 주는 영향은 어떻게 하라고?' 그럼에도 불구하고 장고 어드민을 설치해 본 결과, 실 보다 득이 큰 것 같다. 이번 글에서는 운영중인 MySql 데이터베이스에 장고 어디민을 설치하여 어떻게 운영할 수 있는지 정리해 본다.

## 장고 설치

파이선이 설치되어 있어야한다. 파이썬 패키지 관리도구인 `pip`로 장고를 설치한다.

```
$ pip install django
```

## 프로젝트 생성

`django-admin` 명령어로 새로운 장고 프로젝트를 생성한다.

```
$ django-admin startproject django_admin_sample
```

폴더명에 '-'을 넣는 습관이 있는데 그렇게 프로젝트를 생성하면 에러난다. 참고로 파이썬 2.7.10 버전으로 테스트했다.

```
CommandError: 'django-admin-sample' is not a valid project name. Please use only numbers, letters and underscores.
```

명령어가 수행되면 django_dmin_sample 폴더가 생성된다. 기본적으로 이러한 폴더 구조를 갖는다.

```
/django_damin_sample
  /django_damin_sample
    - __init__.py
    - settings.py
    - urls.py
    - wsgi.py
  manage.py
```

두 가지 파일을 사용할 것이다. `settings.py`는 데이터베이스 등 환경설정을 위해, `manage.py`는 앱 생성, 마이그레이션 등 앱관리를 위해 사용할 것이다.

## 앱 생성

장고는 프로젝트 안에 앱을 포함하는 구조다. manage.py를 이용해서 앱을 생성하자.

```
$ python manage.py startapp hello_app
```

명령어가 수행되면 hello_app 폴더가 생성된다.

```
/django_damin_sample
  /django_damin_sample
  manage.py
  /hello_app
    /migrations
      - __init__.py
      - admin.py
      - models.py
      - tests.py
      - views.py
```

hello_app 폴더를 살펴보자. 여기서는 두개 파일을 사용할 것이다. models.py는 앱의 자원을 모델링하고 이것은 디비와 연결된다. 기존 디비 테이블을 참고하여 모델 클래스를 생성하여 마이그레이션 할 것이다. admin.py는 장고 어드민에 어떤 모델(테이블)을 출력할 것인지를 기록한다.

생성한 앱을 프로젝트에 등록한 뒤 관리할 수 있다. settings.py를 열고 다음을 추가하자.

```
INSTALLED_APPS = (
  'django.contrib.admin',
  'django.contrib.auth',
  'django.contrib.contenttypes',
  'django.contrib.sessions',
  'django.contrib.messages',
  'django.contrib.staticfiles',
  'hello_app' # 추가
)
```

## 마이그레이션

장고 어드민은 Sqlite를 디폴트로 연동한다. 우리는 MySql을 연동할 것이므로 settings.py 파일을 열고 아래와 같이 수정하자.

```
DATABASES = {
  'default': {
  'ENGINE': 'django.db.backends.mysql',
    'NAME': 'test',
    'HOST': 'localhost',
    'PORT': '3306',
    'USER': 'root',
    'PASSWORD': 'root'
  }
}

```

장고와 MySql을 연결하는 패치지도 추가 설치한다. ([에러 메세지 참고](http://stackoverflow.com/questions/15312732/django-core-exceptions-improperlyconfigured-error-loading-mysqldb-module-no-mo))

```
pip install mysql-python
```

`migrate` 명령어를 통해 계정, 권한, 그룹 등 장고 어드민의 필수 테이블을 생성한다.

```
$ python manage.py migrate
Operations to perform:
Synchronize unmigrated apps: staticfiles, messages
Apply all migrations: admin, contenttypes, auth, sessions
Synchronizing apps without migrations:
Creating tables...
Running deferred SQL...
Installing custom SQL...
Running migrations:
Rendering model states... DONE
Applying contenttypes.0001_initial... OK
Applying auth.0001_initial... OK
Applying admin.0001_initial... OK
Applying contenttypes.0002_remove_content_type_name... OK
Applying auth.0002_alter_permission_name_max_length... OK
Applying auth.0003_alter_user_email_max_length... OK
Applying auth.0004_alter_user_username_opts... OK
Applying auth.0005_alter_user_last_login_null... OK
Applying auth.0006_require_contenttypes_0002... OK
Applying sessions.0001_initial... OK
```

test 데이터베이스를 확인하면 아래 테이블이 생성되어 있을 것이다.

* auth_group
* auth_group_permissions
* auth_permission
* auth_user
* auth_user_groups
* django_admin_log
* django_content_type
* django_migrations
* django_session

## 관리자 생성

마지막으로 장고 어드민에 접속할 계정을 생성한다.

```
$ python manage.py createsuperuser
```

생성 완료 후 auth_user 테이블을 확인하면 유저 데이터가 추가되어 있을 것이다.

## 서버 구동

이제 다 되었다. 우리의 첫 번째 장고 어드민을 구동해 보자.

```
$ python manange.py runserver
Performing system checks...

System check identified no issues (0 silenced).
December 02, 2015 - 10:16:20
Django version 1.8.5, using settings 'django_admin_sample.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

브라우져를 열고 [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)에 접속하여 로그인하면 아래 페이지를 확인할 수 있다.

<a href="http://whatilearn.com/wp-content/uploads/2015/12/image1.png"><img class="alignnone size-large wp-image-914" src="http://whatilearn.com/wp-content/uploads/2015/12/image1-1024x437.png" alt="image1" width="640" height="273" /></a>

Users 페이지에서 우리가 생성한 관리가 계정을 확인 할 수 있다.

<a href="http://whatilearn.com/wp-content/uploads/2015/12/image2.png"><img class="alignnone size-large wp-image-915" src="http://whatilearn.com/wp-content/uploads/2015/12/image2-1024x631.png" alt="image2" width="640" height="394" /></a>

여기까지 기본적인 장고 어드민 서버 설치에 대해 알아보았다. 다음은 기존 데이터베이스와 통합하는 방법에 대해 알아보자.

## 모델 클래스 생성

모델 정보는 models.py이 관리한다고 했다. 우리는 운영중인 테이블을 참고하여 모델 클래스를 작성해야 하는데 장고 어드민의 `inspectdb` 명령어가 그 역할을 한다.

```
$ python manage.py inspectdb > ./hell0_app/models.py
```

models.py을 열면 이전 migrate 명령으로 생성된 테이블까지 생성되어 있을 것이다. 이것들은 불필요하다. 우리가 사용할 클래스만 남기고 나머지는 모두 삭제한다.

## 마이그레이션 2

models.py에 추가한 클래스를 장고 어드민에 반영하려면 마이그레이션을 다시한번 수행해야 한다. 이전과 다르게 마이그레이션을 생성한뒤, 마이그레이션을 수행한다.

```
$ python manage.py makemigrations hello_app
Migrations for 'hello_app':
0001_initial.py:
- Create model Resource

$ python manage.py migrate hello_app
Operations to perform:
Apply all migrations: hello_app
Running migrations:
Rendering model states... DONE
Applying hello_app.0001_initial... OK
```

## 어드민 페이지에 모델 추가

기존 데이터베이스에는 Resource 테이블이 있다. 이 테이블은 방금 마이그레이션을 통해 장고 어드민에 반영되었다. 반영된 Resource 모델을 장고 어드민 페이지에 출력하는 일만 남았다. admin.py가 그 역할을 한다고 했다.

```
from django.contrib import admin
from .models import Resource # 모델에서 Resource를 불러온다

# 출력할 ResourceAdmin 클래스를 만든다
class ResourceAdmin(admin.ModelAdmin):
  list_display = ('id', 'name')

# 클래스를 어드민 사이트에 등록한다.
admin.site.register(Resource, ResourceAdmin)
```

서버를 재구동하고 브라우져를 확인해 보자.

```
$ python manage.py runserver
```

<a href="http://whatilearn.com/wp-content/uploads/2015/12/image3.png"><img class="alignnone size-large wp-image-916" src="http://whatilearn.com/wp-content/uploads/2015/12/image3-1024x451.png" alt="image3" width="640" height="282" /></a>

<a href="http://whatilearn.com/wp-content/uploads/2015/12/image4.png"><img class="alignnone size-large wp-image-917" src="http://whatilearn.com/wp-content/uploads/2015/12/image4-1024x488.png" alt="image4" width="640" height="305" /></a>

<a href="http://whatilearn.com/wp-content/uploads/2015/12/image5.png"><img class="alignnone size-large wp-image-918" src="http://whatilearn.com/wp-content/uploads/2015/12/image5-1024x642.png" alt="image5" width="640" height="401" /></a>

## 참고

* 소스코드: [https://github.com/jeonghwan-kim/django_admin_sample](https://github.com/jeonghwan-kim/django_admin_sample)
* [https://docs.djangoproject.com/en/1.8/intro/tutorial01/](https://docs.djangoproject.com/en/1.8/intro/tutorial01/)
* [https://docs.djangoproject.com/en/1.8/intro/tutorial02/](https://docs.djangoproject.com/en/1.8/intro/tutorial02/)
* [https://docs.djangoproject.com/en/1.8/howto/legacy-databases/](https://docs.djangoproject.com/en/1.8/howto/legacy-databases/)