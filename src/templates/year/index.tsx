import SEO from "../../components/SEO"
import GoogleAdsense from "../../components/GoogleAdsense"
import { Container } from "../../styles/style-variables"
import Section from "../../components/Section"
import PostList from "../../components/PostList"
import { HomeLayout } from "../../components/layout"
import React from "react"
import { graphql, PageProps } from "gatsby"
import { Query } from "../../../graphql-types"

type PageContext = {
  year: number
}

export default function YearTemplate({
  data,
  pageContext,
}: PageProps<
  {
    allPosts: Query["allMarkdownRemark"]
    yearPosts: Query["allMarkdownRemark"]
  },
  PageContext
>) {
  return (
    <HomeLayout data={data.allPosts.nodes}>
      <SEO title="홈" />
      <GoogleAdsense />
      <Container small>
        <Section title={`${pageContext.year}년`}>
          <PostList posts={data.yearPosts.nodes} />
        </Section>
      </Container>
    </HomeLayout>
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
