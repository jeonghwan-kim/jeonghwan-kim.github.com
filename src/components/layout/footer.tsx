import { Link } from "gatsby"
import React, { FC } from "react"
import "./footer.scss"

interface P {
  author: string
  email: string
  githubUsername: string
}

const Footer: FC<P> = ({ author, email, githubUsername }) => {
  return (
    <footer className="site-footer mb-0 py-5">
      <ul className="footer-navs  mb-4">
        <li className="mr-3">
          <Link to="/category/">POSTS</Link>
        </li>
        <li className="mr-3">
          <Link to="/#videos">VIDEOS</Link>
        </li>
        <li>
          <Link to="/tags/">TAGS</Link>
        </li>
      </ul>
      <ul className="mb-10">
        <li className="mr-2">
          <Link className="icon icon-5x icon-rss" to="/feed.xml" title="rss" />
        </li>
        <li className="mr-2">
          <a
            className="icon icon-5x icon-email"
            href={`mailto:${email}`}
            title="email"
          ></a>
        </li>
        <li>
          <Link
            className="icon icon-5x icon-github"
            to={`https://github.com/${githubUsername}`}
            title="github"
          />
        </li>
      </ul>
      <div className="footer-copyright">
        <div className="mr-1">
          © {author} {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}

export default Footer
