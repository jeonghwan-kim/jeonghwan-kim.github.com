import React, { FC } from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/seo"
import PostList, { PostItemType } from "../components/post-list"

import "./index.scss"
import { MarkdownRemark, Frontmatter, Fields } from "../models/markdown-remark"
import Content, { Section } from "../components/content"

const videos: PostItemType[] = [
  {
    title: "프론트엔드 개발환경의 이해와 실습",
    slug: "https://www.inflearn.com/course/프론트엔드-개발환경",
    meta: "2020년 03월 / 인프런",
  },
  {
    title: "Express.js 코드리딩",
    slug:
      "https://www.youtube.com/playlist?list=PL91ve-iBgvZ5ga1BQkN2DLJgqBfWCkGfm",
    meta: "2019년 03월 / 유투브",
  },
  {
    title: "트렐로 개발로 배우는 Vuejs, Vuex, Vue-Router 프론트엔드 실전 기술",
    slug: "https://www.inflearn.com/course/vuejs",
    meta: "2018년 11월 / 인프런",
  },
  {
    title: "견고한 JS 소프트웨어 만들기",
    slug:
      "https://www.inflearn.com/course/tdd-%EA%B2%AC%EA%B3%A0%ED%95%9C-%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4-%EB%A7%8C%EB%93%A4%EA%B8%B0",
    meta: "2018년 06월 / 인프런",
  },
  {
    title: "Node.js 기반의 REST API 서버 개발",
    slug:
      "https://tacademy.skplanet.com/live/player/onlineLectureDetail.action?seq=134",
    meta: "2018년 04월 / T아카데미",
  },
  {
    title: "실습 UI 개발로 배워보는 순수 javascript 와 VueJS 개발",
    slug:
      "https://www.inflearn.com/course/%EC%88%9C%EC%88%98js-vuejs-%EA%B0%9C%EB%B0%9C-%EA%B0%95%EC%A2%8C",
    meta: "2018년 01월 / 인프런",
  },
  {
    title: "테스트주도개발(TDD)로 만드는 NodeJS API 서버",
    slug:
      "https://www.inflearn.com/course/%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%A3%BC%EB%8F%84%EA%B0%9C%EB%B0%9C-tdd-nodejs-api",
    meta: "2017년 03월 / 인프런",
  },
  {
    title: "AngularJS 기본 개념과 To-Do 앱 만들기 실습 - 앵귤러 강좌",
    slug:
      "https://www.youtube.com/watch?v=EklH54kysps&list=PLs_XsVQJKaBk_JN5RctLmmVrGwEzpzqaj",
    meta: "2016년 07월 / 유투브",
  },
]

interface P {
  data: {
    allMarkdownRemark: {
      nodes: MarkdownRemark[]
    }
  }
}

const BlogIndex: FC<P> = ({ data }) => {
  return (
    <Layout>
      <SEO title="홈" />
      <Content className="container-sm">
        <Section>
          <PostList
            posts={data.allMarkdownRemark.nodes.map(node => ({
              slug: node.fields.slug,
              title: node.frontmatter.title,
              meta: (
                <time dateTime={node.fields.date}>{node.fields.dateStr}</time>
              ),
              excerpt: node.excerpt,
            }))}
          />
          <Link to="/category/">더보기</Link>
        </Section>
        <Section title={<span id="videos">VIDEOS</span>}>
          <PostList posts={videos} />
        </Section>
      </Content>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: fields___date, order: DESC }, limit: 10) {
      nodes {
        excerpt(pruneLength: 200, format: PLAIN, truncate: true)
        fields {
          slug
          dateStr: date(formatString: "YYYY년 MM월 DD일")
          date
        }
        frontmatter {
          title
        }
      }
    }
  }
`
