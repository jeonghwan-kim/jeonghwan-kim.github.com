import React from "react"
import * as Styles from "./styles"
import { ArchiveList, SeriesList, TagList } from "../PostsPage/aside"
import { Query } from "../../../graphql-types"
import { PageProps } from "gatsby"

export default function Sidebar({ data }: Pick<PageProps<Query>, "data">) {
  return (
    <Styles.Sidebar>
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
