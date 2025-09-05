import styled from "styled-components"
import {
  Border,
  Colors,
  Fonts,
  SpaceUnit,
  Widths,
} from "../../styles/style-variables"
import Video2Img from "./images/icon-video-2.png"
import { PropsWithChildren } from "react"

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: ${SpaceUnit(10)};
  @media (max-width: ${Widths.Tablet}) {
    margin-top: ${SpaceUnit(5)};
  }
  @media (max-width: ${Widths.Mobile}) {
    margin-top: ${SpaceUnit(2)};
  }
`

export const Article = styled.article`
  order: 0;
  flex: 1 0 0%;
  min-width: 0%;
  width: 100%;
`

export const PostHeader = styled.header`
  margin-bottom: ${SpaceUnit(7)};
`

export const PostTitle = styled.h1`
  margin-top: 0;
  margin-bottom: ${SpaceUnit()};
  color: ${Colors.Foreground1};
  font-size: 42px;
`

export const PostTime = styled.time`
  color: ${Colors.Foreground3};
`

export const PostContent = styled.div`
  font-size: 18px;
  line-height: 1.8em;
  font-family: ${Fonts.Article};
  word-break: break-word;
  h1 {
    font-size: 200%;
    margin-top: 1.5em;
  }
  h2 {
    font-size: 160%;
    margin-top: 1.5em;
  }
  h3 {
    font-size: 120%;
    margin-top: 1.5em;
  }
  h4 {
    font-size: 110%;
    margin-top: 1.5em;
  }
  h5 {
    font-size: 100%;
    margin-top: 1.5em;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${Colors.Foreground2};
    font-family: ${Fonts.Base};
    line-height: 1em;
  }
  img {
    border-radius: ${SpaceUnit(0.5)};
    display: block;
    margin: ${SpaceUnit()} * 2 auto;
    max-width: 100%;
  }
  blockquote {
    color: ${Colors.Foreground3};
    position: relative;
    &::before {
      content: "“";
      position: absolute;
      left: -${SpaceUnit(3)};
      font-size: 40px;
      color: ${Colors.Foreground3};
    }
    a {
      color: ${Colors.Foreground3};
    }
  }
  figcaption {
    font-size: 14px;
    color: ${Colors.Foreground3};
    text-align: center;
  }
  code:not([class^="language-"]) {
    font-size: 0.8em;
    background-color: ${Colors.Background2};
    border-radius: 6px;
    padding: 2px 6px;
    word-break: break-all;
  }
  hr {
    border: none;
    height: 1px;
    background-color: ${Colors.Foreground4};
    margin: ${SpaceUnit(4)} 0;
  }
  .gatsby-highlight {
    pre {
      border-radius: ${SpaceUnit()} / 2;
      overflow: auto;
      word-wrap: normal;
      white-space: pre;
    }
  }
`

export const PostMeta = styled.div`
  margin-top: ${SpaceUnit(4)};
`

export const ShareList = styled.ul`
  list-style: none;
  padding-left: 0;
`

export const ShareItem = styled.li`
  display: inline-block;
  margin-right: ${SpaceUnit()};
  &:last-child {
    margin-right: 0;
  }
`

export const TagList = styled.ul`
  list-style: none;
  padding-left: 0;
`

export const TagItem = styled.li<PropsWithChildren>`
  display: inline-block;
  margin-right: ${SpaceUnit()};
  &:last-child {
    margin-right: 0;
  }
`

export const Toc = styled.nav<{ dangerouslySetInnerHTML: { __html: string } }>`
  border: ${Border(1)};
  padding: ${SpaceUnit(2)} ${SpaceUnit(3)};
  width: 100%;

  &:before {
    content: "목차";
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: ${SpaceUnit(0.5)};
    list-style: none;
    margin: 0;
    li {
      p {
        margin: 0 0 4px 0;
      }
      a {
        color: ${Colors.Foreground1};
        &:hover,
        &:focus {
          color: ${Colors.Primary};
        }
      }
    }
  }
`

export const PostVideo = styled.div`
  a {
    display: block;
    position: relative;
    overflow: hidden;
    img {
      width: 100%;
      transition: all 0.3s ease;
    }
    &:hover {
      img {
        transform: scale(1.2);
      }
    }
    .post-video-overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      .video-icon-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .video-icon {
          background: url(${Video2Img}) no-repeat;
          background-position: center center;
          background-size: 50px 50px;
          opacity: 0.7;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.3);
        }
      }
      .post-video-title {
        background: rgba(0, 0, 0, 0.3);
        color: white;
        padding: 8px;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 14px;
      }
    }
  }
`

export const SeriesNav = styled.div`
  padding: ${SpaceUnit(3)} ${SpaceUnit(2)};
  border-left: ${Border(2)};
`
export const SeriesNavTitle = styled.div`
  font-weight: bold;
  margin-bottom: ${SpaceUnit()};
  &::before {
    content: "연재물";
    display: block;
    font-size: 14px;
    color: ${Colors.Foreground3};
    font-weight: normal;
  }
  .series-order {
    font-weight: normal;
    .active {
      font-weight: bold;
    }
  }
`
export const SeriesNavControls = styled.div`
  display: flex;
`
export const SeriesNavPrev = styled.span`
  display: inline-block;
  flex: 1 0 50%;
  text-align: left;
`
export const SeriesNavNext = styled(SeriesNavPrev)`
  text-align: right;
`
export const SeriesNavigator = styled.div`
  padding: ${SpaceUnit(3)} ${SpaceUnit(2)} ${SpaceUnit(2)};
  border-top: ${Border(2)};
  border-bottom: ${Border(2)};
  .flex {
    flex-flow: row;
  }
  .controls {
    flex: 0 0 100px;
    text-align: right;
    a {
      text-decoration: none;
    }
  }
  .series-title {
    margin-top: ${SpaceUnit()};
    &::before {
      content: "이 연재물 더보기";
      display: block;
      font-size: 14px;
      color: ${Colors.Foreground3};
      font-weight: normal;
    }
  }
  .post-list {
    line-height: 1.5em;
    a {
      display: inline-block;
      width: 100%;
      text-decoration: none;
      &:hover,
      &:focus {
        text-decoration: underline;
      }
    }
    li {
      list-style: circle;
      &.active {
        list-style: unset;
        font-weight: bold;
      }
    }
  }
`

export const SiblingNav = styled.div`
  display: flex;
  justify-content: space-between;
`
export const SiblingNavItem = styled.div`
  max-width: 33.3333%;
  @media (max-width: ${Widths.Tablet}) {
    max-width: 48%;
  }
  .label {
    color: ${Colors.Foreground3};
  }
  a {
    text-decoration: none;
    color: ${Colors.Primary};
    i {
    }
    h3 {
      margin-top: ${SpaceUnit()};
      margin-bottom: ${SpaceUnit()};
    }
  }
`
