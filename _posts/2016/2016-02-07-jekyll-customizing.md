---
title: 'Jekyll 커스터마이징 1 - 코멘트와 페이지네이션'
author: Chris
layout: post
category: dev
tags: jekyll
featured_image: /assets/imgs/2016/jekyll_logo.png
permalink: /2016/02/07/jekyll-customizing.html
---

지킬(Jekyll) 기본 템플릿에는 글목록과 글만 있다. 워드프레스로 작성한 블로그를 지킬로 가져오는데 이것만으로는
 부족한 점이 많다. 각 글에는 댓글 시스템을 추가하고 글 목록은 페이지네이션으로 처리하자.


## 코멘트

블로그를 이동하면서 기존 댓글을 포기한 점은 아쉽다. ([이전포스트](http://whatilearn.com/2016/02/07/from-wordpress-to-jekyll.html) 참고)
워드프레스로 영원히 작성하리라 생각하고 젯팩 코멘트를 사용했었기 때문에 이동하는데 포기할 수 밖에 없었다.
이런걸 선택할 때도 나중 마이그레이션까지 염두해 둬야 하겠다.


### Disqus

[Disqus](https://disqus.com)는 몇몇 블로그를 방문하면서 유심히 봐았던 댓글 시스템이다. 각 포스트마다 유일한 댓글 쓰레드를
만들어 주는 것인데, 블로그 프레임웍과 무관하게 사용할 수 있는게 장점이다. (젯팩은 워드프레스에서만 동작한다)
소셜 로그인 기능을 지원하기 때문에 사용자가 댓글 입력하는데 귀찮은 단계를 줄여주는 이점도 있다.

Disqus 설치는 매우 간단하다. 구글 애널리스틱처럼 대쉬보드에서 코드만 복사해서 붙여넣으면
된다.

![disqus admin](/assets/imgs/2016/disqus-admin.png)

"Universal Code"를 선택해서 코드를 복사하고 `_includes/comments.html` 파일을 만들어 이 코드를 붙여 넣는다.

그리고 커멘트를 보여줄 `_layouts/post.html` 파일에 comments.html을 불러온다.


## 페이지네이션

블로그의 메인은 보통 최근 작성한 글 목록을 보여준다. 글이 점점 늘어나면 목록도 그만큼 늘어나기 때문에
페이지네이션이 필요하다. 지킬에서는 `config.yml` 설정파일에 페이지네이션을 활성화하는 코드를 추가하고
`index.html`파일에서 `paginator` 변수로 페이지네이션 관련 레이아웃을 작성할 수 있다.


### _config.yml 수정

`_config.yml` 파일에 아래 내용을 추가한다. `paginate`는 한 페이지에 출력할 글 갯수를 의미한다.
그리고 `gems`에 `jekyll-paginate`를 추가한다.

```yaml
paginate: 10
gems:
  - jekyll-paginate
```


### index.html 수정

`index.html`은 두 가지 파트로 구분할 수 있다.

1. 위에서 설정한 paginate 값만큼 포스트 목록 부분
1. 페이지 링크 부분


### paginated list 출력

모든 페이지를 출력하는 for 루프에 사용하는 `site` 변수 대신 `paginator` 변수를 사용하여 페이지네이션된 리스트를 출력한다.

`site.posts` ->  `paginator.posts`


### pagination links 출력

[jekyll 페이지](http://jekyllrb.com/docs/pagination/)에 나온 샘플코드는 좀 이상하다.
1번 링크가 제대로 만들어지지 않았다. 이 부분만 수정한 코드다.

[Gist 링크](https://gist.github.com/jeonghwan-kim/113be09ca20860d67b8c.js)

<script src="https://gist.github.com/jeonghwan-kim/113be09ca20860d67b8c.js"></script>
