import { Link } from "gatsby"
import _ from "lodash"
import React, { FC } from "react"
import { MarkdownRemark } from "../../../graphql-types"
import { Params, Path } from "../../helpers/constants"
import { getLinkHoverTitle } from "./helpers"
import * as Styled from "./style"

type ArchiveListProps = {
  posts: MarkdownRemark[]
  activeYear?: string
}

export const ArchiveList: FC<ArchiveListProps> = ({ posts, activeYear }) => {
  let postsGroubyYear: { [year: string]: MarkdownRemark[] } = {}

  posts.forEach(post => {
    const year = new Date(post.frontmatter.date).getFullYear()
    postsGroubyYear[year] = postsGroubyYear[year] || []
    postsGroubyYear[year].push(post)
  })

  const postsSortByYear = _.orderBy(
    Object.entries(postsGroubyYear).map(([year, posts]) => ({
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
          to={Path.Posts}
          className={activeYear === "모든글" ? "active" : ""}
        >
          <label>모든글</label>
          <span>{posts.length.toLocaleString()}</span>
        </Link>
      </Styled.ArchiveListItem>
      {postsSortByYear.map(({ year, posts }) => (
        <Styled.ArchiveListItem key={year}>
          <Link
            to={`${Path.Posts}?${Params.Year}=${encodeURIComponent(year)}`}
            className={year === activeYear ? "active" : ""}
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

type TagListProps = {
  posts: MarkdownRemark[]
  activeTag: string
}

export const TagList: FC<TagListProps> = ({ posts, activeTag }) => {
  let postsGroubyTag: { [tag: string]: MarkdownRemark[] } = {}

  posts.forEach(post => {
    const tags = post.frontmatter.tags
    tags.forEach(tag => {
      postsGroubyTag[tag] = postsGroubyTag[tag] || []
      postsGroubyTag[tag].push(post)
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
            to={`${Path.Posts}?${Params.Tag}=${encodeURIComponent(tag)}`}
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

type SeriesListProps = {
  posts: MarkdownRemark[]
  activeSeries?: string
}

export const SeriesList: FC<SeriesListProps> = ({ posts, activeSeries }) => {
  let postsGroubySeries: { [year: string]: MarkdownRemark[] } = {}

  const postsHasSeries = posts.filter(post => post.frontmatter.seriesId)

  postsHasSeries.forEach(post => {
    const { seriesId } = post.frontmatter
    postsGroubySeries[seriesId] = postsGroubySeries[seriesId] || []
    postsGroubySeries[seriesId].push(post)
  })

  const postsSortByYear = _.orderBy(
    Object.entries(postsGroubySeries).map(([seriesId, posts]) => ({
      seriesId,
      posts,
    })),
    entry => entry.posts[0].frontmatter.date,
    "desc"
  )

  return (
    <Styled.SeriesList>
      <Styled.SeriesListTitle>연재물</Styled.SeriesListTitle>
      {postsSortByYear.map(({ seriesId, posts }) => (
        <Styled.SeriesListItem key={seriesId}>
          <Link
            to={`${Path.Posts}?${Params.Series}=${encodeURIComponent(
              seriesId
            )}`}
            className={seriesId === activeSeries ? "active" : ""}
            title={getLinkHoverTitle(seriesId, posts.length)}
          >
            <label>{seriesId}</label>
            <span>{posts.length.toLocaleString()}</span>
          </Link>
        </Styled.SeriesListItem>
      ))}
    </Styled.SeriesList>
  )
}
