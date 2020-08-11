import React from "react"

import "./icon.scss"

interface P {
  size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  type: "rss" | "github" | "email" | "article" | "video" | "tag"
}

const Icon: React.FC<P> = ({ size, type }) => {
  return <i className={`icon icon-${size}x icon-${type}`}></i>
}

export default Icon
