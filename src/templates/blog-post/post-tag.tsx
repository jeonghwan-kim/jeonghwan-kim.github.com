import React from "react"
import Button from "../../components/Button"
import { ButtonType } from "../../components/Button/style"
import { Params, Path } from "../../helpers/constants"
import * as Styled from "./style"

interface P {
  tags: string[]
}

const PostTag: React.FC<P> = ({ tags }) => {
  return (
    <Styled.TagList>
      {tags.map(tag => {
        return (
          <Styled.TagItem key={tag}>
            <Button
              type={ButtonType.Secondary}
              link
              to={`${Path.Posts}?${Params.Tag}=${encodeURIComponent(tag)}`}
            >
              #{tag}
            </Button>
          </Styled.TagItem>
        )
      })}
    </Styled.TagList>
  )
}

export default PostTag
