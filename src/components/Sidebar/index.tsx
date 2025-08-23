import React from "react"
import * as Styles from "./styles"
import { ArchiveList, SeriesList, TagList } from "../PostsPage/aside"
import { Query } from "../../../graphql-types"
import { PageProps } from "gatsby"

interface Props extends Pick<PageProps<Query>, "data"> {
  onClose: () => void
}

export default function Sidebar({ data, onClose }: Props) {
  return (
    <Styles.Sidebar>
      <button onClick={onClose}>close</button>
      <ArchiveList posts={data.allMarkdownRemark.nodes} activeYear={"모든글"} />
      <TagList
        posts={data.allMarkdownRemark.nodes.filter(
          node => node.frontmatter?.tags?.length
        )}
        activeTag={""}
      />
      <SeriesList posts={data.allMarkdownRemark.nodes} />
    </Styles.Sidebar>
  )
}
