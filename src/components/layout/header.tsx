import { Link } from "gatsby"
import React from "react"
import "./header.scss"
import Nav from "./nav"
import Modal from "../modal"
import CategorySelectModal from "./category-select-modal"
import Icon from "../icon"

interface P {
  siteTitle: string
}

const Header: React.FC<P> = ({ siteTitle }) => {
  return (
    <header className="site-header">
      <div className="flex container">
        <h1 className="flex-1 site-title">
          <Link className="site-logo" to="/">
            {siteTitle}
          </Link>
        </h1>
        <nav className="site-navs">
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
      </div>
    </header>
  )
}

export default Header
