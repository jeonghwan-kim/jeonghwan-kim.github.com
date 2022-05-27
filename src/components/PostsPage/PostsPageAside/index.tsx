import { PageProps } from "gatsby"
import _ from "lodash"
import React, { FC } from "react"
import { MarkdownRemark, Query } from "../../../../graphql-types"
import * as Styled from "../style"
import CategoryList from "./CategoryList"
import TagList from "./TagList"

type CategoryPageAsideProps = PageProps<Query> & {
  activeType: "category" | "tag"
  activeKey: string
}

const PostsPageAside: FC<CategoryPageAsideProps> = ({
  activeKey,
  activeType,
  ...props
}) => {
  return (
    <Styled.Wrapper>
      <CategoryList
        {...props}
        activeCategory={activeType === "category" ? activeKey : null}
      />
      <TagList {...props} activeTag={activeType === "tag" ? activeKey : null} />
    </Styled.Wrapper>
  )
}
export default PostsPageAside
