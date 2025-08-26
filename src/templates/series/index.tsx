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
  series: string
}

export default function SeriesTemplate({
  data: { allPosts, seriesPosts },
  pageContext: { series },
}: PageProps<
  {
    allPosts: Query["allMarkdownRemark"]
    seriesPosts: Query["allMarkdownRemark"]
  },
  PageContext
>) {
  return (
    <Layout data={allPosts.nodes}>
      <SEO
        title={`${series}`}
        description={`"${series}" 연재물 ${seriesPosts.nodes.length.toLocaleString()}개의 글을 읽어보세요.`}
      />
      <GoogleAdsense />
      <Container>
        <Section title={<>연재물: {series}</>}>
          <PostList posts={seriesPosts.nodes} />
        </Section>
      </Container>
    </Layout>
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
