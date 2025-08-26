import React from "react"
import Button from "../../components/Button"
import { ButtonType } from "../../components/Button/style"
import { Params, Path } from "../../helpers/constants"
import * as Styled from "./style"
import { Maybe } from "../../../graphql-types"

interface P {
  tags: Maybe<string>[]
}

const PostTag: React.FC<P> = ({ tags }) => {
  const validTags = tags.map(tag => tag ?? "").filter(Boolean)

  return (
    <Styled.TagList>
      {validTags.map(tag => {
        return (
          <Styled.TagItem key={tag}>
            <Button
              link
              type={ButtonType.Secondary}
              to={`/tag/${encodeURIComponent(tag)}`}
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
