import React, { PropsWithChildren } from "react"
import { useTheme } from "../../helpers/theme"
import GlobalStyle from "../../styles/GlobalStyle"
import Footer from "../Footer"
import Header, { HeaderProps } from "../Header"
import Sidebar from "../Sidebar"
import { MarkdownRemark } from "../../../graphql-types"

export interface LayoutProps extends HeaderProps, PropsWithChildren {
  data: MarkdownRemark[]
}

export function Layout({ children, data }: LayoutProps) {
  const [openSidebar, setOpenSidebar] = React.useState(false)

  useTheme()

  return (
    <>
      <GlobalStyle />
      <Header onClickHamburgerButton={() => setOpenSidebar(true)} />
      {openSidebar && (
        <Sidebar data={data} onClose={() => setOpenSidebar(false)} />
      )}
      {children}
      <Footer bordered />
    </>
  )
}
