import { graphql } from "gatsby"
import React from "react"
import { CateogryPosts } from "../../components/Category"

export default p => (
  <CateogryPosts
    posts={p.data.allMarkdownRemark.edges.map(edge => edge.node)}
  />
)

export const pageQuery = graphql`
  {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(pruneLength: 200, format: PLAIN, truncate: true)
          frontmatter {
            slug
            date
            title
            category
          }
        }
      }
    }
  }
`
