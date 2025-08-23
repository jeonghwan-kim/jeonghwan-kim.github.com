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
  tag: string
}

export default function TagTemplate({
  data,
  pageContext,
}: PageProps<
  {
    allPosts: Query["allMarkdownRemark"]
    tagPosts: Query["allMarkdownRemark"]
  },
  PageContext
>) {
  return (
    <HomeLayout data={data.allPosts.nodes}>
      <SEO title="홈" />
      <GoogleAdsense />
      <Container small>
        <Section title={`#${pageContext.tag}`}>
          <PostList posts={data.tagPosts.nodes} />
        </Section>
      </Container>
    </HomeLayout>
  )
}

export const query = graphql`
  query($tag: String!) {
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

    # 태그별 포스트
    tagPosts: allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$tag] } } }
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
