import React from "react"
import Button from "../../components/button"

import "./post-tag.scss"

interface P {
  tags: string[]
}

const PostTag: React.FC<P> = ({ tags }) => {
  return (
    <ul className="post-tag">
      {tags.map(tag => {
        return (
          <li>
            <Button type="secondary" link to={`/tags/#${tag}`}>
              #{tag}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

export default PostTag
