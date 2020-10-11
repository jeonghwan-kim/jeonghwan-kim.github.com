import { Link } from "gatsby"
import React from "react"
import Icon from "../../icon"
import { IconType } from "../../Icon/style"
import Nav from "./nav"
import * as Styled from "./style"

interface P {
  siteTitle: string
  hasHeaderBorder?: boolean
  githubUsername: string
  email: string
}

const Header: React.FC<P> = ({
  siteTitle,
  hasHeaderBorder,
  githubUsername,
  email,
}) => {
  return (
    <Styled.SiteHeader bordered={hasHeaderBorder}>
      <div className="flex container">
        <Styled.SiteTitle>
          <Styled.SiteLog>
            <Link className="site-logo" to="/">
              {siteTitle}
            </Link>
          </Styled.SiteLog>
        </Styled.SiteTitle>
        <Styled.NavList>
          <Nav to="/category/">
            <Icon type={IconType.Article} />
            <Styled.NavName>POSTS</Styled.NavName>
          </Nav>
          <Nav to="/#videos">
            <Icon type={IconType.Video} />
            <Styled.NavName>VIDEOS</Styled.NavName>
          </Nav>
          <Nav to="/tags/">
            <Icon type={IconType.Tag} />
            <Styled.NavName>TAGS</Styled.NavName>
          </Nav>
        </Styled.NavList>
        <Styled.Contacts>
          <Nav to="/feed.xml">
            <Icon type={IconType.RSS} style={{ filter: "invert(0.6)" }} />
          </Nav>
          <Nav href={`mailto:${email}`}>
            <Icon type={IconType.Email} style={{ filter: "invert(0.6)" }} />
          </Nav>
          <Nav to={`https://github.com/${githubUsername}`}>
            <Icon type={IconType.Github} style={{ filter: "invert(0.6)" }} />
          </Nav>
        </Styled.Contacts>
      </div>
    </Styled.SiteHeader>
  )
}

export default Header
