import { Link, PageProps } from "gatsby"
import _ from "lodash"
import React, { FC } from "react"
import {
  MarkdownRemark,
  MarkdownRemarkFrontmatterFilterInput,
  Query,
} from "../../../../graphql-types"
import { getLinkHoverTitle } from "../helpers"
import * as Styled from "../style"

type CategoryListProps = PageProps<Query> & {
  activeCategory?: string
}

const CategoryList: FC<CategoryListProps> = ({ data, activeCategory }) => {
  const allPosts = data.allMarkdownRemark.edges.map(edge => edge.node)
  const postsWithCategory = allPosts.filter(post => post.frontmatter.category)

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
          <span>{allPosts.length.toLocaleString()}</span>
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

export default CategoryList
