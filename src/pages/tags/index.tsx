import { graphql, Link, PageProps } from "gatsby"
import React from "react"
import { Query } from "../../../graphql-types"
import Icon from "../../components/Icon"
import { IconType } from "../../components/Icon/style"
import { PlainLayout } from "../../components/layout"
import Section from "../../components/Section"
import SEO from "../../components/SEO"
import * as Styled from "../../components/Tag/style"
import { Container } from "../../styles/style-variables"

type Props = PageProps<Query>

const TagPage: React.FC<Props> = ({ data }) => {
  const d1: {
    [k in string]: { link: string; title: string; date: string }[]
  } = {}

  data.allMarkdownRemark.nodes.forEach(node => {
    const { tags } = node.frontmatter
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        const { slug, date, title } = node.frontmatter
        if (!d1[tag]) {
          d1[tag] = []
        }
        d1[tag].push({ link: slug, date, title })
      })
    }
  })

  let d2 = []
  for (const item in d1) {
    d2.push({
      tag: item,
      node: d1[item],
    })
  }
  d2.sort((a, b) => {
    return a.tag.toLowerCase() > b.tag.toLowerCase() ? 1 : -1
  })

  return (
    <PlainLayout>
      <SEO
        title="태그"
        url={`${data.site.siteMetadata.url}/tags`}
        description="태그 목록입니다"
      />
      <Container small>
        <Section
          title={
            <>
              <Icon type={IconType.Tag} size={4} />
              태그
            </>
          }
        >
          {d2.map(item => {
            return (
              <Styled.TagItem key={item.tag}>
                <Styled.TagName id={item.tag}>
                  <Link to={`#${item.tag}`} className="tag-title-link">
                    #{item.tag}
                  </Link>
                </Styled.TagName>
                <Styled.TagPostList>
                  {item.node
                    .sort((a, b) => {
                      return a.date > b.date ? -1 : 1
                    })
                    .map(node => {
                      return (
                        <Styled.TagPostItem key={node.link}>
                          <Link to={node.link}>{node.title}</Link>
                        </Styled.TagPostItem>
                      )
                    })}
                </Styled.TagPostList>
              </Styled.TagItem>
            )
          })}
        </Section>
      </Container>
    </PlainLayout>
  )
}

export default TagPage

export const data = graphql`
  query {
    site {
      siteMetadata {
        url
      }
    }
    allMarkdownRemark {
      nodes {
        frontmatter {
          slug
          tags
          title
          category
        }
      }
    }
  }
`
