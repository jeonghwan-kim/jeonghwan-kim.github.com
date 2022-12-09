import * as React from "react"
import Pagination from "./Pagination"
import "./BoardPage.css"

const BoardPage = props => {
  const { posts, fetching, onClickPost } = props

  return (
    <div className="BoardPage">
      <h1>게시글</h1>
      <ul className="posts">
        {posts.map((post, idx) => {
          return (
            <li key={idx} onClick={() => onClickPost(post)}>
              {post}
            </li>
          )
        })}
      </ul>
      <Pagination {...props} disabled={fetching} />
    </div>
  )
}

export default BoardPage
