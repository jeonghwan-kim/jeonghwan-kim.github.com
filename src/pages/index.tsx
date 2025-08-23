import { graphql, PageProps } from "gatsby"
import React from "react"
import { Query } from "../../graphql-types"
import GoogleAdsense from "../components/GoogleAdsense"
import { HomeLayout } from "../components/layout"
import PostList from "../components/PostList"
import Section from "../components/Section"
import SEO from "../components/SEO"
import { Container } from "../styles/style-variables"
import Sidebar from "../components/Sidebar"

export default function BlogIndex({ data }: PageProps<Query>) {
  return (
    <HomeLayout data={data}>
      <SEO title="홈" />
      <GoogleAdsense />
      <Container small>
        <Section>
          <PostList posts={data.allMarkdownRemark.nodes} />
        </Section>
      </Container>
    </HomeLayout>
  )
}

export const pageQuery = graphql`
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
