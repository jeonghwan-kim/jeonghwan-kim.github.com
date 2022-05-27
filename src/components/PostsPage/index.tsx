import { PageProps } from "gatsby"
import React, { FC, useEffect } from "react"
import { Query } from "../../../graphql-types"
import { Params } from "../../helpers/constants"
import { Icon, IconType } from "../Icon/style"
import { TwoColumnLayout } from "../layout"
import PostList from "../PostList"
import Section from "../Section"
import SEO from "../SEO"
import { CategoryList, TagList } from "./aside"
import { useStore } from "./hooks"
import * as Styled from "./style"

const PostsPage: FC<PageProps<Query>> = props => {
  const { data, location } = props
  const posts = data.allMarkdownRemark.edges.map(edge => edge.node)

  const {
    activeKey,
    activeType,
    renderedPosts,
    setActive,
    setPosts,
  } = useStore()

  useEffect(() => {
    const category = new URLSearchParams(location.search).get(Params.Category)
    const tag = new URLSearchParams(location.search).get(Params.Tag)
    setActive(category, tag)
  }, [location.search])

  useEffect(() => {
    setPosts(posts)
  }, [activeType, activeKey])

  const seoTitle = activeKey
    ? `${activeType === "tag" ? "#" : ""}${activeKey}`
    : null

  const sectionTitle = (
    <>
      {activeType === "category" && <Icon type={IconType.Article} size={4} />}
      {activeType === "tag" && <Icon type={IconType.Tag} size={4} />}
      {activeKey}
    </>
  )

  return (
    <TwoColumnLayout
      aside={
        <Styled.Wrapper>
          <CategoryList
            posts={posts}
            activeCategory={activeType === "category" ? activeKey : null}
          />
          <TagList
            posts={posts.filter(post => post.frontmatter.tags)}
            activeTag={activeType === "tag" ? activeKey : null}
          />
        </Styled.Wrapper>
      }
    >
      {seoTitle && <SEO title={seoTitle} />}
      <Styled.Wrapper>
        <Section title={sectionTitle}>
          <PostList posts={renderedPosts} />
        </Section>
      </Styled.Wrapper>
    </TwoColumnLayout>
  )
}

export default PostsPage
