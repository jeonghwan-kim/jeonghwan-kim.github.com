---
title: 'Jekyll 커스터마이징 1 - 코멘트와 페이지네이션'
author: Chris
layout: post
---

## 코멘트 


### Disqus

Disqus 대쉬보드에서 코드 복사

_layouts/post.html 에 추가 



## 페이지네이션 


### _config.yml 수정

```yaml
paginate: 10
gems:
  - jekyll-paginate
```


### index.html 수정

paginated list 출력 

모든 페이지를 출력하는 for 루프에 사용하는 `site` 변수 대신 

```html
{% for post in site.posts %}
```

`paginator` 변수를 사용하여 페이지네이션된 리스트를 출력한다
 
 ```html
 {% for post in paginator.posts %}
 ```


### pagination links 출력 

[jekyll 페이지]()에 나온 샘플코드는 좀 이상하다. 1번 링크가 제대로 만들어지지 않았다. 
요 부분만 수정한 코드다. 

```html
<!-- Pagination Links -->
  {% if paginator.total_pages > 1 %}
    <div class="pagination">
      {% if paginator.previous_page %}
        <a href="{{ paginator.previous_page_path | prepend: site.baseurl | replace: '//', '/' }}">&laquo; Prev</a>
      {% else %}
        <span>&laquo; Prev</span>
      {% endif %}

      {% for page in (1..paginator.total_pages) %}
        {% if page == paginator.page %}
          <em>{{ page }}</em>
        {% elsif page == 1 %} 
          <!-- 1번 링크는 루트 링크 설정 -->
          <a href="/">{{ page }}</a>
      {% else %}
          <a href="{{ site.paginate_path | prepend: site.baseurl | replace: '//', '/' | replace: ':num', page }}">{{ page }}</a>
        {% endif %}
      {% endfor %}

      {% if paginator.next_page %}
        <a href="{{ paginator.next_page_path | prepend: site.baseurl | replace: '//', '/' }}">Next &raquo;</a>
      {% else %}
        <span>Next &raquo;</span>
      {% endif %}
    </div>
  {% endif %}
```
