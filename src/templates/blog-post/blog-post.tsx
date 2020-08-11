import { graphql, Link } from "gatsby"
import React, { FC } from "react"
import Layout from "../../components/layout/layout"
import { MarkdownRemark } from "../../models/markdown-remark"
import { Site, Series, Video } from "../../models/site"
import SEO from "../../components/seo"
import PostComment from "./post-comment"
import PostShare from "./post-share"
import PostToc from "./post-toc"
import PostVideo from "./post-video"
import SeriesNav from "./series-nav"

import "./blog-post.scss"
import Button from "../../components/button"
import PostTag from "./post-tag"
import SiblingNavItem from "./sibling-nav"
import SiblingNav from "./sibling-nav"

interface P {
  data: {
    site: Site
    markdownRemark: MarkdownRemark
    allMarkdownRemark: {
      nodes: MarkdownRemark[]
    }
    series: Series
    video: Video
  }
  pageContext: {
    previous: MarkdownRemark
    next: MarkdownRemark
  }
}

const BlogPostTemplate: FC<P> = ({ data, pageContext }) => {
  const { markdownRemark, series, video } = data
  const { previous, next } = pageContext

  return (
    <Layout>
      <SEO title={markdownRemark.frontmatter.title} />
      <div
        className="blog-post container"
        itemScope
        itemType="http://schema.org/BlogPosting"
      >
        <main>
          {(markdownRemark.tableOfContents || series || video) && (
            <aside>
              {markdownRemark.tableOfContents && (
                <PostToc tableOfContents={markdownRemark.tableOfContents} />
              )}
              {series && (
                <SeriesNav
                  lite
                  series={series}
                  nodeId={markdownRemark.id}
                  posts={data.allMarkdownRemark.nodes}
                />
              )}
              {video && <PostVideo video={video} />}
            </aside>
          )}
          <article>
            <header>
              <h1 itemProp="name headline">
                {markdownRemark.frontmatter.title}
              </h1>
              <time
                itemProp="datePublished"
                dateTime={markdownRemark.fields.date}
              >
                {markdownRemark.fields.dateStr}
              </time>
            </header>
            <div
              className="post-content"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: markdownRemark.html }}
            ></div>
            <div className="post-meta">
              {(markdownRemark.frontmatter.tags || []).length > 0 && (
                <PostTag tags={markdownRemark.frontmatter.tags} />
              )}
              <PostShare
                markdownRemark={markdownRemark}
                siteMetadata={data.site.siteMetadata}
              />
            </div>
          </article>
        </main>
        <footer className="container-sm">
          <SiblingNav previous={previous} next={next} />
          {series && (
            <SeriesNav
              className="mb-4"
              series={series}
              nodeId={markdownRemark.id}
              posts={data.allMarkdownRemark.nodes}
            />
          )}
          <PostComment markdownRemark={markdownRemark} site={data.site} />
        </footer>
      </div>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $seriesId: String, $videoId: String) {
    site {
      siteMetadata {
        title
        url
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        dateStr: date(formatString: "YYYY년 MM월 DD일")
        date
        slug
        beforeGatsby
      }
      frontmatter {
        title
        tags
        seriesId
        videoId
      }
      tableOfContents(absolute: false, maxDepth: 6, heading: null)
    }
    series(id: { eq: $seriesId }) {
      id
      title
    }
    video(id: { eq: $videoId }) {
      id
      title
      thumb
      url
    }
    allMarkdownRemark(
      filter: { frontmatter: { seriesId: { eq: $seriesId } } }
      sort: { order: ASC, fields: fields___date }
    ) {
      nodes {
        id
        fields {
          slug
          date
        }
        frontmatter {
          title
          seriesId
        }
      }
    }
  }
`
