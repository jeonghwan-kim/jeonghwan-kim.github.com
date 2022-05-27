import { PageProps } from "gatsby"
import React, { FC, useEffect } from "react"
import { Query } from "../../../graphql-types"
import { dateFormat } from "../../helpers/date"
import { Icon, IconType } from "../Icon/style"
import { TwoColumnLayout } from "../layout"
import PostList from "../PostList"
import Section from "../Section"
import SEO from "../SEO"
import { useStore } from "./hooks"
import PostsPageAside from "./PostsPageAside"
import * as Styled from "./style"

const PostsPage: FC<PageProps<Query>> = props => {
  const { data, location } = props

  const {
    activeKey,
    activeType,
    renderedPosts,
    setActive,
    setPosts,
  } = useStore()

  useEffect(() => {
    const key = new URLSearchParams(location.search).get("key")
    const tag = new URLSearchParams(location.search).get("tag")
    setActive(key, tag)
  }, [location.search])

  useEffect(() => {
    const posts = data.allMarkdownRemark.edges.map(edge => edge.node)
    setPosts(posts)
  }, [activeType, activeKey])

  const seoTitle = `${activeType === "tag" ? "#" : ""}${activeKey}`

  return (
    <TwoColumnLayout
      aside={
        <PostsPageAside
          {...props}
          activeType={activeType}
          activeKey={activeKey}
        />
      }
    >
      {activeKey && <SEO title={seoTitle} />}
      <Styled.Wrapper>
        <Section
          title={
            <>
              {activeType === "category" && (
                <Icon type={IconType.Article} size={4} />
              )}
              {activeType === "tag" && <Icon type={IconType.Tag} size={4} />}
              {activeKey}
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
