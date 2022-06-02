import { useReducer } from "react"
import { MarkdownRemark } from "../../../graphql-types"

interface State {
  activeType?: "year" | "tag" | "series"
  activeKey?: string
  renderedPosts: MarkdownRemark[]
}

const initalState: State = {
  renderedPosts: [],
}

interface SetPostAction {
  type: "SET_POST"
  payload: State["renderedPosts"]
}

interface SetActiveAction {
  type: "SET_ACTIVE"
  payload: Pick<State, "activeType" | "activeKey">
}

type Action = SetPostAction | SetActiveAction

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_POST":
      return {
        ...state,
        renderedPosts: [...action.payload],
      }
    case "SET_ACTIVE":
      return {
        ...state,
        activeType: action.payload.activeType,
        activeKey: action.payload.activeKey,
      }
  }
}

export const useStore = () => {
  const [state, dispatch] = useReducer(reducer, initalState)
  const { activeKey, activeType, renderedPosts } = state

  const setActive = (year: string, tag: string, series: string) =>
    dispatch({
      type: "SET_ACTIVE",
      payload: {
        activeType: year ? "year" : tag ? "tag" : series ? "series" : "year",
        activeKey: year || tag || series || "모든글",
      },
    })

  const setPosts = (posts: MarkdownRemark[]) =>
    dispatch({
      type: "SET_POST",
      payload:
        activeType === "year" && activeKey !== "모든글"
          ? posts.filter(
              p =>
                new Date(p.frontmatter.date).getFullYear().toString() ===
                activeKey
            )
          : activeType === "tag"
          ? posts.filter(p => p.frontmatter.tags?.includes(activeKey))
          : activeType === "series"
          ? posts.filter(p => p.frontmatter.seriesId === activeKey)
          : posts,
    })

  return {
    activeKey,
    activeType,
    renderedPosts,

    setActive,
    setPosts,
  }
}
