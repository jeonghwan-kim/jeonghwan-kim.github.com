import { Link } from "gatsby"
import React, { FC, ReactNode } from "react"
import * as Styled from "./style"

export interface PostItemType {
  title: ReactNode
  slug: string
  meta?: ReactNode
  excerpt?: string
}
export interface P {
  posts: PostItemType[]
}

const PostList: FC<P> = ({ posts }) => {
  return (
    <Styled.PostList id="post-list">
      {posts.map(({ title, slug, meta, excerpt }) => {
        return (
          <Styled.PostItem key={slug}>
            <Link to={slug}>
              <Styled.PostTitle className="post-item-title">
                {title}
              </Styled.PostTitle>
              {meta && <Styled.PostMeta>{meta}</Styled.PostMeta>}
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
