import React from "react"
import * as Styled from "./styles"
import { MarkdownRemark } from "../../../graphql-types"
import { Link } from "gatsby"
import _ from "lodash"

interface Props {
  data: MarkdownRemark[]
  activeYear?: number
  activeTag?: string
  activeSeries?: string
  onClose: () => void
}

export default function Sidebar({
  data,
  activeYear,
  activeTag,
  activeSeries,
  onClose,
}: Props) {
  console.log("sidebar", activeYear)
  return (
    <Styled.Sidebar>
      <CloseButton onClick={onClose} />
      <ArchiveList
        posts={data}
        activeYear={
          activeYear
            ? activeYear
            : !activeTag && !activeSeries
            ? "ALL"
            : undefined
        }
      />
      <TagList
        posts={data.filter(node => node.frontmatter?.tags?.length)}
        activeTag={activeTag || ""}
      />
      <SeriesList posts={data} activeSeries={activeSeries} />
    </Styled.Sidebar>
  )
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Styled.CloseButton onClick={onClick}>
      <span />
      <span />
    </Styled.CloseButton>
  )
}

function ArchiveList({
  posts,
  activeYear,
}: {
  posts: MarkdownRemark[]
  activeYear?: number | "ALL"
}) {
  let postsGroupByYear: { [year: number]: MarkdownRemark[] } = {}

  posts.forEach(post => {
    const year = new Date(post.frontmatter?.date).getFullYear()
    postsGroupByYear[year] = postsGroupByYear[year] || []
    postsGroupByYear[year].push(post)
  })

  const postsSortByYear = _.orderBy(
    Object.entries(postsGroupByYear).map(([year, posts]) => ({
      year,
      posts,
    })),
    entry => entry.year,
    "desc"
  )

  return (
    <Styled.ArchiveList>
      <Styled.ArchiveListTitle>아카이브</Styled.ArchiveListTitle>
      <Styled.ArchiveListItem>
        <Link
          to={`/`}
          className={"ALL" === activeYear ? "active" : ""}
          title={getLinkHoverTitle("모든글", posts.length)}
        >
          <label>모든글</label>
          <span>{posts.length.toLocaleString()}</span>
        </Link>
      </Styled.ArchiveListItem>
      {postsSortByYear.map(({ year, posts }) => (
        <Styled.ArchiveListItem key={year}>
          <Link
            to={`/year/${year}`}
            className={year == activeYear ? "active" : ""}
            title={getLinkHoverTitle(year, posts.length)}
          >
            <label>{year}년</label>
            <span>{posts.length.toLocaleString()}</span>
          </Link>
        </Styled.ArchiveListItem>
      ))}
    </Styled.ArchiveList>
  )
}

function TagList({
  posts,
  activeTag,
}: {
  posts: MarkdownRemark[]
  activeTag: string
}) {
  let postsGroubyTag: { [tag: string]: MarkdownRemark[] } = {}

  posts.forEach(post => {
    const tags = post.frontmatter?.tags || []
    tags.forEach(tag => {
      if (tag) {
        postsGroubyTag[tag] = postsGroubyTag[tag] || []
        postsGroubyTag[tag].push(post)
      }
    })
  })

  const postsSortByTagCount = _.orderBy(
    Object.entries(postsGroubyTag).map(([tag, posts]) => ({ tag, posts })),
    entry => entry.posts.length,
    "desc"
  )

  return (
    <Styled.TagList>
      <Styled.TagListTitle>태그</Styled.TagListTitle>
      {postsSortByTagCount.map(({ tag, posts }) => (
        <Styled.TagListItem key={tag}>
          <Link
            to={`/tag/${encodeURIComponent(tag)}`}
            className={tag === activeTag ? "active" : ""}
            title={getLinkHoverTitle(tag, posts.length)}
          >
            #{tag}
          </Link>
        </Styled.TagListItem>
      ))}
    </Styled.TagList>
  )
}

function SeriesList({
  posts,
  activeSeries,
}: {
  posts: MarkdownRemark[]
  activeSeries?: string
}) {
  let postsGroubySeries: { [year: string]: MarkdownRemark[] } = {}

  const postsHasSeries = posts.filter(post => post.frontmatter?.series)

  postsHasSeries.forEach(post => {
    const series = post.frontmatter?.series
    if (series) {
      postsGroubySeries[series] = postsGroubySeries[series] || []
      postsGroubySeries[series].push(post)
    }
  })

  const postsSortByYear = _.orderBy(
    Object.entries(postsGroubySeries).map(([series, posts]) => ({
      series,
      posts,
    })),
    entry => entry.posts[0].frontmatter?.date,
    "desc"
  )

  return (
    <Styled.SeriesList>
      <Styled.SeriesListTitle>연재물</Styled.SeriesListTitle>
      {postsSortByYear.map(({ series, posts }) => (
        <Styled.SeriesListItem key={series}>
          <Link
            to={`/series/${encodeURIComponent(series)}`}
            className={series === activeSeries ? "active" : ""}
            title={getLinkHoverTitle(series, posts.length)}
          >
            <label>{series}</label>
            <span>{posts.length.toLocaleString()}</span>
          </Link>
        </Styled.SeriesListItem>
      ))}
    </Styled.SeriesList>
  )
}

function getLinkHoverTitle(name: string, count: number) {
  return `${name} ${count.toLocaleString()}개 글`
}
