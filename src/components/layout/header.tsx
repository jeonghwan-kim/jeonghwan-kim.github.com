import { Link } from "gatsby"
import React from "react"
import './header.scss';
import Nav from "./nav";
import Modal from "../modal";
import CategorySelectModal from "./category-select-modal";

interface P {
  siteTitle: string;
}

const Header: React.FC<P> = ({ siteTitle }) => {
  return (
  <header className="site-header">
  <div className="flex container">
    <h1 className="flex-1 site-title">
      <Link className="site-logo" to="/">{siteTitle}</Link>
    </h1>
    <nav className="site-navs">
      <ul className="flex ml-1">
        <Nav title="POSTS" icon="article" onClick={()=> Modal.open(<CategorySelectModal />)}/>
        <Nav title="VIDEOS" icon="video" to="/#videos" />
        <Nav title="TAGS" icon="tag" to="/tags/"/>
      </ul>
    </nav>
  </div>
</header>
)
}

export default Header
