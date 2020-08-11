import React, { ReactNode, CSSProperties } from "react"
import { Link } from "gatsby"
import { MarkdownRemark } from "../../models/markdown-remark"

import './sibling-nav.scss';

interface SiblingNavItemProps {
  label: string
  align: 'left' | 'right'
  icon: string
  text: string
  url: string
}

const SiblingNavItem: React.FC<SiblingNavItemProps> = p => {
  const labelStyle: CSSProperties = {
    textAlign: p.align,
  }
  p.align === 'left' ? labelStyle.marginLeft = 16 : labelStyle.marginRight = 16

  return (
    <div className="sibling-nav-item">
      <div className="label" style={labelStyle}>{p.label}</div>
      <Link to={p.url}>
        <div className="flex">
          {p.align === 'left' && <i style={{marginRight: 8}}>{p.icon}</i>}
          <h3 style={{textAlign: p.align}}>{p.text}</h3>
          {p.align === 'right' && <i style={{marginLeft: 8}}>{p.icon}</i>}
        </div>
      </Link>
    </div>
  )
}

interface P {
  previous?: MarkdownRemark
  next?: MarkdownRemark
}

const SiblingNav: React.FC<P> = p => {
  return (
    <div className="sibling-nav">
      {p.previous && (
        <SiblingNavItem
          label="이전글"
          align="left"
          // text={`« ${p.previous.frontmatter.title}`}
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
    </div>
  )
}
export default SiblingNav
