import { graphql } from "gatsby";
import React from "react";
import { CateogryPosts } from ".";

export default (p) => <CateogryPosts title="생각" posts={p.data.allMarkdownRemark.edges.map(e => e.node)} />


export const pageQuery = graphql`{
  allMarkdownRemark(sort: {fields: fields___date, order: DESC}, filter: {frontmatter: {category: {eq: "think"}}}) {
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
}`
