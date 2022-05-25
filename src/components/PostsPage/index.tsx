import { PageProps } from "gatsby"
import React, { FC, useEffect, useState } from "react"
import { Query } from "../../../graphql-types"
import { dateFormat } from "../../helpers/date"
import { Icon, IconType } from "../Icon/style"
import { TwoColumnLayout } from "../layout"
import PostList from "../PostList"
import Section from "../Section"
import SEO from "../SEO"
import PostsPageAside from "./PostsPageAside"
import { categoryMap } from "./helpers"
import * as Styled from "./style"

const PostsPage: FC<PageProps<Query>> = props => {
  const { data, location } = props

  const posts = data.allMarkdownRemark.edges.map(edge => edge.node)

  const [renderedPosts, setRenderedPosts] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeTag, setActiveTag] = useState(null)

  useEffect(() => {
    const key = new URLSearchParams(location.search).get("key")
    const tag = new URLSearchParams(location.search).get("tag")
    setActiveCategory(key)
    setActiveTag(key ? "" : tag)
  }, [location.search])

  useEffect(() => {
    setRenderedPosts(
      activeCategory
        ? posts.filter(p => p.frontmatter.category === activeCategory)
        : activeTag
        ? posts.filter(p => p.frontmatter.tags?.includes(activeTag))
        : posts
    )
  }, [activeCategory, activeTag])

  return (
    <TwoColumnLayout
      aside={
        <PostsPageAside
          {...props}
          activeCategory={activeCategory}
          activeTag={activeTag}
        />
      }
    >
      <SEO title={`분류: ${categoryMap[activeCategory] || "모든글"}`} />
      <Styled.Wrapper>
        <Section
          title={
            <>
              {!activeCategory && activeTag ? (
                <Icon type={IconType.Tag} size={4} />
              ) : (
                <Icon type={IconType.Article} size={4} />
              )}
              {activeCategory || activeTag || "모든글"}
            </>
          }
        >
          <PostList
            posts={renderedPosts.map(p => ({
              slug: p.frontmatter.slug,
              title: p.frontmatter.title,
              meta: (
                <time dateTime={p.frontmatter.date}>
                  {dateFormat(p.frontmatter.date)}
                </time>
              ),
              excerpt: p.excerpt,
            }))}
          />
        </Section>
      </Styled.Wrapper>
    </TwoColumnLayout>
  )
}

export default PostsPage
