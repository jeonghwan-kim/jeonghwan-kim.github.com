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
            <PostList posts={posts.map(p => ({
              slug: p.fields.slug,
              title: p.frontmatter.title,
              meta: <time dateTime={p.fields.date}>{p.fields.dateStr}</time>,
              excerpt: p.excerpt
            }))} />
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