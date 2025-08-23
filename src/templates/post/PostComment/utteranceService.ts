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

class UtteranceService implements CommentService {
  load(root: HTMLElement, theme: Theme) {
    if (root.children.length > 0) {
      root.innerHTML = ""
    }

    const scriptElement = this.createScriptElement({
      ...defaultUtterancSettings,
      theme: `github-${theme}`,
    })

    root.appendChild(scriptElement)
  }

  private createScriptElement(settings: typeof defaultUtterancSettings) {
    const script = document.createElement("script")
    Object.entries(settings).forEach(([key, value]) => {
      script.setAttribute(key, value)
    })

    return script
  }
}

export const utteranceService = new UtteranceService()
