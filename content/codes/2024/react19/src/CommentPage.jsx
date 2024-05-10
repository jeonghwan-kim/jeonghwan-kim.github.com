import { Suspense, use } from "react"

const comments = [
  { id: 1, text: "comment 1" },
  { id: 2, text: "comment 2" },
  { id: 3, text: "comment 3" },
]

async function fetch() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(comments)
    }, 1000)
  })
}

function Comments({ commentsPromise }) {
  // 프라미스가 이행될때까지 렌더하지 않는다.
  const comments = use(commentsPromise)

  return comments.map(comment => <p key={comment.id}>{comment.text}</p>)
}

function CommentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={fetch()} />
    </Suspense>
  )
}

export default CommentPage
