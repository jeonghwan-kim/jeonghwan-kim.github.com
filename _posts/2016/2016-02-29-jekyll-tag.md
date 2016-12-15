---
title: 'Jekyll 커스터마이징 2 - 태그'
layout: post
category: Jekyll
tags: jekyll
summary: 'Jekyll에서 태그 시스템을 만들어보자!'
featured_image: /assets/imgs/2016/jekyll_logo.png
---

블로그를 깃헙 페이지로 옮기면서 두번째 해야할 일은 태그 시스템을 만드는 것이다.
데이터베이스, 백엔드가 없는 상황에서 검색은 좀 힘들고 최소한 태그나 카테고리라도 있어야
검색에 용이할 것 같다. 내가 쓴 글들이지만 구글링해서 찾지 않으면 찾을 수가 없다.
그러고 보니 나중에 구글 검색기를 추가하는 것도 방법일 것 같다.

이번에는 지킬에서 태그 시스템을 구축한 내용을 정리해 보자.
정확히는 "깃헙 페이지"에 호스팅하는 지킬 블로그에 태그시스템을 만드는 방법이다.


## 다른 사람들이 만드는 태그 시스템

> How to use tag system in jekyll?

구글링하면 적지 않은 방법들이 있다.
[지킬 공식 페이지](https://jekyllrb.com/docs/plugins/#tags)는 매우 심플하게 설명한다.
심플하게 따라해 보지만 아무것도 일어나지 않는다.

[직접 태그 시스템을 플러그인으로 만드는 방법](http://charliepark.org/tags-in-jekyll/)도 있다.
루비로 작성한 플러그인 파일을 추가하면 기존 포스트에 있는 태그를 추출해서 페이지를 만든는 방법이다.
따라해 봤다. 오! 태그 페이지가 _site 폴더에 생성된다.
그러나 이것도 결국엔 문제가 있다.
깃헙에 푸시하면 아무것도 나오지 않는다.

[깃헙 문서](https://help.github.com/articles/adding-jekyll-plugins-to-a-github-pages-site/)를 보자.

> GitHub Pages officially supports the Jekyll plugins found in the GitHub Pages gem...
Other plugins are not supported...


깃헙 페이지에서 공식 지원하는 플러그인만 사용할수 있다.
플러그인을 직접 구현하는 방법도 못쓰는 것이다.

아, 그리고 로컬에서 개발할때 bundler를 사용해야한다.
이유는 [이 문서](https://help.github.com/articles/setting-up-your-pages-site-locally-with-jekyll/)를 보라.

```
$ bundle exec jekyll serve
```


> so the only way to incorporate them in your site is
to generate your site locally and then push your site's static files to your GitHub Pages site.

직접 만든 플러그인을 사용하려면 로컬에서 생성한 _site 폴더를 깃헙 페이지에 직접 푸시하는 방법을 안내한다.
[실제로 그렇게 사용하는 방법을 설명하는 글](http://charliepark.org/jekyll-with-plugins/)도 있다.
저장소를 두 개로 나눠서 하나는 지킬 소스파일용으로 다른 하나는 지킬로 생성된 정적파일 즉 _site 폴더용이다.
그렇게 두 개 저장소로 나눠서 사용해봤다. 글쓰는 일보다 저장소 관리하는게 더 힘들다.
배도다 배꼽이 더 크고 오버 엔지니어링이며 바보같은 짓이다.

마지막으로 찾은 것이 가장 현실적인 방법이었다. 간단히 말하면 태그 데이터베이스 파일을 만들고
그 태그에 해당하는 링크 페이지를 만드는 것이다. 수작업이 많을 것 같은가? 꼭 그렇지도 않다.
처음에만 기존에 사용하던 태그 페이지를 만드느라 번거롭지만 어느 정도 태그가 쌓이면 편리하다.
새 태그가 생성되면 그 페이지만 그때 그때 만들면 되기 때문이다.

자 그럼 깃헙 페이지에 호스팅하는 지킬 프로젝트에서 태그 시스템 만드는 방법에 대해 알아보자.

## 데이터베이스

서두에 지킬에서는 백엔드가 없고 데이터베이스가 없다고 언급했다.
그러나 _data 폴더를 만들면 데이터베이스처럼 활용할 수 있다.
_data/tags.yml 파일을 만들자. 그리고 블로그에서 사용할 모든 태그 목록을 이 곳에 기록하자.

```yml
- slug: tag1
  name: Tag1

- slug: tag2
  name: Tag2

- slug: tag3
  name: Tag3
```


## 포스트에 태그 설정

tags.yml에서 정의한 태그를 포스트 상단에서 설정할 수 있다. 이런 식이다.

```
---
title: 태그시스템 만들기
layout: post
tags: [tag1, tag2, tag3]
---
```

마크다운 파일은 post 레이아웃을 사용한다.
포스트에 설정한 태그를 출력하기 위해 _layouts/posts.html 파일을 수정한다.
참고로 아래 코드중 "{.%"에서 "."을 빼야한다.

```html
{.% assign post = page %}
{.% if post.tags.size > 0 %}
  {.% capture tags_content %}Tags{.% if post.tags.size == 1 %}<i class="fa fa-tag"></i>{.% else %}<i class="fa fa-tags"></i>{.% endif %}: {.% endcapture %}
  {.% for post_tag in post.tags %}
    {.% for data_tag in site.data.tags %}
      {.% if data_tag.slug == post_tag %}
        {.% assign tag = data_tag %}
      {.% endif %}
    {.% endfor %}
    {.% if tag %}
      {.% capture tags_content_temp %}{{ tags_content }}<a href="/tags/{{ tag.slug }}/">{{ tag.name }}</a>{.% if forloop.last == false %}, {.% endif %}{.% endcapture %}
      {.% assign tags_content = tags_content_temp %}
    {.% endif %}
  {.% endfor %}
{.% else %}
  {.% assign tags_content = '' %}
{.% endif %}
```

페이지를 로딩해보면 링크가 생성되었을 것이다. 아직 클릭해도 페이지로 이동하지는 않는다.


## 태그 페이지

이제 링크로 이동할 태그 페이지를 만들 차례다. 먼저 태그 페이지를 위한 레이아웃 파일을 만든다.

_layouts/blog_by_tag.html:

```html
---
layout: page
title: Tags
---
<h2>#{{ page.tag }}</h2>
<div>
  {.% if site.tags[page.tag] %}
    <ul class="tags">
    {.% for post in site.tags[page.tag] %}
      <li class="tag"><a class="tag-link" href="{{ post.url }}">{{ post.title }}</a></li>
    {.% endfor %}
    </ul>
  {.% else %}
    <p>There are no posts for this tag.</p>
  {.% endif %}
</div>
```

데이터페이스 파일(_data/tags.yml)에서 정의한 태그들을 기억하는가?
이 각각의 태그 이름에 해당하는 페이지들을 만들기 위해 tags 폴더를 프로젝트 루트에 추가한다.
그리고 각 태그이름에 매칭되는 마크다운 파일을 생성하고 blog_by_tag 레이아웃을 사용한다.

tags/tag1.md:

```markdown
---
layout: blog_by_tag
tag: iamge
permalink: /tags/tag1
---
```

localhost/tags/tag1 페이지를 로딩해보자. tag1을 타이틀로하는 post 페이지가 생겼을 것이다.


## 전체 태그 목록 페이지

마지막으로 전체 태그 목록을 출력하는 페이지를 만들 것이다.
localhost/tags로 url을 설정할 것이므로 tags/index.html 파일로 만든다.

tags/index.html:

```html
---
layout: page
title: Tags
permalink: /tags/
---

{.% for tag in site.tags %}
{.% assign t = tag | first %}
{.% assign posts = tag | last %}

<h2>#{{ t }}</h2>
<ul>
  {.% for post in posts %}
  {.% if post.tags contains t %}
  <li>
    <a href="{{ post.url }}">{{ post.title }}</a>
    <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
  </li>
  {.% endif %}
  {.% endfor %}
</ul>
{.% endfor %}
```

## 결론

* 태그 데이터베이스 역할을 하는 _data/tags.yml을 만든다.
* 포스트 상단에 tags 를 설정한다.
* _layout/posts.html을 수정하여 태그 링크를 추가한다.
* 링크로 이동하는 태그 페이지를 tags/***.md로 만든다.
* 전체 태그 목록을 출력하는 tags/index.html을 만든다.
