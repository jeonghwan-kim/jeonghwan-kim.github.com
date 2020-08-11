import { graphql } from "gatsby"
import React from "react"
import { CateogryPosts } from "."

export default p => (
  <CateogryPosts
    title="연재물"
    posts={p.data.allMarkdownRemark.edges.map(edge => edge.node)}
  />
)

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      sort: { fields: fields___date, order: DESC }
      filter: { frontmatter: { category: { eq: "series" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200, format: PLAIN, truncate: true)
          fields {
            slug
            dateStr: date(formatString: "YYYY년 MM월 DD일")
            date
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
