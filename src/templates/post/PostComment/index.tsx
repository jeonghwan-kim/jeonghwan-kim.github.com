import React, { useEffect, useRef } from "react"
import { themeEventEmitter } from "../../../helpers/theme"
import { CommentService } from "./types"
import { utteranceService } from "./utteranceService"

const PostComment: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const commentService: CommentService = utteranceService

  const handleChangeTheme = (theme: "dark" | "light" = "light") => {
    if (containerRef.current) {
      commentService.load(containerRef.current, theme)
    }
  }

  useEffect(function setupEvent() {
    themeEventEmitter.on(handleChangeTheme)

    return () => {
      themeEventEmitter.off(handleChangeTheme)
    }
  }, [])

  return <div id="utteranc-comments" ref={containerRef}></div>
}

export default PostComment
