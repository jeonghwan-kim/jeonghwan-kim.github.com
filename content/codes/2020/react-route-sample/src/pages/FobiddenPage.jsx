import * as React from "react"
import { Link } from "react-router-dom"

const FobiddenPage = () => {
  return (
    <div>
      <h3>접근 권한이 없습니다.</h3>
      <Link to="/">홈으로 가기</Link>
    </div>
  )
}

export default FobiddenPage
