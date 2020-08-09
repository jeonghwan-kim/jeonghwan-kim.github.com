import { graphql } from "gatsby";
import React from "react";
import { CateogryPosts } from ".";

export default (p) => <CateogryPosts title="연재물" posts={p.data.allMarkdownRemark.edges.map(edge => edge.node)} />

export const pageQuery = graphql`{
  allMarkdownRemark(sort: {fields: fields___date, order: DESC}, filter: {frontmatter: {category: {eq: "series"}}}) {
    edges {
      node {
        excerpt
        fields {
          slug
          date(formatString: "YYYY년 MM월 DD일")
        }
        frontmatter {
          title
        }
      }
    }
  }
}`
