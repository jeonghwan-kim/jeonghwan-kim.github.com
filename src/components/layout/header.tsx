import { Link, useStaticQuery, graphql } from "gatsby"
import React from "react"
import "./header.scss"
import Nav from "./nav"
import Modal from "../modal"
import CategorySelectModal from "./category-select-modal"
import Icon from "../icon"

interface P {
  siteTitle: string
  hasBorder?: boolean
  githubUsername: string
  email: string
}

const Header: React.FC<P> = ({
  siteTitle,
  hasBorder,
  githubUsername,
  email,
}) => {
  return (
    <header className={`site-header ${hasBorder ? "has-border" : ""}`}>
      <div className="flex container">
        <h1 className="site-title">
          <Link className="site-logo" to="/">
            {siteTitle}
          </Link>
        </h1>
        <nav className="site-navs flex-1">
          <Nav onClick={() => Modal.open(<CategorySelectModal />)}>
            <Icon type="article" size={3} />
            <div className="nav-text">POSTS</div>
          </Nav>
          <Nav to="/#videos">
            <Icon type="video" size={3} />
            <div className="nav-text">VIDEOS</div>
          </Nav>
          <Nav to="/tags/">
            <Icon type="tag" size={3} />
            <div className="nav-text">TAGS</div>
          </Nav>
        </nav>
        <div className="flex">
          <Nav to="/feed.xml">
            <Icon type="rss" size={3} style={{ filter: "invert(0.6)" }} />
          </Nav>
          <Nav href={`mailto:${email}`}>
            <Icon type="email" size={3} style={{ filter: "invert(0.6)" }} />
          </Nav>
          <Nav to={`https://github.com/${githubUsername}`}>
            <Icon type="github" size={3} style={{ filter: "invert(0.6)" }} />
          </Nav>
        </div>
      </div>
    </header>
  )
}

export default Header
