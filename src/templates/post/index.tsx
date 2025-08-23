import { graphql } from "gatsby"
import React from "react"
import { MarkdownRemarkEdge, Query } from "../../../graphql-types"
import { Layout } from "../../components/Layout"
import Section from "../../components/Section"
import SEO from "../../components/SEO"
import { dateFormat } from "../../helpers/date"
import { Container } from "../../styles/style-variables"
import PostComment from "./PostComment"
import PostTag from "./post-tag"
import PostToc from "./post-toc"
import PostHeader from "./PostHeader"
import SeriesNav from "./series-nav"
import SiblingNav from "./sibling-nav"
import * as Styled from "./style"
import GoogleAdsense from "../../components/GoogleAdsense"

interface Props {
  data: Query & { allPosts: Query["allMarkdownRemark"] }
  pageContext: MarkdownRemarkEdge
}

export default function PostTemplate({ data, pageContext }: Props) {
  const { site, markdownRemark, video, allPosts } = data
  const { previous, next } = pageContext

  if (!markdownRemark) {
    return (
      <Layout data={data.allMarkdownRemark.nodes}>
        <Section>
          <Container>
            <p>포스트를 찾을 수 없습니다.</p>
          </Container>
        </Section>
      </Layout>
    )
  }

  const { frontmatter, tableOfContents, excerpt, id, html } = markdownRemark

  return (
    <Layout data={allPosts.nodes}>
      <SEO
        title={frontmatter?.title || ""}
        description={excerpt || ""}
        date={frontmatter?.date}
        url={`${site?.siteMetadata?.url}${frontmatter?.slug}`}
        image={frontmatter?.featuredImage?.childImageSharp?.fixed?.src}
      />

      <GoogleAdsense />

      <Container>
        <div itemScope itemType="http://schema.org/BlogPosting">
          <Section>
            <Styled.Main>
              <Styled.Article>
                <PostHeader
                  title={frontmatter?.title || ""}
                  datetime={dateFormat(frontmatter?.date)}
                />

                {tableOfContents && (
                  <PostToc tableOfContents={tableOfContents} />
                )}

                <Styled.PostContent
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
    </Layout>
  )
}

export const query = graphql`
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

    # 전체 포스트
    allPosts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        frontmatter {
          slug
          date
          title
          category
          tags
          series
        }
      }
    }
  }
`
