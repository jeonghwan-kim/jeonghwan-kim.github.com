import { graphql, Link, PageProps } from "gatsby"
import React, { FC } from "react"
import Icon from "../components/Icon"
import { IconType } from "../components/Icon/style"
import { HomeLayout } from "../components/layout"
import PostList, { PostItemType } from "../components/PostList"
import Section from "../components/Section"
import SEO from "../components/SEO"
import { MarkdownRemark } from "../models/markdown-remark"
import { Container } from "../styles/style-variables"

const videos: PostItemType[] = [
  {
    title: "만들면서 학습하는 리액트",
    slug:
      "https://www.inflearn.com/course/만들면서-학습하는-리액트?inst=b59d75f4",
    meta: "2021년 05월 / 인프런",
  },
  {
    title: "프론트엔드 개발환경의 이해와 실습",
    slug: "https://www.inflearn.com/course/프론트엔드-개발환경?inst=245c31e1",
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
    slug: "https://www.inflearn.com/course/vuejs?inst=4b6acc34",
    meta: "2018년 11월 / 인프런",
  },
  {
    title: "견고한 JS 소프트웨어 만들기",
    slug:
      "https://www.inflearn.com/course/tdd-견고한-소프트웨어-만들기?inst=35309715",
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
      "https://www.inflearn.com/course/순수js-vuejs-개발-강좌?inst=b936ef67",
    meta: "2018년 01월 / 인프런",
  },
  {
    title: "테스트주도개발(TDD)로 만드는 NodeJS API 서버",
    slug:
      "https://www.inflearn.com/course/테스트주도개발-tdd-nodejs-api?inst=8aa64815",
    meta: "2017년 03월 / 인프런",
  },
  {
    title: "AngularJS 기본 개념과 To-Do 앱 만들기 실습 - 앵귤러 강좌",
    slug:
      "https://www.youtube.com/watch?v=EklH54kysps&list=PLs_XsVQJKaBk_JN5RctLmmVrGwEzpzqaj",
    meta: "2016년 07월 / 유투브",
  },
]

type P = PageProps<{ allMarkdownRemark: { nodes: MarkdownRemark[] } }>

const BlogIndex: FC<P> = ({ data }: P) => {
  return (
    <HomeLayout>
      <SEO title="홈" />
      <Container small>
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
        <Section
          title={
            <>
              <Icon type={IconType.Video} size={4} />
              <span id="videos">VIDEOS</span>
            </>
          }
        >
          <PostList posts={videos} />
        </Section>
      </Container>
    </HomeLayout>
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
