/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import { graphql, useStaticQuery } from "gatsby"
import React, { FC, ReactNode, useEffect, useState } from "react"
import "../../sass/main.scss"
import GlobalStyle from "../../styles/GlobalStyle"
import Footer from "./footer"
import Header from "./header"
import layoutStore from "./layout-store"
import "./layout.scss"

interface P {
  hasHeaderBorder?: boolean
  aside?: ReactNode
}

const Layout: FC<P> = p => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          author
          title
          social {
            email
            githubUsername
          }
        }
      }
    }
  `)

  const [modals, setModals] = useState([])

  useEffect(() => {
    layoutStore.on("modalChanged", modals => {
      setModals([...modals])
    })
  }, [])

  const { author, title, social } = data.site.siteMetadata
  return (
    <>
      <GlobalStyle />
      <div className="layout">
        <Header
          {...p}
          siteTitle={title}
          githubUsername={social.githubUsername}
          email={social.email}
        />
        {p.aside ? (
          <div className="container flex">
            <aside className="aside-left">{p.aside}</aside>
            <div>
              <main className="has-aside">{p.children}</main>
              <Footer
                author={author}
                githubUsername={social.githubUsername}
                email={social.email}
              />
            </div>
          </div>
        ) : (
          <>
            <main className="container">{p.children}</main>
            <Footer
              author={author}
              githubUsername={social.githubUsername}
              email={social.email}
            />
          </>
        )}

        {modals.map(modal => React.cloneElement(modal))}
      </div>
    </>
  )
}

export default Layout
