import { Theme } from "../../../helpers/theme"
import { CommentService } from "./types"

const defaultUtterancSettings = {
  src: "https://utteranc.es/client.js",
  repo: "jeonghwan-kim/jeonghwan-kim.github.com",
  "issue-term": "pathname",
  label: "Comment",
  theme: "github-light", // 'github-light' | 'github-dark'
  crossOrigin: "anonymous",
  async: "true",
}

export const utteranceService: CommentService = {
  load(root: HTMLElement, theme?: Theme) {
    const utterances = document.createElement("script")
    const settings = { ...defaultUtterancSettings, theme: `github-${theme}` }
    Object.entries(settings).forEach(([key, value]) => {
      utterances.setAttribute(key, value)
    })
    root.appendChild(utterances)
  },
  unload(root: HTMLElement) {
    root.innerHTML = ""
  },
}
