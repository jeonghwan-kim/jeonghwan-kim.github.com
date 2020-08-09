module.exports = {
  siteMetadata: {
    title: `김정환 블로그`,
    description: `주로 웹 기술에 대해 이야기 합니다`,
    author: `김정환`,
    url: 'https://jeonghwan-kim.github.io',
    social: {
      email: 'ej88ej@gmail.com',
      twitterUsername: 'jeonghwan0424',
      githubUsername: 'jeonghwan-kim'
    },
    series: [
      {
        id: 20200102,
        title: '프론트엔드 개발환경의 이해',
      },
      {
        id: 20181201,
        title: 'Node.js 코드랩',
      },
      {
        id: 20171002,
        title: 'Express.js 만들기',
      },
      {
        id: 20170422,
        title: '함수형 프로그래밍',
      },
      {
        id: 20150222,
        title: 'Hapi.js로 API 서버 시작하기',
      },
      {
        id: 20160611,
        title: '앵귤러로 Todo앱 만들기',
      }
    ],
    videos: [
      {
        id: 1,
        url: 'https://www.inflearn.com/course/프론트엔드-개발환경',
        thumb: 'https://cdn.inflearn.com/public/courses/324671/course_cover/638eee1a-6381-402d-a17b-3724751414f1/frontend-env-eng.png',
        title: '프론트엔드 개발환경의 이해와 실습'
      },
      {
        id: 2,
        url: 'https://www.inflearn.com/course/vuejs',
        thumb: 'https://cdn.inflearn.com/wp-content/uploads/kjh_Vuejs-3.jpg',
        title: '트렐로 개발로 배우는 Vuejs, Vuex, Vue-Router 프론트엔드 실전 기술'
      },
      {
        id: 3,
        url: 'https://www.inflearn.com/course/순수js-vuejs-개발-강좌',
        thumb: 'https://cdn.inflearn.com/wp-content/uploads/vuejsandpure.png',
        title: '실습 UI 개발로 배워보는 순수 javascript 와 VueJS 개발'
      },
      {
        id: 4,
        url: 'https://www.inflearn.com/course/테스트주도개발-tdd-nodejs-api',
        thumb: 'https://cdn.inflearn.com/wp-content/uploads/nodetdd.png',
        title: '테스트주도개발(TDD)로 만드는 NodeJS API 서버'
      },
      {
        id: 5,
        url: 'https://www.inflearn.com/course/tdd-견고한-소프트웨어-만들기',
        thumb: 'https://cdn.inflearn.com/wp-content/uploads/software-1.jpg',
        title: '견고한 JS 소프트웨어 만들기'
      },
      {
        id: 6,
        // id: 'youtube_20200407',
        url: 'https://www.youtube.com/watch?v=_QCNqV_EfzE',
        thumb: '/assets/imgs/2020/04/07/youtube_20200407.jpg',
        title: '알아두면 쓸데있는 VSCode 노하우'
      },
    ]
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
        //   {
        //     resolve: `gatsby-remark-responsive-iframe`,
        //     options: {
        //       wrapperStyle: `margin-bottom: 1.0725rem`,
        //     },
        //   },
          `gatsby-remark-prismjs`, // 코드 하일라이팅, npm i prismjs 해야 함.
          `gatsby-remark-autolink-headers`, // 헤딩 링크 추가
        //   `gatsby-remark-copy-linked-files`,
        //   `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `static/assets/imgs/me.jpg`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `whatilearncom`
      }

    }
  ],
}
