import React, { FC } from "react"
import { Link, graphql } from "gatsby"
import Layout from "../../components/layout/layout"
import SEO from "../../components/seo"
import './index.scss';
import PostList from "../../components/post-list";
import { MarkdownRemark } from "../../models/markdown-remark";


interface CateogryPostsProps {
  title: string;
  posts: MarkdownRemark[]
}

export const CateogryPosts: FC<CateogryPostsProps> = ({title, posts}) => (
  <Layout>
      <SEO title={`분류: ${title}`} />
      <div className="home">
        <section className="posts">
          <div className="section-inner container">
            <h2>{title}</h2>
            <PostList posts={posts} />
          </div>
        </section>
      </div>
    </Layout>
)

export default (p) => <CateogryPosts title="모든 글" posts={p.data.allMarkdownRemark.edges.map(edge => edge.node)} />

export const pageQuery = graphql`
{
  allMarkdownRemark(sort: { fields: fields___date, order: DESC }) {
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
}
`