import SEO from "../../components/SEO"
import GoogleAdsense from "../../components/GoogleAdsense"
import { Container } from "../../styles/style-variables"
import Section from "../../components/Section"
import PostList from "../../components/PostList"
import { Layout } from "../../components/layout"
import React from "react"
import { graphql, PageProps } from "gatsby"
import { Query } from "../../../graphql-types"

type PageContext = {
  tag: string
}

export default function TagTemplate({
  data: { allPosts, tagPosts },
  pageContext: { tag },
}: PageProps<
  {
    allPosts: Query["allMarkdownRemark"]
    tagPosts: Query["allMarkdownRemark"]
  },
  PageContext
>) {
  return (
    <Layout data={allPosts.nodes}>
      <SEO
        title={`#${tag}`}
        description={`${tag}와 관련된 ${tagPosts.nodes.length.toLocaleString()}개의 글을 읽어보세요.`}
      />
      <GoogleAdsense />
      <Container>
        <Section title={`#${tag}`}>
          <PostList posts={tagPosts.nodes} />
        </Section>
      </Container>
    </Layout>
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
