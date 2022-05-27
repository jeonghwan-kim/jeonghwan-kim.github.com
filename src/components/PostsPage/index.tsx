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
import * as Styled from "./style"

const PostsPage: FC<PageProps<Query>> = props => {
  const { data, location } = props

  const posts = data.allMarkdownRemark.edges.map(edge => edge.node)

  const [renderedPosts, setRenderedPosts] = useState([])

  const [activeType, setActiveType] = useState<"category" | "tag">()
  const [activeKey, setActiveKey] = useState<string>()

  useEffect(() => {
    const key = new URLSearchParams(location.search).get("key")
    const tag = new URLSearchParams(location.search).get("tag")

    setActiveType(key ? "category" : tag ? "tag" : "category")
    setActiveKey(key ? key : tag ? tag : "모든글")
  }, [location.search])

  console.log({ activeType, activeKey })

  useEffect(() => {
    setRenderedPosts(
      activeType === "category" && activeKey !== "모든글"
        ? posts.filter(p => p.frontmatter.category === activeKey)
        : activeType === "tag"
        ? posts.filter(p => p.frontmatter.tags?.includes(activeKey))
        : posts
    )
  }, [activeType, activeKey])

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
      {activeKey && (
        <SEO title={`${activeType === "tag" ? "#" : ""}${activeKey}`} />
      )}
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
