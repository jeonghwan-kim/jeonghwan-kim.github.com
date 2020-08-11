/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FC, useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import Footer from "./footer"

import "../../sass/main.scss"
import layoutStore from "./layout-store"

interface P {}

const Layout: FC<P> = ({ children }) => {
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
      <Header siteTitle={title} />
      <main>{children}</main>
      <Footer
        author={author}
        githubUsername={social.githubUsername}
        email={social.email}
      />

      {modals.map(modal => React.cloneElement(modal))}
    </>
  )
}

export default Layout
