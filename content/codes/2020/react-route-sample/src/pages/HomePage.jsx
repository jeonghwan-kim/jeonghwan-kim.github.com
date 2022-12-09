import * as React from "react"
import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <>
      <h3>홈</h3>
      <ul>
        <li>
          <Link to="/users">사용자 관리</Link>
        </li>
        <li>
          <Link to="/products">상품 관리</Link>
        </li>
        <li>
          <Link to="/auth">권한 관리</Link>
        </li>
      </ul>
    </>
  )
}

export default HomePage
