import { Link } from "gatsby"
import React, { CSSProperties } from "react"
import { MarkdownRemark, Maybe } from "../../../graphql-types"
import * as Styled from "./style"

interface SiblingNavItemProps {
  label: string
  align: "left" | "right"
  icon: string
  text: string
  url: string
}

const SiblingNavItem: React.FC<SiblingNavItemProps> = p => {
  const labelStyle: CSSProperties = {
    textAlign: p.align,
  }
  p.align === "left"
    ? (labelStyle.marginLeft = 16)
    : (labelStyle.marginRight = 16)

  return (
    <Styled.SiblingNavItem>
      <div className="label" style={labelStyle}>
        {p.label}
      </div>
      <Link to={p.url}>
        <div className="flex">
          {p.align === "left" && <i style={{ marginRight: 8 }}>{p.icon}</i>}
          <h3 style={{ textAlign: p.align }}>{p.text}</h3>
          {p.align === "right" && <i style={{ marginLeft: 8 }}>{p.icon}</i>}
        </div>
      </Link>
    </Styled.SiblingNavItem>
  )
}

interface P {
  previous?: Maybe<MarkdownRemark>
  next?: Maybe<MarkdownRemark>
}

const SiblingNav: React.FC<P> = ({ previous, next }) => {
  return (
    <Styled.SiblingNav>
      {previous?.frontmatter?.title && previous?.frontmatter?.slug && (
        <SiblingNavItem
          label="이전글"
          align="left"
          icon="«"
          text={previous.frontmatter.title}
          url={previous.frontmatter.slug}
        />
      )}
      {next?.frontmatter?.title && next?.frontmatter?.slug && (
        <SiblingNavItem
          label="다음글"
          align="right"
          icon="»"
          text={next.frontmatter.title}
          url={next.frontmatter.slug}
        />
      )}
    </Styled.SiblingNav>
  )
}
export default SiblingNav
