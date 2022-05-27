import { Link } from "gatsby"
import React, { FC, ReactNode } from "react"
import { MarkdownRemark } from "../../../graphql-types"
import { dateFormat } from "../../helpers/date"
import * as Styled from "./style"

type Post = Pick<MarkdownRemark, "frontmatter" | "excerpt">

export interface PostListProps {
  posts: Post[]
  renderMeta?(post: Post): ReactNode
}

const PostList: FC<PostListProps> = ({ posts, renderMeta }) => {
  return (
    <Styled.PostList id="post-list">
      {posts.map(post => {
        const { frontmatter, excerpt } = post
        const { slug, date, title } = frontmatter
        return (
          <Styled.PostItem key={slug}>
            <Link to={slug}>
              <Styled.PostTitle className="post-item-title">
                {title}
              </Styled.PostTitle>
              {date && (
                <Styled.PostMeta>
                  {renderMeta ? (
                    renderMeta(post)
                  ) : (
                    <time dateTime={date}>{dateFormat(date)}</time>
                  )}
                </Styled.PostMeta>
              )}
              {excerpt && (
                <Styled.PostSummary
                  dangerouslySetInnerHTML={{
                    __html: excerpt,
                  }}
                />
              )}
            </Link>
          </Styled.PostItem>
        )
      })}
    </Styled.PostList>
  )
}

export default PostList
