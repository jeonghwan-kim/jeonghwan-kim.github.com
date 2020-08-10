/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
const qs = require('querystring')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const slug = getSlug(node, getNode)
    createNodeField({name: `slug`, value: slug, node})

    const date = getDate(node, getNode)
    createNodeField({name: `date`, value: date, node})

    if (!slug || !date) {
      throw 'NO slug or date!!'
    }

    const beforeGatsby = new Date(date) < new Date('2020-08-08')
    createNodeField({name: 'beforeGatsby', value: beforeGatsby, node})
  }
}

function getSlug(node, getNode) {
  // 문서에 permalink가 있을 경우 이것을 사용
  const {permalink} = node.frontmatter
  if (permalink) {
    return `${permalink.startsWith('/') ? '' : '/'}${permalink}`
  }

  // 파일이름이 yyyy-mm-dd로 시작하면 이를 사용한다.
  // yyyy-mm-dd-jekyll-to-gatsby.md -> yyyy-mm-dd-jekyll-to-gatsby
  const base = path.parse(node.fileAbsolutePath).name // '2020-07-22-jekyll-to-gatsby'
  const ptn = /^(\d\d\d\d)-(\d\d)-(\d\d)-(.+)/;
  const hasDate = ptn.test(base);
  if (hasDate) {
    let slug = base.replace(ptn, '/$1/$2/$3/$4');
    if (node.frontmatter.category) {
      slug = `/${node.frontmatter.category}${slug}.html`
    }

    return slug;
  }

  // 기본값
  return createFilePath({ node, getNode })
}

function getDate(node, getNode) {
  // 문서에 date가 있을 경우 이것을 사용
  if (node.frontmatter.date) {
    return new Date(node.frontmatter.date)
  }

  // 파일이름이 yyyy-mm-dd로 시작하면 이를 사용한다.
  // yyyy-mm-dd-jekyll-to-gatsby.md -> yyyy-mm-dd-jekyll-to-gatsby
  const base = path.parse(node.fileAbsolutePath).name // '2020-07-22-jekyll-to-gatsby'
  const ptn = /^(\d\d\d\d)-(\d\d)-(\d\d)-(.+)/;
  const hasDate = ptn.test(base);
  if (hasDate) {
    return new Date(base.substr(0, 10))
  }

  return '';
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
              date
              beforeGatsby
            }
            frontmatter {
              title
              category
              permalink
              seriesId
              videoId
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges.map(e => e.node);

  posts.forEach((p, i) => {
    createPage({
      path: qs.unescape(p.fields.slug),
      component: path.resolve(`./src/templates/blog-post/blog-post.tsx`),
      context: {
        slug: p.fields.slug,
        date: p.fields.date,
        seriesId: p.frontmatter.seriesId,
        videoId: p.frontmatter.videoId,
        previous: i === posts.length - 1 ? null : posts[i + 1],
        next: i === 0 ? null : posts[i - 1],
      },
    })
  })
}

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const series = [
    {
      id: 'series-20200102',
      title: '프론트엔드 개발환경의 이해',
    },
    {
      id: 'series-20181201',
      title: 'Node.js 코드랩',
    },
    {
      id: 'series-20171002',
      title: 'Express.js 만들기',
    },
    {
      id: 'series-20170422',
      title: '함수형 프로그래밍',
    },
    {
      id: 'series-20150222',
      title: 'Hapi.js로 API 서버 시작하기',
    },
    {
      id: 'series-20160611',
      title: '앵귤러로 Todo앱 만들기',
    }
  ];

  series.forEach(s => {
    actions.createNode({
      id: createNodeId(`series-${s.title}`),
      title: s.title,
      internal: {
        type: "series",
        contentDigest: createContentDigest(s),
      },
    })
  })

  const videos = [
    {
      id: "1",
      url: 'https://www.inflearn.com/course/프론트엔드-개발환경',
      thumb: 'https://cdn.inflearn.com/public/courses/324671/course_cover/638eee1a-6381-402d-a17b-3724751414f1/frontend-env-eng.png',
      title: '프론트엔드 개발환경의 이해와 실습'
    },
    {
      id: "2",
      url: 'https://www.inflearn.com/course/vuejs',
      thumb: 'https://cdn.inflearn.com/wp-content/uploads/kjh_Vuejs-3.jpg',
      title: '트렐로 개발로 배우는 Vuejs, Vuex, Vue-Router 프론트엔드 실전 기술'
    },
    {
      id: "3",
      url: 'https://www.inflearn.com/course/순수js-vuejs-개발-강좌',
      thumb: 'https://cdn.inflearn.com/wp-content/uploads/vuejsandpure.png',
      title: '실습 UI 개발로 배워보는 순수 javascript 와 VueJS 개발'
    },
    {
      id: "4",
      url: 'https://www.inflearn.com/course/테스트주도개발-tdd-nodejs-api',
      thumb: 'https://cdn.inflearn.com/wp-content/uploads/nodetdd.png',
      title: '테스트주도개발(TDD)로 만드는 NodeJS API 서버'
    },
    {
      id: "5",
      url: 'https://www.inflearn.com/course/tdd-견고한-소프트웨어-만들기',
      thumb: 'https://cdn.inflearn.com/wp-content/uploads/software-1.jpg',
      title: '견고한 JS 소프트웨어 만들기'
    },
    {
      id: "6",
      url: 'https://www.youtube.com/watch?v=_QCNqV_EfzE',
      thumb: '/assets/imgs/youtube_20200407.jpg',
      title: '알아두면 쓸데있는 VSCode 노하우'
    },
  ]

  videos.forEach(v => {
    actions.createNode({
      id: createNodeId(`series-${v.title}`),
      title: v.title,
      thumb: v.thumb,
      url: v.url,
      internal: {
        type: "video",
        contentDigest: createContentDigest(v),
      },
    })
  })
}
