import { graphql, Link } from "gatsby";
import React, { FC } from "react";
import Layout from "../../components/layout/layout";
import { MarkdownRemark } from "../../models/markdown-remark";
import { Site, Series, Video } from "../../models/site";
import SEO from '../../components/seo'
import PostComment from "./post-comment";
import PostShare from "./post-share";
import PostToc from "./post-toc";
import PostVideo from "./post-video";
import SeriesNav from "./series-nav";

import './blog-post.scss';

interface P {
  data: {
    site: Site;
    markdownRemark: MarkdownRemark;
    allMarkdownRemark: {
      nodes: MarkdownRemark[];
    }
    series: Series;
    video: Video;
  }
  pageContext: {
    previous: MarkdownRemark;
    next: MarkdownRemark;
  }
}

const BlogPostTemplate: FC<P> = ({ data, pageContext}) => {

  console.log('data', data)

  const {markdownRemark, series, video} = data

  // todo 이전글, 다음글
  const { previous, next } = pageContext

  return (
    <Layout>
      <SEO  title={markdownRemark.frontmatter.title}/>
      <article id="post" className="post container" itemScope itemType="http://schema.org/BlogPosting">
        <div className="flex">
          {(markdownRemark.tableOfContents || series || video) && (
            <aside className="post-aside">
              {markdownRemark.tableOfContents && (
                <PostToc tableOfContents={markdownRemark.tableOfContents} />
              )}
              {series && (
                <SeriesNav lite series={series} nodeId={markdownRemark.id} posts={data.allMarkdownRemark.nodes} />
              )}
              {video && <PostVideo video={video} />}
            </aside>
          )}
          <main className="post-container flex-1">
            <header className="mb-7 post-header">
              <h1 className="mt-0 mb-1 post-title" itemProp="name headline">{markdownRemark.frontmatter.title}</h1>
              <div className="post-meta">
                <time className="date" itemProp="datePublished" dateTime={markdownRemark.fields.date}>{markdownRemark.fields.date}</time>
              </div>
            </header>
            <div className="post-content" itemProp="articleBody" dangerouslySetInnerHTML={{ __html: markdownRemark.html }}></div>
            {markdownRemark.frontmatter.tags && markdownRemark.frontmatter.tags.length > 0 && (
              <div className="mt-7">
                <span className="post-tags">{markdownRemark.frontmatter.tags.map(tag => {
                  return <><Link className="btn btn-secondary" data-tag-name={tag} to={`/tags/#${tag}`}>#{tag}</Link>{' '}</>
                })}</span>
              </div>
            )}
            <PostShare markdownRemark={markdownRemark} siteMetadata={data.site.siteMetadata} />
          </main>
        </div>
        <footer className="post-footer footer-container py-10 mt-8">
          {series && (
            <SeriesNav series={series} nodeId={markdownRemark.id}  posts={data.allMarkdownRemark.nodes} />
            )}
          {/* {previous && <Link to={previous.fields.slug}>← {previous.frontmatter.title}</Link>}
          {next && <Link to={next.fields.slug}>{next.frontmatter.title} →</Link>} */}
          <PostComment markdownRemark={markdownRemark} site={data.site} />
        </footer>
      </article>
    </Layout>
  )
}

export default BlogPostTemplate;

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
    series(id: {eq: $seriesId}) {
      id
      title
    }
    video(id: {eq: $videoId}) {
      id
      title
      thumb
      url
    }
    allMarkdownRemark(filter: {frontmatter: {seriesId: {eq: $seriesId}}}, sort: {order: ASC, fields: fields___date}) {
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
