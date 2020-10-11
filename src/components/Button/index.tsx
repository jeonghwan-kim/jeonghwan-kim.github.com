import React from "react"
import { Link } from "gatsby"
import * as Styled from "./style"

interface P {
  type: Styled.ButtonType
  link?: boolean
  to?: string
  className?: string
  onClick?: () => void
}
const Button: React.FC<P> = ({ type, link, to, children, onClick }) => {
  if (link) {
    return (
      <Styled.ButtonLink type={type}>
        <Link to={to} onClick={() => onClick}>
          {children}
        </Link>
      </Styled.ButtonLink>
    )
  }

  return (
    <Styled.Button type={type} onClick={() => onClick()}>
      {children}
    </Styled.Button>
  )
}

export default Button
