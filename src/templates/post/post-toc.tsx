import React from "react"
import * as Styled from "./style"

export default function PostToc({
  tableOfContents,
}: {
  tableOfContents: string
}) {
  return <Styled.Toc dangerouslySetInnerHTML={{ __html: tableOfContents }} />
}
