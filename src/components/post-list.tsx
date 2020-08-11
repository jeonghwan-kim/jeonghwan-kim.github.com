import React, { FC, ReactNode } from "react";
import { MarkdownRemark, Frontmatter, Fields } from "../models/markdown-remark";
import { Link } from "gatsby";

import './post-list.scss'

export interface PostItemType {
  title: ReactNode;
  slug: string;
  meta?: ReactNode;
  excerpt?: string;
}
export interface P {
  posts: PostItemType[]
}

const PostList: FC<P> = ({posts}) => {
  return(
    <ul id="post-list" className="post-list">
      {posts.map(({title, slug, meta, excerpt}) => {
        return (
          <li key={slug} className="post-item" >
            <Link to={slug}>
              <h2 className="post-item-title">{title}</h2>
              {meta && (
                <div className="post-item-meta">{meta}</div>

              )}
              {excerpt && (
                <p
                className="post-item-summary"
                dangerouslySetInnerHTML={{
                  __html: excerpt,
                }}
              ></p>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default PostList;
