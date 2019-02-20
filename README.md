jeonghwan-kim.github.com
========================

[김정환 블로그](http://blog.jeonghwan.net)의 코드 저장소 입니다.
깃헙 페이지로 호스팅합니다.

## 로컬 환경 세팅

로컬 환경에서 블로그 서버를 띄우려면 아래 순서를 따릅니다.

1. [Ruby and Bundler](https://help.github.com/articles/setting-up-your-pages-site-locally-with-jekyll/) 를 설치합니다.

1. Bundler로 필요한 모듈을 설치합니다.

    ```
    $ bundle install
    ```

1. Jekyll를 싱행합니다.

    ```
    $ bundle exec jekyll serve
    ```

    그리고나서 <http://localhost:4000> 주소를 브라우져로 접속하면 됩니다.
