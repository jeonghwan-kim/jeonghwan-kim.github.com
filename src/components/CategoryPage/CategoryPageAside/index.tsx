import { PageProps } from "gatsby"
import _ from "lodash"
import React, { FC } from "react"
import { MarkdownRemark, Query } from "../../../../graphql-types"
import * as Styled from "../style"
import CategoryList from "./CategoryList"
import TagList from "./TagList"

type CategoryPageAsideProps = PageProps<Query> & {
  activeCategory: string
  activeTag: string
}

const CategoryPageAside: FC<CategoryPageAsideProps> = props => {
  return (
    <Styled.Wrapper>
      <CategoryList {...props} />
      <TagList {...props} />
    </Styled.Wrapper>
  )
}
export default CategoryPageAside
