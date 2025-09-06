import React, { PropsWithChildren } from "react"
import { useTheme } from "../../helpers/theme"
import GlobalStyle from "../../styles/GlobalStyle"
import Footer from "../Footer"
import Header, { HeaderProps } from "../Header"
import Sidebar from "../Sidebar"
import { MarkdownRemark } from "../../../graphql-types"
import * as Styled from "./style"

export interface LayoutProps extends HeaderProps {
  data: MarkdownRemark[]
  activeYear?: number
  activeTag?: string
  activeSeries?: string
  activeAllPosts?: boolean
}

export function Layout({
  children,
  data,
  activeYear,
  activeTag,
  activeSeries,
  activeAllPosts,
}: PropsWithChildren<LayoutProps>) {
  const [openSidebar, setOpenSidebar] = React.useState(false)

  useTheme()

  return (
    <>
      <GlobalStyle />
      <Header onClickHamburgerButton={() => setOpenSidebar(true)} />
      <>
        <Sidebar
          data={data}
          activeYear={activeYear}
          activeTag={activeTag}
          activeSeries={activeSeries}
          activeAllPosts={activeAllPosts}
          onClose={() => setOpenSidebar(false)}
          show={openSidebar}
        />
        <Styled.Backdrop
          show={openSidebar}
          onClick={() => setOpenSidebar(false)}
        />
      </>
      {children}
      <Footer bordered />
    </>
  )
}
