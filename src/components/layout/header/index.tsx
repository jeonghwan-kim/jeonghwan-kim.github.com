import { Link } from "gatsby"
import React from "react"
import { Container } from "../../../styles/style-variables"
import Icon from "../../Icon"
import { IconType } from "../../Icon/style"
import Nav from "./nav"
import * as Styled from "./style"

export interface HeaderProps {
  siteTitle: string
  hasHeaderBorder?: boolean
  githubUsername: string
  email: string
}

const Header: React.FC<HeaderProps> = ({
  siteTitle,
  hasHeaderBorder,
  githubUsername,
  email,
}) => {
  return (
    <Styled.SiteHeader bordered={hasHeaderBorder}>
      <Container>
        <Styled.SiteTitle>
          <Styled.SiteLogo>
            <Link to="/">{siteTitle}</Link>
          </Styled.SiteLogo>
        </Styled.SiteTitle>
        <Styled.NavList>
          <Nav to="/category/">
            <Icon type={IconType.Article} />
            <span>POSTS</span>
          </Nav>
          <Nav to="/#videos">
            <Icon type={IconType.Video} />
            <span>VIDEOS</span>
          </Nav>
          <Nav to="/tags/">
            <Icon type={IconType.Tag} />
            <span>TAGS</span>
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
      </Container>
    </Styled.SiteHeader>
  )
}

export default Header
