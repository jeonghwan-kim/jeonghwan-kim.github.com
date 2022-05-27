import { Link } from "gatsby"
import _ from "lodash"
import React, { FC } from "react"
import { MarkdownRemark } from "../../../graphql-types"
import { getLinkHoverTitle } from "./helpers"
import * as Styled from "./style"

type CategoryListProps = {
  posts: MarkdownRemark[]
  activeCategory?: string
}

export const CategoryList: FC<CategoryListProps> = ({
  posts,
  activeCategory,
}) => {
  const postsWithCategory = posts.filter(post => post.frontmatter.category)

  let postsGroubyCategory: { [category: string]: MarkdownRemark[] } = {}

  postsWithCategory.forEach(post => {
    const { category } = post.frontmatter
    postsGroubyCategory[category] = postsGroubyCategory[category] || []
    postsGroubyCategory[category].push(post)
  })

  const postsSortByCategoryCount = _.orderBy(
    Object.entries(postsGroubyCategory).map(([category, posts]) => ({
      category,
      posts,
    })),
    entry => entry.posts.length,
    "desc"
  )

  return (
    <Styled.CategoryList>
      <Styled.CategoryListTitle>글분류</Styled.CategoryListTitle>
      <Styled.CategoryListItem>
        <Link
          to="/posts/"
          className={activeCategory === "모든글" ? "active" : ""}
        >
          <label>모든글</label>
          <span>{posts.length.toLocaleString()}</span>
        </Link>
      </Styled.CategoryListItem>
      {postsSortByCategoryCount.map(({ category, posts }) => (
        <Styled.CategoryListItem key={category}>
          <Link
            to={`/posts/?key=${encodeURIComponent(category)}`}
            className={category === activeCategory ? "active" : ""}
            title={getLinkHoverTitle(category, posts.length)}
          >
            <label>{category}</label>
            <span>{posts.length.toLocaleString()}</span>
          </Link>
        </Styled.CategoryListItem>
      ))}
    </Styled.CategoryList>
  )
}

type TagListProps = {
  posts: MarkdownRemark[]
  activeTag: string
}

export const TagList: FC<TagListProps> = ({ posts, activeTag }) => {
  let postsGroubyTag: { [tag: string]: MarkdownRemark[] } = {}

  posts.forEach(post => {
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

  return (
    <Styled.TagList>
      <Styled.TagListTitle>태그</Styled.TagListTitle>
      {postsSortByTagCount.map(({ tag, posts }) => (
        <Styled.TagListItem key={tag}>
          <Link
            to={`/posts/?tag=${encodeURIComponent(tag)}`}
            className={tag === activeTag ? "active" : ""}
            title={getLinkHoverTitle(tag, posts.length)}
          >
            #{tag}
          </Link>
        </Styled.TagListItem>
      ))}
    </Styled.TagList>
  )
}
