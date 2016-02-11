---
title: 'Jekyll 커스터마이징 1 - 코멘트와 페이지네이션'
author: Chris
layout: post
---

지킬(Jekyll) 기본 템플릿에는 글목록과 글만 있다. 워드프레스로 작성한 블로그를 지킬로 가져오는데 이것만으로는
 부족한 점이 많다. 각 글에는 댓글 시스템을 추가하고 글 목록은 페이지네이션으로 처리하자.


## 코멘트 


블로그를 이동하면서 기존 댓글을 포기한 점은 아쉽다. ([이전포스트]()) 워드프레스로 영원히 작성하리라 
  생각하고 젯팩 코멘트를 사용했었기 때문에 이동하는데 포기할 수 밖에 없었다. 이런걸 선택할 때도 나중
  마이그레이션을 염두해 두고 선택해야 되겠다.
  

### Disqus

Disqus는 몇몇 블로그를 방문하면서 유심히 봐았던 댓글 시스템이다. 각 포스트마다 유일한 댓글 쓰레드를 
만들어 주는 것인데, 블로그 프레임웍과 무관하게 사용할 수 있다. (젯팩은 워드프레스에서만 동작한다) 소셜
로그인 기능을 지원하기 때문에 사용자가 댓글 입력하는데 귀찮은 단계를 줄여주는 이점도 있다.

Disqus설치는 매우 간단하다. 구글 애널리스틱처럼 대쉬보드에서 코드만 복사해서 붙여넣으면 
된다. `_includes/comments.html` 파일을 만들어 이 코드를 복사해 넣는다.

```html
<!-- _includes/comments.html -->

<div id="disqus_thread"></div>
<script>
  /**
   *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
   *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
   */
  /*
   var disqus_config = function () {
   this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
   this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
   };
   */
  (function() {  // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');

    s.src = '//your-service-name.disqus.com/embed.js';

    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>

```

그리고 커멘트를 보여줄 `_layouts/post.html` 파일에 comments.html을 불러온다. 

```html
---
layout: default
---
<article class="post" itemscope itemtype="http://schema.org/BlogPosting">

  <header class="post-header">
    <h1 class="post-title" itemprop="name headline">{{ page.title }}</h1>
    <p class="post-meta"><time datetime="{{ page.date | date_to_xmlschema }}" itemprop="datePublished">{{ page.date | date: "%b %-d, %Y" }}</time>{% if page.author %} • <span itemprop="author" itemscope itemtype="http://schema.org/Person"><span itemprop="name">{{ page.author }}</span></span>{% endif %}</p>
  </header>

  <div class="post-content" itemprop="articleBody">
    {{ content }}
  </div>

  <!-- Disqus를 로딩한다 -->
  <div class="post-comments disqus">
    {% include comments.html %}
  </div>

</article>
 
```



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
