# jeonghwan-kim.github.com

[김정환 블로그](http://jeonghwan-kim.github.io/)의 코드 저장소 입니다.

깃헙 호스팅을 사용하기 때문에 [루비와 번들러](https://help.github.com/articles/setting-up-your-pages-site-locally-with-jekyll/)가 설치되어 있어야 합니다.

## 퀵스타트 

번들러와 NPM 패키지를 설치합니다.

```
npm i
bundle install
```

정적 파일을 빌드합니다.
```
npm run build
```

개발서버를 실행합니다.
```
npm start
```

[localhost:4000](http://localhost:4000)를 브라우져로 접속해 확인합니다.

## 글쓰기 

```
npm start
npm start -- --incremental
```

## 개발 

```
npm run dev
```


## 배포 

```
git push origin master
```
