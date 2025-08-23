import { Link } from "gatsby"
import React from "react"
import { Params, Path } from "../../helpers/constants"
import { Container } from "../../styles/style-variables"
import Icon from "../Icon"
import { IconType } from "../Icon/style"
import Nav from "./nav"
import * as Styled from "./style"

export interface HeaderProps {
  noBorder?: boolean
}

const Header: React.FC<HeaderProps> = ({ noBorder }) => {
  return (
    <Styled.Header bordered={!noBorder}>
      <Container>
        <Styled.SiteTitle>
          <Styled.SiteLogo>
            <Link to={Path.Home}>김정환블로그</Link>
          </Styled.SiteLogo>
        </Styled.SiteTitle>
        <Styled.NavList>
          <Nav to={Path.Posts}>
            <Icon type={IconType.Article} />
            <span>POSTS</span>
          </Nav>
        </Styled.NavList>
        <Styled.Contacts>
          <Nav to="/feed.xml">
            <Icon type={IconType.RSS} style={{ filter: "invert(0.6)" }} />
          </Nav>
          <Nav to={`https://github.com/jeonghwan-kim`}>
            <Icon type={IconType.Github} style={{ filter: "invert(0.6)" }} />
          </Nav>
        </Styled.Contacts>
      </Container>
    </Styled.Header>
  )
}

export default Header
