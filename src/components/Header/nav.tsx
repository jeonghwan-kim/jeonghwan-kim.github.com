import React, { EventHandler, PropsWithChildren } from "react"
import { Link } from "gatsby"
import * as Styled from "./style"

interface Props {
  to?: string
  href?: string
  onClick?: () => void
}

const Nav: React.FC<PropsWithChildren<Props>> = ({
  to,
  href,
  onClick,
  children,
}) => {
  const style = { overflow: "hidden" }
  const handleClick: EventHandler<any> = e => {
    if (!to && onClick) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <Styled.Nav>
      {href ? (
        <a style={style} href={href} onClick={handleClick}>
          {children}
        </a>
      ) : (
        <Link style={style} to={`${to || "#"}`}>
          {children}
        </Link>
      )}
    </Styled.Nav>
  )
}

export default Nav
