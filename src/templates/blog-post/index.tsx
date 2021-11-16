import { graphql } from "gatsby"
import React, { FC } from "react"
import {
  MarkdownRemarkEdge,
  Query,
  SitePageContext,
} from "../../../graphql-types"
import { PlainLayout } from "../../components/layout"
import Section from "../../components/Section"
import SEO from "../../components/SEO"
import { dateFormat } from "../../helpers/date"
import { Container } from "../../styles/style-variables"
import PostComment from "./post-comment"
import PostShare from "./post-share"
import PostTag from "./post-tag"
import PostToc from "./post-toc"
import PostVideo from "./post-video"
import PostHeader from "./PostHeader"
import SeriesNav from "./series-nav"
import SiblingNav from "./sibling-nav"
import * as Styled from "./style"

interface Props {
  data: Query
  pageContext: MarkdownRemarkEdge
}

const BlogPostTemplate: FC<Props> = ({ data, pageContext }) => {
  const { site, markdownRemark, series, video } = data
  const { previous, next } = pageContext
  const hasAside = markdownRemark.tableOfContents || series || video
  return (
    <PlainLayout>
      <SEO
        title={markdownRemark.frontmatter.title}
        description={markdownRemark.excerpt}
        date={markdownRemark.fields.date}
        url={site.siteMetadata.url + markdownRemark.fields.slug}
        image={
          markdownRemark.frontmatter.featured_image ||
          markdownRemark.frontmatter.featuredImage?.childImageSharp
            ?.gatsbyImageData.src
        }
      />
      <Container small={!hasAside}>
        <div itemScope itemType="http://schema.org/BlogPosting">
          <Section>
            <Styled.Main>
              {hasAside && (
                <Styled.Aside>
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
                </Styled.Aside>
              )}
              <Styled.Article>
                <PostHeader
                  title={markdownRemark.frontmatter.title}
                  datetime={dateFormat(markdownRemark.fields.date)}
                />
                <Styled.PostContent
                  id="post-content"
                  itemProp="articleBody"
                  dangerouslySetInnerHTML={{ __html: markdownRemark.html }}
                />
                <Styled.PostMeta>
                  {(markdownRemark.frontmatter.tags || []).length > 0 && (
                    <PostTag tags={markdownRemark.frontmatter.tags} />
                  )}
                  <PostShare
                    markdownRemark={markdownRemark}
                    siteMetadata={data.site.siteMetadata}
                  />
                </Styled.PostMeta>
              </Styled.Article>
            </Styled.Main>
          </Section>
          <Section>
            <Container small>
              <footer>
                <SiblingNav previous={previous} next={next} />
                {series && (
                  <SeriesNav
                    className="mb-4"
                    series={series}
                    nodeId={markdownRemark.id}
                    posts={data.allMarkdownRemark.nodes}
                  />
                )}
                <PostComment />
              </footer>
            </Container>
          </Section>
        </div>
      </Container>
    </PlainLayout>
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
      excerpt(pruneLength: 160, truncate: true)
      html
      fields {
        dateStr: date(formatString: "YYYY년 MM월 DD일")
        date
        slug
      }
      frontmatter {
        title
        tags
        seriesId
        videoId
        featured_image
        featuredImage {
          childImageSharp {
            gatsbyImageData(width: 300, layout: CONSTRAINED)
          }
        }
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
      sort: { order: ASC, fields: [frontmatter___date] }
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
