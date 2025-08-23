import { graphql, PageProps } from "gatsby"
import React from "react"
import { Query } from "../../graphql-types"
import GoogleAdsense from "../components/GoogleAdsense"
import { Layout } from "../components/Layout"
import PostList from "../components/PostList"
import Section from "../components/Section"
import SEO from "../components/SEO"
import { Container } from "../styles/style-variables"

export default function HomePage({ data }: PageProps<Query>) {
  return (
    <Layout data={data.allMarkdownRemark.nodes}>
      <SEO title="홈" />
      <GoogleAdsense />
      <Container>
        <Section>
          <PostList posts={data.allMarkdownRemark.nodes} />
        </Section>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
