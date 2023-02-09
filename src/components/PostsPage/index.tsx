import { PageProps } from "gatsby"
import React, { FC, useEffect } from "react"
import { Query } from "../../../graphql-types"
import { Params } from "../../helpers/constants"
import GoogleAdsense from "../GoogleAdsense"
import { Icon, IconType } from "../Icon/style"
import { TwoColumnLayout } from "../layout"
import PostList from "../PostList"
import Section from "../Section"
import SEO from "../SEO"
import { ArchiveList, SeriesList, TagList } from "./aside"
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
    const year = new URLSearchParams(location.search).get(Params.Year)
    const tag = new URLSearchParams(location.search).get(Params.Tag)
    const series = new URLSearchParams(location.search).get(Params.Series)
    setActive(year, tag, series)
  }, [location.search])

  useEffect(() => {
    setPosts(posts)
  }, [activeType, activeKey])

  const seoTitle = activeKey
    ? `${activeType === "tag" ? "#" : ""}${activeKey}`
    : null

  const sectionTitle = (
    <>
      {activeType === "year" && <Icon type={IconType.Article} size={4} />}
      {activeType === "tag" && <Icon type={IconType.Tag} size={4} />}
      {activeKey}
    </>
  )

  return (
    <TwoColumnLayout
      aside={
        <Styled.Wrapper>
          <ArchiveList
            posts={posts}
            activeYear={activeType === "year" ? activeKey : null}
          />
          <TagList
            posts={posts.filter(post => post.frontmatter.tags)}
            activeTag={activeType === "tag" ? activeKey : null}
          />
          <SeriesList
            posts={posts}
            activeSeries={activeType === "series" ? activeKey : null}
          />
        </Styled.Wrapper>
      }
    >
      {seoTitle && <SEO title={seoTitle} />}
      <GoogleAdsense />
      <Styled.Wrapper>
        <Section title={sectionTitle}>
          <PostList posts={renderedPosts} />
        </Section>
      </Styled.Wrapper>
    </TwoColumnLayout>
  )
}

export default PostsPage
