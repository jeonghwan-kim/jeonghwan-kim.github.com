import { Link } from "gatsby"
import _ from "lodash"
import React, { FC } from "react"
import { MarkdownRemark } from "../../../graphql-types"
import { dateFormat } from "../../helpers/date"
import { Icon, IconType } from "../Icon/style"
import { TwoColumnLayout } from "../layout"
import PostList from "../PostList"
import Section from "../Section"
import SEO from "../SEO"
import * as Styled from "./style"

const categoryMap = {
  series: "연재물",
  dev: "개발",
  think: "생각",
}

const getLinkHoverTitle = (name, count) =>
  `${name} ${count.toLocaleString()}개 글`

interface Props {
  posts: MarkdownRemark[]
}

export const CateogryPosts: FC<Props> = ({ posts }) => {
  const activeCategory =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("key")
      : null

  const activeTag =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("tag")
      : null

  const renderedPosts = activeCategory
    ? posts.filter(p => p.frontmatter.category === activeCategory)
    : activeTag
    ? posts.filter(p => p.frontmatter.tags?.includes(activeTag))
    : posts

  const postsWithTags = posts.filter(post => post.frontmatter.tags)
  let postsGroubyTag: { [tag: string]: MarkdownRemark[] } = {}

  postsWithTags.forEach(post => {
    const tags = post.frontmatter.tags
    tags.forEach(tag => {
      postsGroubyTag[tag] = postsGroubyTag[tag] || []
      postsGroubyTag[tag].push(post)
    })
  })

  const postsSortByTagCount = _.orderBy(
    Object.entries(postsGroubyTag).map(([tag, posts]) => ({ tag, posts })),
    entry => entry.posts.length,
    "desc"
  )

  const aside = (
    <Styled.Wrapper>
      <Styled.CategoryList>
        <Styled.CategoryListTitle>글분류</Styled.CategoryListTitle>
        <Styled.CategoryListItem>
          <Link
            to="/category"
            className={!activeCategory && !activeTag ? "active" : ""}
          >
            모든글
          </Link>
        </Styled.CategoryListItem>
        {Object.keys(categoryMap).map(c => (
          <Styled.CategoryListItem key={c}>
            <Link
              to={`/category?key=${c}`}
              className={c === activeCategory ? "active" : ""}
            >
              {categoryMap[c]}
            </Link>
          </Styled.CategoryListItem>
        ))}
      </Styled.CategoryList>
      <Styled.TagList>
        <Styled.TagListTitle>태그</Styled.TagListTitle>
        {postsSortByTagCount.map(({ tag, posts }) => (
          <Styled.TagListItem key={tag}>
            <Link
              to={`/category?tag=${tag}`}
              className={tag === activeTag ? "active" : ""}
              title={getLinkHoverTitle(tag, posts.length)}
            >
              #{tag}
            </Link>
          </Styled.TagListItem>
        ))}
      </Styled.TagList>
    </Styled.Wrapper>
  )

  return (
    <TwoColumnLayout aside={aside}>
      <SEO title={`분류: ${categoryMap[activeCategory] || "모든글"}`} />
      <Styled.Wrapper>
        <Section
          title={
            <>
              <Icon type={IconType.Article} size={4} />
              {categoryMap[activeCategory] || "모든글"}
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
