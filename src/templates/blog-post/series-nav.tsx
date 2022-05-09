import { Link } from "gatsby"
import React from "react"
import { MarkdownRemark, Series } from "../../../graphql-types"
import Button from "../../components/Button"
import { ButtonType } from "../../components/Button/style"
import * as Styled from "./style"

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
      <Styled.SeriesNav className={`${className || ""}`}>
        <Styled.SeriesNavTitle>
          {series.title}
          <span className="series-order">
            (<span className="active">{curIdx + 1}</span>/{posts.length})
          </span>
        </Styled.SeriesNavTitle>
        <Styled.SeriesNavControls>
          {prev && (
            <Styled.SeriesNavPrev>
              <Button
                link
                type={ButtonType.Secondary}
                to={prev.frontmatter?.slug}
              >
                « 이전
              </Button>
            </Styled.SeriesNavPrev>
          )}
          {next && (
            <Styled.SeriesNavNext>
              <Button
                link
                type={ButtonType.Secondary}
                to={next.frontmatter?.slug}
              >
                다음 »
              </Button>
            </Styled.SeriesNavNext>
          )}
        </Styled.SeriesNavControls>
      </Styled.SeriesNav>
    )
  }

  function renderDefault() {
    return (
      <Styled.SeriesNavigator className={`${className || ""}`}>
        <h3 className="series-title">{series.title}</h3>
        <div className="post-list">
          <ul>
            {posts.map(post => {
              const active = post.id === nodeId
              return (
                <li
                  className={active ? "active" : ""}
                  key={post.frontmatter?.slug}
                >
                  {active ? (
                    <div className="active">{post.frontmatter.title}</div>
                  ) : (
                    <Link to={post.frontmatter?.slug}>
                      {post.frontmatter.title}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </Styled.SeriesNavigator>
    )
  }
}

export default SeriesNav
