import { Theme } from "../../../helpers/theme"

export interface CommentService {
  load(root: HTMLElement, theme?: Theme): void
}
