import { graphql, Link } from "gatsby"
import React, { FC } from "react"
import Content, { Section } from "../../components/content"
import Layout from "../../components/layout/layout"
import PostList from "../../components/post-list"
import SEO from "../../components/seo"
import { MarkdownRemark } from "../../models/markdown-remark"
import Icon from "../../components/icon"

import "./category.scss"

interface CateogryPostsProps {
  title: string
  posts: MarkdownRemark[]
  activeCategory?: string
}

export const CateogryPosts: FC<CateogryPostsProps> = ({
  title,
  posts,
  activeCategory,
}) => (
  <Layout
    hasHeaderBorder
    aside={
      <div className="category-list">
        <ul>
          <li>
            <label>글분류</label>
          </li>
          <li>
            <Link to="/category" className={!activeCategory ? "active" : ""}>
              모든글
            </Link>{" "}
          </li>
          <li>
            <Link
              to="/category/series"
              className={activeCategory === "series" ? "active" : ""}
            >
              연재물
            </Link>{" "}
          </li>
          <li>
            <Link
              className={activeCategory === "dev" ? "active" : ""}
              to="/category/dev"
            >
              개발
            </Link>{" "}
          </li>
          <li>
            <Link
              to="/category/think"
              className={activeCategory === "think" ? "active" : ""}
            >
              생각
            </Link>{" "}
          </li>
        </ul>
      </div>
    }
  >
    <SEO title={`분류: ${title}`} />
    <Content>
      <Section
        title={
          <>
            <Icon type="article" size={4} />
            {title}
          </>
        }
      >
        <PostList
          posts={posts.map(p => ({
            slug: p.fields.slug,
            title: p.frontmatter.title,
            meta: <time dateTime={p.fields.date}>{p.fields.dateStr}</time>,
            excerpt: p.excerpt,
          }))}
        />
      </Section>
    </Content>
  </Layout>
)

export default p => (
  <CateogryPosts
    title="모든 글"
    posts={p.data.allMarkdownRemark.edges.map(edge => edge.node)}
  />
)

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
