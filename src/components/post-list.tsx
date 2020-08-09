import React, { FC } from "react";
import { MarkdownRemark } from "../models/markdown-remark";
import { Link } from "gatsby";

import './post-list.scss'

interface P {
  posts: MarkdownRemark[]
}

const PostList: FC<P> = ({posts}) => {
  return(
    <ul id="post-list" className="post-list">
      {posts.map(({frontmatter, fields, excerpt}) => {
          const title = frontmatter.title || fields.slug;

          return (
            <li key={fields.slug}>
              <Link className="post-item my-7" to={fields.slug}>
                <h2 className="post-item-title mb-0">{title}</h2>
                <p className="post-meta mt-1">{fields.date}</p>
                <p
                  className="post-summary"
                  dangerouslySetInnerHTML={{
                    __html: frontmatter.description || excerpt,
                  }}
                ></p>
              </Link>
            </li>
          )
        })}
    </ul>
  )
}

export default PostList;
