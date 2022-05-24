import { graphql } from "gatsby"
import CategoryPage from "../../components/CategoryPage"

export default CategoryPage

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
            tags
          }
        }
      }
    }
  }
`
