import React, { CSSProperties } from "react"

import "./icon.scss"

interface P {
  size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  type: "rss" | "github" | "email" | "article" | "video" | "tag"
  style?: CSSProperties
  className?: string
}

const Icon: React.FC<P> = p => {
  return (
    <i
      {...p}
      className={`icon icon-${p.size}x icon-${p.type} ${
        p.className ? p.className : ""
      }`}
    ></i>
  )
}

export default Icon
