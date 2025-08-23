import SEO from "../../components/SEO"
import GoogleAdsense from "../../components/GoogleAdsense"
import { Container } from "../../styles/style-variables"
import Section from "../../components/Section"
import PostList from "../../components/PostList"
import { PlainLayout } from "../../components/layout"
import React from "react"
import { graphql, PageProps } from "gatsby"
import { Query } from "../../../graphql-types"

type PageContext = {
  series: string
}

export default function SeriesTemplate({
  data,
  pageContext,
}: PageProps<
  {
    allPosts: Query["allMarkdownRemark"]
    seriesPosts: Query["allMarkdownRemark"]
  },
  PageContext
>) {
  return (
    <PlainLayout data={data.allPosts.nodes}>
      <SEO
        title={`${pageContext.series}`}
        description={`"${
          pageContext.series
        }" 연재물 ${data.seriesPosts.nodes.length.toLocaleString()}개의 글을 읽어보세요.`}
      />
      <GoogleAdsense />
      <Container small>
        <Section title={`${pageContext.series}`}>
          <PostList posts={data.seriesPosts.nodes} />
        </Section>
      </Container>
    </PlainLayout>
  )
}

export const query = graphql`
  query($series: String!) {
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

    # 시리즈 필터링된 포스트
    seriesPosts: allMarkdownRemark(
      filter: { frontmatter: { series: { eq: $series } } }
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
