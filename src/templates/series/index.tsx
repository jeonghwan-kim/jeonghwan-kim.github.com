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
  series: string
}

export default function SeriesTemplate({
  data,
  pageContext,
}: PageProps<Query, PageContext>) {
  return (
    <HomeLayout data={{} as any}>
      <SEO title="홈" />
      <GoogleAdsense />
      <Container small>
        <Section title={`${pageContext.series}`}>
          <PostList posts={data.allMarkdownRemark.nodes} />
        </Section>
      </Container>
    </HomeLayout>
  )
}

export const query = graphql`
  query($series: String!) {
    allMarkdownRemark(
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
