import React, { createRef } from "react"
import { useEffect } from "react"

const utterancSettings = {
  src: "https://utteranc.es/client.js",
  repo: "jeonghwan-kim/jeonghwan-kim.github.com",
  "issue-term": "pathname",
  label: "Comment",
  theme: "github-light",
  // theme: "github-dark",
  crossOrigin: "anonymous",
  async: "true",
}

const PostComment: React.FC = () => {
  const ref = createRef<HTMLDivElement>()

  useEffect(() => {
    const utterances = document.createElement("script")
    Object.entries(utterancSettings).forEach(([key, value]) => {
      utterances.setAttribute(key, value)
    })
    ref.current.appendChild(utterances)
  }, [])

  return <div id="utteranc-comments" ref={ref}></div>
}

export default PostComment
