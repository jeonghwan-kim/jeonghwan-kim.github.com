import { Link } from "gatsby"
import React, { CSSProperties } from "react"
import { MarkdownRemark } from "../../models/markdown-remark"
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
  previous?: MarkdownRemark
  next?: MarkdownRemark
}

const SiblingNav: React.FC<P> = p => {
  return (
    <Styled.SiblingNav>
      {p.previous && (
        <SiblingNavItem
          label="이전글"
          align="left"
          icon="«"
          text={p.previous.frontmatter.title}
          url={p.previous.fields.slug}
        />
      )}
      {p.next && (
        <SiblingNavItem
          label="다음글"
          align="right"
          icon="»"
          text={`${p.next.frontmatter.title}`}
          url={p.next.fields.slug}
        />
      )}
    </Styled.SiblingNav>
  )
}
export default SiblingNav
