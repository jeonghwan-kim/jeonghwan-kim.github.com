import React from "react"
import * as Styles from "./styles"
import { ArchiveList, SeriesList, TagList } from "../PostsPage/aside"
import { MarkdownRemark } from "../../../graphql-types"

interface Props {
  data: MarkdownRemark[]
  onClose: () => void
}

export default function Sidebar({ data, onClose }: Props) {
  return (
    <Styles.Sidebar>
      <CloseButton onClick={onClose} />
      <ArchiveList posts={data} activeYear={"모든글"} />
      <TagList
        posts={data.filter(node => node.frontmatter?.tags?.length)}
        activeTag={""}
      />
      <SeriesList posts={data} />
    </Styles.Sidebar>
  )
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Styles.CloseButton onClick={onClick}>
      <span />
      <span />
    </Styles.CloseButton>
  )
}
