import { graphql, PageProps } from "gatsby"
import React, { FC } from "react"
import { Query } from "../../../graphql-types"
import { CategoryPosts } from "../../components/Category"

const CategoryPage: FC<PageProps<Query>> = p => (
  <CategoryPosts
    location={p.location}
    posts={p.data.allMarkdownRemark.edges.map(edge => edge.node)}
  />
)

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
