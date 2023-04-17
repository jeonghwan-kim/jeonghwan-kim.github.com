import React from "react"
import { Post, Query } from "./types"

const MyReact = (function () {
  const memorizedStates: [any, any[]][] = []
  let cursor = 0

  function resetCursor() {
    cursor = 0
  }

  function useMemo<T>(nextCreate: () => T, deps: any[]): T {
    if (!memorizedStates[cursor]) {
      const nextValue = nextCreate()
      memorizedStates[cursor] = [nextValue, deps]
      cursor = cursor + 1
      return nextValue
    }

    const nextDeps = deps
    const [prevValue, prevDeps] = memorizedStates[cursor]
    if (prevDeps.every((prev, idx) => prev === nextDeps[idx])) {
      cursor = cursor + 1
      return prevValue
    }

    const nextValue = nextCreate()
    memorizedStates[cursor] = [nextValue, nextDeps]
    cursor = cursor + 1
    return nextValue
  }

  return {
    resetCursor,
    useMemo,
  }
})()

const Board: React.FC<{ posts: Post[]; query: Query }> = ({ posts, query }) => {
  MyReact.resetCursor()

  function filterPosts() {
    console.log("filterPosts")
    return posts.filter(post => (query.tag ? post.tag === query.tag : true))
  }

  const filteredPosts = MyReact.useMemo(() => filterPosts(), [posts, query])

  return (
    <ul>
      {filteredPosts.map(post => (
        <li key={post.id}>{post.content}</li>
      ))}
    </ul>
  )
}

export default () => {
  const [darkTheme, setDarkTheme] = React.useState(false)
  const [posts, setPosts] = React.useState([
    { id: 1, content: "post a", tag: "react" },
    { id: 2, content: "post b", tag: "vue" },
    { id: 3, content: "post c", tag: "react" },
  ])
  const [query, setQuery] = React.useState({ tag: "" })

  return (
    <>
      <div>{darkTheme ? "어두운 테마" : "밝은 테마"}</div>
      <button onClick={() => setDarkTheme(!darkTheme)}>테마 변경</button>
      <hr />
      <button onClick={() => setQuery({ tag: "" })}>All</button>
      <button onClick={() => setQuery({ tag: "react" })}>react</button>
      <button onClick={() => setQuery({ tag: "vue" })}>vue</button>
      <Board posts={posts} query={query} />
    </>
  )
}
