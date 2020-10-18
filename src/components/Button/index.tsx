import React from "react"
import { Link } from "gatsby"
import * as Styled from "./style"

export interface ButtonProps {
  type: Styled.ButtonType
  link?: boolean
  to?: string
  className?: string
  onClick?: () => void
}
const Button: React.FC<ButtonProps> = ({
  type,
  link,
  to,
  children,
  onClick,
}) => {
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
