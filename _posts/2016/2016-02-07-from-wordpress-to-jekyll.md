---
title: '워드프레스에서 지킬로 블로그 이동'
author: Chris
layout: post
---

이번 설 연휴에 뭘해 볼까하다가 블로그를 옮기기로 작심했다. 워드프레서스에 지킬([Jekyll](http://jekyllrb.com/))로 옮기고 싶었다. 
다른 프로젝트에서 지킬 웹페이지를 다뤄볼 기회가 있었는데 은근히 재밌는 경험이었다. 

* 코딩하듯이 텍스트 에디터로 글을 작성하는 점
* 커맨드라인 명령어로 웹페이지를 생성하는 과정 
* 깃헙 페이지에서 지킬로 만든 페이지를 무료 호팅해주는 점

이런 점이 끌린다. (물론 워드프레스와 아마존웹서비스 조합도 충분히 훌륭하다.) 하루정도 걸려서 기존 블로그를
지킬로 변경해서 깃헙 호스팅으로 옮겼다. 
 
 
## 댓글 옮기기 
 
워드프레스의 댓글을 Disqus로 옮기고 지킬에서 Disqus 댓글을 붙이는 방법이 있다. 그러나 기존에 댓글은
모두 젯팩으로 작성된 것이었다. 마이그레이션 할 방법을 찾지 못해서 과감히 포기했다. 


## 글 옮기기 

이건 플러그인 도움을 받았다. [Jekyll Exporter](https://wordpress.org/plugins/jekyll-exporter/)라는
플러그인은 워드프레스 컨텐츠를 지킬 프로젝트로 변경해 주는 플러그인이다. 플러그인을 실행하면 Zip 압축파일을
다운로드 해준다.

그러나 이 압축파일을 푸는데 문제가 있었다. 압축을 풀면 다른 이름의 압축파일이 생성되고 이 과정이
무한 반복된다. 언젠가 이런 비슷한 문제를 경험한 것 같다. 데쟈뷴가? 

아마 압축파일 자체가 문제인 것 같다. 다른 방법으로 압축파일을 만들수 없을까?
[플러그인 사용법](https://github.com/benbalter/wordpress-to-jekyll-exporter#command-line-usage)을 보면
워드프레스 서버에 SSH 접속하여 직접 플러그인을 실행하면 압축파일을 만들 수 있다.

```
$ php jekyll-export-cli.php > jekyll-export.zip
```

SCP로 내 컴퓨터에 압축파일을 다운로드 한다. (이제 파일 옮긴다고 GUI툴 안써도 된다!) 

```
$ scp user@domain.com:jekyll-export.zip jekyll-export.zip 
```

커맨드라인으로 들어온 김에 여기서 unzip으로 압축을 풀어보자

```
$ unzip jekyll-export.zip
```

이제야 시원하게 압축이 풀렸다! 폴더 구조를 보면 jekyll 프로젝트가 맞다. 


## 깃헙에 호스팅 

깃헙에서 무료 호스팅하는 페이지는 두 가지 종류다. 

* 유저 페이지
* 프로젝트 페이지 

호스팅 방법이 조금 다르다. 유저 페이지는 깃헙 계정당 한 개만 만들수 있다. 프로젝트 페이지는 저장소별로
만들수 있는데 gh-page 브랜치를 사용한다. 난 유저 페이지를 사용할 것이다.

저장소는 `username.gihub.com`으로 만들어야한다. 

```
$ git init
$ git add --a 
$ git commit -am "From wordpress"
$ git remote add origin "https://github.com/username/username.github.com.git"
$ git push origin master
```

코드를 깃헙 저장소에 푸시한 뒤 수초가 지나면 `"http://username.github.io"`로 호스팅 페이지에 접속할 수 있다


## 도메인 설정

아마존웹서비스의 Route53으로 블로그 도메인 설정을 변경해야 한다. 기존 워드프레스 블로그는 Ec2 인스턴스에
연결해놨었는데 이를 깃헙 호스팅 페이지로 이동해야한다.  

DNS 설정시 A레코드와 CNAME레코드만 설정하면 된다. 

A레코드에는 아래 두 아이피를 추가한다

```
192.30.252.153
192.30.252.154
```

[참고](http://sophiafeng.com/technical/2015/02/12/setting-up-custom-domain-name-with-github-pages-and-amazon-route-53/)

CNAME은 "www"를 추가하고 깃헙 호스팅 페이지의 주소(`"http://username.github.io"`)를 설정한다.
 
이제 도메인으로 접속해보자. 깃헙 404 페이지가 뜬다. 왜 그러지? 사실 이 부분에서 삽질이 많았다.
한 가지 설정이 더 있는데 [저장소에 CNAME 파일을 추가](https://help.github.com/articles/adding-a-cname-file-to-your-repository/)해야 한다. 
도메인명만 한 줄 추가하여 저장소에 푸시한다. 
 
```
whatilearn.com
```

이제 도메인으로 블로그에 접속할 수 있다.


## 남은 이슈

* 검색 기능을 어떻게 할까?
* 카태고리, 태그 관리
* 워드프레스보다 검색엔진에 노출이 잘 될까?
* 댓글은 뭘로하나? Disqus로...