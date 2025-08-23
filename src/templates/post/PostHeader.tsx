import React, { FC } from "react"
import * as Styled from "./style"

interface PostHeaderProps {
  title: string
  datetime: string
}

const PostHeader: FC<PostHeaderProps> = ({ title, datetime }) => {
  return (
    <Styled.PostHeader>
      <Styled.PostTitle itemProp="name headline">{title}</Styled.PostTitle>
      <Styled.PostTime itemProp="datePublished">{datetime}</Styled.PostTime>
    </Styled.PostHeader>
  )
}

export default PostHeader
