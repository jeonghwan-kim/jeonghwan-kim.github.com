import { Link } from "gatsby"
import React from "react"
import "./series-nav.scss"
import { Series } from "../../models/site"
import { MarkdownRemark } from "../../models/markdown-remark"
import Button from "../../components/button"

interface P {
  series: Series
  posts: MarkdownRemark[]
  nodeId: string
  lite?: boolean
  className?: string
}

const SeriesNav: React.FC<P> = ({ series, posts, nodeId, lite, className }) => {
  const curIdx = posts.findIndex(item => {
    return item.id === nodeId
  })

  const prev = curIdx === 0 ? null : posts[curIdx - 1]
  const next = curIdx === posts.length ? null : posts[curIdx + 1]

  return lite ? renderLite() : renderDefault()

  function renderLite() {
    return (
      <div className={`series-nav py-3 px-2 ${className || ""}`}>
        <div className="mb-1">
          <span className="series-title">{series.title}</span>
          <span className="series-order">
            (<span className="active">{curIdx + 1}</span>/{posts.length})
          </span>
        </div>
        <div className="series-controls flex">
          {prev && (
            <span className="prev align-left">
              <Button link type="secondary" to={prev.fields.slug}>
                « 이전
              </Button>
            </span>
          )}
          {next && (
            <span className="next align-right">
              <Button link type="secondary" to={next.fields.slug}>
                다음 »
              </Button>
            </span>
          )}
        </div>
      </div>
    )
  }

  function renderDefault() {
    return (
      <div className={`series-navigator px-2 pt-3 pb-2 ${className || ""}`}>
        <h3 className="series-title">{series.title}</h3>
        <div className="post-list">
          <ul>
            {posts.map(post => {
              const active = post.id === nodeId
              return (
                <li className={active ? "active" : ""} key={post.fields.slug}>
                  {active ? (
                    <div className="active">{post.frontmatter.title}</div>
                  ) : (
                    <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default SeriesNav
