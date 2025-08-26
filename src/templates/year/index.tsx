import SEO from "../../components/SEO"
import GoogleAdsense from "../../components/GoogleAdsense"
import { Container } from "../../styles/style-variables"
import Section from "../../components/Section"
import PostList from "../../components/PostList"
import { Layout } from "../../components/Layout"
import React from "react"
import { graphql, PageProps } from "gatsby"
import { Query } from "../../../graphql-types"

type PageContext = {
  year: number
}

export default function YearTemplate({
  data: { allPosts, yearPosts },
  pageContext: { year },
}: PageProps<
  {
    allPosts: Query["allMarkdownRemark"]
    yearPosts: Query["allMarkdownRemark"]
  },
  PageContext
>) {
  return (
    <Layout data={allPosts.nodes}>
      <SEO
        title={`${year}년`}
        description={`${year}년에 발행된 ${yearPosts.nodes.length.toLocaleString()}개의 글을 읽어보세요.`}
      />
      <GoogleAdsense />
      <Container>
        <Section title={<>아카이브: {year}년</>}>
          <PostList posts={yearPosts.nodes} />
        </Section>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query($startDate: Date!, $endDate: Date!) {
    # 전체 포스트
    allPosts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        frontmatter {
          slug
          date
          title
          category
          tags
          series
        }
      }
    }

    # 연도별 포스트
    yearPosts: allMarkdownRemark(
      filter: { frontmatter: { date: { gte: $startDate, lt: $endDate } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        frontmatter {
          slug
          date
          title
          category
          tags
          series
        }
      }
    }
  }
`
