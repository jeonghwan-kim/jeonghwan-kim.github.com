import { useReducer } from "react"
import { MarkdownRemark } from "../../../graphql-types"

interface State {
  activeType?: "category" | "tag"
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

  const setActive = (category: string, tag: string) =>
    dispatch({
      type: "SET_ACTIVE",
      payload: {
        activeType: category ? "category" : tag ? "tag" : "category",
        activeKey: category ? category : tag ? tag : "모든글",
      },
    })

  const setPosts = (posts: MarkdownRemark[]) =>
    dispatch({
      type: "SET_POST",
      payload:
        activeType === "category" && activeKey !== "모든글"
          ? posts.filter(p => p.frontmatter.category === activeKey)
          : activeType === "tag"
          ? posts.filter(p => p.frontmatter.tags?.includes(activeKey))
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
