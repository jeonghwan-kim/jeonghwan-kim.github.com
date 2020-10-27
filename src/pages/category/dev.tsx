import { graphql } from "gatsby"
import React from "react"
import { CateogryPosts } from "../../components/Category"

export default p => (
  <CateogryPosts
    title="개발"
    activeCategory={"dev"}
    posts={p.data.allMarkdownRemark.edges.map(e => e.node)}
  />
)

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      sort: { fields: fields___date, order: DESC }
      filter: { frontmatter: { category: { eq: "dev" } } }
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
