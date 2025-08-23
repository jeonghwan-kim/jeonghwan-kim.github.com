import React from "react"
import GoogleAdsense from "../components/GoogleAdsense"
import { Layout } from "../components/Layout"
import Section from "../components/Section"
import SEO from "../components/SEO"
import { Container } from "../styles/style-variables"
import { graphql, PageProps } from "gatsby"
import { Query } from "../../graphql-types"

export default function NotFoundPage({ data }: PageProps<Query>) {
  return (
    <Layout data={data.allMarkdownRemark.nodes}>
      <SEO title="404: Not found" />
      <GoogleAdsense />
      <Container>
        <Section>
          <h1>페이지를 찾을 수 없습니다</h1>
          <p>찾는 페이지가 삭제되었거나 이동되었을 수 있습니다.</p>
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
