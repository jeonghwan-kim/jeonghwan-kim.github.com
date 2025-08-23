import { Link } from "gatsby"
import React, { FC } from "react"
import { MarkdownRemark } from "../../../graphql-types"
import * as Styled from "./style"
import dayjs from "dayjs"

export interface PostListProps {
  posts: Pick<MarkdownRemark, "frontmatter">[]
}

const PostList: FC<PostListProps> = ({ posts }) => {
  return (
    <Styled.PostList>
      {posts
        .map(post => {
          const { frontmatter } = post
          if (!frontmatter) return

          const { slug, date, title } = frontmatter
          if (!slug || !date || !title) return

          return (
            <Styled.PostItem key={slug}>
              <Link to={slug}>
                <Styled.PostTitle>{title}</Styled.PostTitle>
                <Styled.PostMeta>
                  <time dateTime={date}>
                    {dayjs(date).format("YYYY년 M월 D일")}
                  </time>
                </Styled.PostMeta>
              </Link>
            </Styled.PostItem>
          )
        })
        .filter(Boolean)}
    </Styled.PostList>
  )
}

export default PostList
