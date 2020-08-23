import { graphql, Link, PageProps } from "gatsby"
import React from "react"
import Content, { Section } from "../components/content"
import Icon from "../components/icon"
import Layout from "../components/layout/layout"
import SEO from "../components/seo"
import { MarkdownRemark } from "../models/markdown-remark"
import "./tags.scss"

type P = PageProps<{
  site: any
  allMarkdownRemark: { nodes: MarkdownRemark[] }
}>

const TagPage: React.FC<P> = ({ data }) => {
  const d1: {
    [k in string]: { link: string; title: string; date: string }[]
  } = {}

  data.allMarkdownRemark.nodes.forEach(node => {
    const { tags } = node.frontmatter
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        const { date, slug } = node.fields
        const { permalink, category, title } = node.frontmatter
        const link = permalink || `/${category}${slug}`
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
    <Layout hasHeaderBorder>
      <SEO
        title="태그"
        url={`${data.site.siteMetadata.url}/tags`}
        description="태그 목록입니다"
      />
      <Content className="container-sm">
        <Section
          title={
            <>
              <Icon type="tag" size={4} />
              태그
            </>
          }
        >
          <div className="tag-list">
            {d2.map(item => {
              return (
                <div className="tag-item">
                  <h2 id={item.tag}>
                    <Link to={`#${item.tag}`} className="tag-title-link">
                      #{item.tag}
                    </Link>
                  </h2>
                  <ul className="post-list">
                    {item.node
                      .sort((a, b) => {
                        return a.date > b.date ? -1 : 1
                      })
                      .map(node => {
                        return (
                          <li key={node.link}>
                            <Link to={node.link}>{node.title}</Link>
                          </li>
                        )
                      })}
                  </ul>
                </div>
              )
            })}
          </div>
        </Section>
      </Content>
    </Layout>
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
          tags
          title
          permalink
          category
        }
        fields {
          slug
          date
        }
      }
    }
  }
`
