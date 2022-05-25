import { Link, PageProps } from "gatsby"
import _ from "lodash"
import React, { FC } from "react"
import { Query, MarkdownRemark } from "../../../../graphql-types"
import { getLinkHoverTitle } from "../helpers"
import * as Styled from "../style"

type TagListProps = PageProps<Query> & {
  activeCategory: string
  activeTag: string
}

const TagList: FC<TagListProps> = ({ data, activeTag }) => {
  const postsWithTags = data.allMarkdownRemark.edges
    .map(edge => edge.node)
    .filter(post => post.frontmatter.tags)
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

export default TagList
