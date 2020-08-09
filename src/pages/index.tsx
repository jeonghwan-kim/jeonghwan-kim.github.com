import React, { FC } from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/seo"
import PostList from "../components/post-list";

import './index.scss';

const videos = [
  ['2020-03', '인프런', '프론트엔드 개발환경의 이해와 실습', 'https://www.inflearn.com/course/프론트엔드-개발환경'],
  ['2019-03', '유투브', 'Express.js 코드리딩', 'https://www.youtube.com/playlist?list=PL91ve-iBgvZ5ga1BQkN2DLJgqBfWCkGfm'],
  ['2018-11', '인프런', '트렐로 개발로 배우는 Vuejs, Vuex, Vue-Router 프론트엔드 실전 기술', 'https://www.inflearn.com/course/vuejs'],
  ['2018-06', '인프런', '견고한 JS 소프트웨어 만들기', 'https://www.inflearn.com/course/tdd-%EA%B2%AC%EA%B3%A0%ED%95%9C-%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4-%EB%A7%8C%EB%93%A4%EA%B8%B0'],
  ['2018-04', 'T아카데미', 'Node.js 기반의 REST API 서버 개발', 'https://tacademy.skplanet.com/live/player/onlineLectureDetail.action?seq=134'],
  ['2018-01', '인프런', '실습 UI 개발로 배워보는 순수 javascript 와 VueJS 개발', 'https://www.inflearn.com/course/%EC%88%9C%EC%88%98js-vuejs-%EA%B0%9C%EB%B0%9C-%EA%B0%95%EC%A2%8C'],
  ['2017-03', '인프런', '테스트주도개발(TDD)로 만드는 NodeJS API 서버', 'https://www.inflearn.com/course/%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%A3%BC%EB%8F%84%EA%B0%9C%EB%B0%9C-tdd-nodejs-api'],
  ['2016-07', '유투브', 'AngularJS 기본 개념과 To-Do 앱 만들기 실습 - 앵귤러 강좌', 'https://www.youtube.com/watch?v=EklH54kysps&list=PLs_XsVQJKaBk_JN5RctLmmVrGwEzpzqaj'],
]

interface P {
  data: any;
}

const BlogIndex: FC<P> = ({data}) => {
  return (
    <Layout>
      <SEO title="홈" />
      <div className="home">
        <section className="posts">
          <div className="section-inner container">
            <PostList posts={data.allMarkdownRemark.edges.map(e => e.node)} />
            <Link to="/category/">더보기</Link>
          </div>
        </section>
        <section className="videos" id="videos">
          <div className="section-inner container">
            <h2 className="section-title"><a href="#videos">VIDEOS</a></h2>
            <ul className="post-list">
              {videos.map((v, idx) => {
                return <li key={idx}>
                  <a className="post-item my-5" href={v[3]} target="_blank">
                    <h2 className="post-item-title mb-0">{v[2]}</h2>
                    <p className="post-meta mt-1">
                      <span className="date">{v[0]}</span>
                      <span className="date">{v[1]}</span>
                    </p>
                  </a>
                </li>
              })}
          </ul>
        </div>
      </section>
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: fields___date, order: DESC }, limit: 10) {
      edges {
        node {
          excerpt
          fields {
            slug
            date(formatString: "YYYY년 MM월 DD일")
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
