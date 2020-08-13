/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FC, useState, useEffect, ReactNode } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Clipboard from "clipboard"

import Header from "./header"
import Footer from "./footer"

import layoutStore from "./layout-store"
import "../../sass/main.scss"
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

    //
    // al pre tags on the page
    const pres = document.getElementsByTagName("pre")

    //
    // reformat html of pre tags
    if (pres !== null) {
      for (let i = 0; i < pres.length; i++) {
        // check if its a pre tag with a prism class
        if (isPrismClass(pres[i])) {
          // insert code and copy element
          pres[
            i
          ].innerHTML = `<button class="btn btn-secondary copy">복사</button>${pres[i].innerHTML}`
        }
      }
    }

    //
    // create clipboard for every copy element
    const clipboard = new Clipboard(".copy", {
      target: trigger => {
        return trigger.nextElementSibling
      },
    })

    //
    // do stuff when copy is clicked
    clipboard.on("success", event => {
      event.trigger.textContent = "복사함!"
      setTimeout(() => {
        event.clearSelection()
        event.trigger.textContent = "복사"
      }, 2000)
    })

    //
    // helper function
    function isPrismClass(preTag) {
      return preTag.className.substring(0, 8) === "language"
    }
  }, [])

  const { author, title, social } = data.site.siteMetadata
  return (
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
  )
}

export default Layout
