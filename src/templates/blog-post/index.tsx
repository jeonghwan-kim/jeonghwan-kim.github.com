import { graphql } from "gatsby"
import React, { FC } from "react"
import { MarkdownRemarkEdge, Query } from "../../../graphql-types"
import { PlainLayout } from "../../components/layout"
import Section from "../../components/Section"
import SEO from "../../components/SEO"
import { dateFormat } from "../../helpers/date"
import { Container } from "../../styles/style-variables"
import PostComment from "./PostComment"
import PostTag from "./post-tag"
import PostToc from "./post-toc"
import PostVideo from "./post-video"
import PostHeader from "./PostHeader"
import SeriesNav from "./series-nav"
import SiblingNav from "./sibling-nav"
import * as Styled from "./style"
import GoogleAdsense from "../../components/GoogleAdsense"

interface Props {
  // 쿼리 결과(pageQuery)가 데이터로 주입될 것이다.
  data: Query
  pageContext: MarkdownRemarkEdge
}

const BlogPostTemplate: FC<Props> = ({ data, pageContext }) => {
  const { site, markdownRemark, video } = data
  const { previous, next } = pageContext

  if (!markdownRemark) {
    return (
      <PlainLayout>
        <Section>
          <Container>
            <p>포스트를 찾을 수 없습니다.</p>
          </Container>
        </Section>
      </PlainLayout>
    )
  }

  const { frontmatter, tableOfContents, excerpt, id, html } = markdownRemark
  const hasAside = tableOfContents || frontmatter?.series || video

  return (
    <PlainLayout>
      <SEO
        title={frontmatter?.title || ""}
        description={excerpt || ""}
        date={frontmatter?.date}
        url={`${site?.siteMetadata?.url}${frontmatter?.slug}`}
        image={frontmatter?.featuredImage?.childImageSharp?.fixed?.src}
      />

      <GoogleAdsense />

      <Container small={!hasAside}>
        <div itemScope itemType="http://schema.org/BlogPosting">
          <Section>
            <Styled.Main>
              {hasAside && (
                <Styled.Aside>
                  {tableOfContents && (
                    <PostToc tableOfContents={tableOfContents} />
                  )}
                  {frontmatter?.series && (
                    <SeriesNav
                      lite
                      series={frontmatter.series}
                      nodeId={id}
                      posts={data.allMarkdownRemark.nodes}
                    />
                  )}
                  {video && <PostVideo video={video} />}
                </Styled.Aside>
              )}

              <Styled.Article>
                <PostHeader
                  title={frontmatter?.title || ""}
                  datetime={dateFormat(frontmatter?.date)}
                />
                <Styled.PostContent
                  id="post-content"
                  itemProp="articleBody"
                  dangerouslySetInnerHTML={{
                    __html: html ?? "",
                  }}
                />
                <Styled.PostMeta>
                  {frontmatter?.tags?.length && (
                    <PostTag tags={frontmatter.tags} />
                  )}
                </Styled.PostMeta>
              </Styled.Article>
            </Styled.Main>
          </Section>

          <Section>
            <Container small>
              <footer>
                <SiblingNav previous={previous} next={next} />
                {frontmatter?.series && (
                  <SeriesNav
                    className="mb-4"
                    series={frontmatter.series}
                    nodeId={id}
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
  query BlogPostBySlug($slug: String!, $series: String, $videoId: String) {
    site {
      siteMetadata {
        title
        url
      }
    }
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        slug
        date
        title
        tags
        series
        videoId
        featuredImage {
          childImageSharp {
            fixed(width: 300) {
              src
            }
          }
        }
      }
      tableOfContents(absolute: false, maxDepth: 6, heading: null)
      excerpt(pruneLength: 200)
    }
    video(id: { eq: $videoId }) {
      id
      title
      thumb
      url
    }
    allMarkdownRemark(
      filter: { frontmatter: { series: { eq: $series } } }
      sort: { order: ASC, fields: [frontmatter___date] }
    ) {
      nodes {
        id
        frontmatter {
          slug
          date
          title
          series
        }
      }
    }
  }
`
