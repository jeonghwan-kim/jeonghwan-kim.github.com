import { graphql, Link } from "gatsby";
import React, { FC } from "react";
import Layout from "../../components/layout/layout";
import { MarkdownRemark } from "../../models/markdown-remark";
import { Site } from "../../models/site";
import SEO from '../../components/seo'
import PostComment from "./post-comment";
import PostShare from "./post-share";
import PostToc from "./post-toc";
import PostVideo from "./post-video";
import SeriesNav from "./series-nav";

import './index.scss';

interface P {
  data: {
    site: Site;
    markdownRemark: MarkdownRemark;
    allMarkdownRemark: {
      edges: {
        node: MarkdownRemark;
      }[]
    }
  }
  pageContext: {
    previous: MarkdownRemark;
    next: MarkdownRemark;
  }
}

const BlogPostTemplate: FC<P> = ({ data, pageContext}) => {

  console.log('data', data)

  const post = data.markdownRemark

  // todo 이전글, 다음글
  const { previous, next } = pageContext

  return (
    <Layout>
      <SEO  title={post.frontmatter.title}/>
      <article id="post" className="post container" itemScope itemType="http://schema.org/BlogPosting">
        <div className="flex">
          {(post.tableOfContents || post.frontmatter.seriesId || post.frontmatter.videoId) && (
            <aside className="post-aside">
              {post.tableOfContents && (
                <PostToc tableOfContents={post.tableOfContents} />
              )}
              {post.frontmatter.seriesId && (
                <SeriesNav lite nodeId={post.id} series={data.site.siteMetadata.series.filter(s => s.id === post.frontmatter.seriesId)[0]} posts={data.allMarkdownRemark.edges.map(e => e.node)} />
              )}
              {post.frontmatter.videoId && (
                <PostVideo videoId={post.frontmatter.videoId} videos={data.site.siteMetadata.videos} />

              )}
            </aside>
          )}
          <main className="post-container flex-1">
            <header className="mb-7 post-header">
              <h1 className="mt-0 mb-1 post-title" itemProp="name headline">{post.frontmatter.title}</h1>
              <div className="post-meta">
                <time className="date" itemProp="datePublished" dateTime={post.fields.date}>{post.fields.date}</time>
              </div>
            </header>
            <div className="post-content" itemProp="articleBody" dangerouslySetInnerHTML={{ __html: post.html }}></div>
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <div className="mt-7">
                <span className="post-tags">{post.frontmatter.tags.map(tag => {
                  return <><Link className="btn btn-secondary" data-tag-name={tag} to={`/tags/#${tag}`}>#{tag}</Link>{' '}</>
                })}</span>
              </div>
            )}
            <PostShare markdownRemark={post} siteMetadata={data.site.siteMetadata} />
          </main>
        </div>
        <footer className="post-footer footer-container py-10 mt-8">
          {post.frontmatter.seriesId && (
            <SeriesNav nodeId={post.id} series={data.site.siteMetadata.series.filter(s => s.id === post.frontmatter.seriesId)[0]} posts={data.allMarkdownRemark.edges.map(e => e.node)} />
          )}
          <PostComment markdownRemark={post} site={data.site} />
        </footer>
      </article>
      {/* {previous && <Link to={previous.fields.slug}>이전: {previous.frontmatter.title}</Link>}
      {next && <Link to={next.fields.slug}>다음: {next.frontmatter.title}</Link>} */}
    </Layout>
  )
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $seriesId: Int = 0) {
    site {
      siteMetadata {
        title
        url
        series {
          id
          title
        }
        videos {
          id
          url
          thumb
          title
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        date(formatString: "YYYY년 MM월 DD일")
        slug
        beforeGatsby
      }
      frontmatter {
        title
        tags
        seriesId
        videoId
      }
      tableOfContents(
        absolute: false
        maxDepth: 6
        heading: null
      )
    }
    allMarkdownRemark(filter: {frontmatter: {seriesId: {eq: $seriesId}}}, sort: {order: ASC, fields: fields___date}) {
      edges {
        node {
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
  }
`
