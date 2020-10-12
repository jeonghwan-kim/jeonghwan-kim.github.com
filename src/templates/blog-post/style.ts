import styled from "styled-components"
import Content from "../../components/layout/content"
import {
  Border,
  Colors,
  Fonts,
  SpaceUnit,
  Widths,
} from "../../styles/style-variables"
import Video2Img from "./images/icon-video-2.png"

export const BlogPost = styled(Content)`
  main {
    margin-top: ${SpaceUnit(10)};
    @media (max-width: ${Widths.Tablet}) {
      margin-top: ${SpaceUnit(5)};
    }
    @media (max-width: ${Widths.Mobile}) {
      margin-top: ${SpaceUnit(2)};
    }
    display: flex;
    align-items: flex-start;
    article {
      order: 0;
    }
    aside {
      order: 1;
    }

    aside {
      width: 250px;
      position: sticky;
      max-height: 100vh;
      overflow-y: scroll;
      top: ${SpaceUnit()};
      margin-left: ${SpaceUnit(4)};
      padding-bottom: ${SpaceUnit()};
      @media (max-width: ${Widths.Desktop} - 1) {
        display: none;
      }
    }

    article {
      // HACK: 안그러면 우측에 추가공간 생김
      // overflow-x: hidden;
      flex: 1 0 0%;
      min-width: 0%;
      header {
        margin-bottom: 7 * ${SpaceUnit()};
        h1 {
          margin-top: 0;
          margin-bottom: ${SpaceUnit()};
          color: ${Colors.Black};
          font-size: 42px;
        }
        time {
          color: ${Colors.Gray};
        }
      }
      .post-content {
        font-size: 18px;
        line-height: 1.5em;
        font-family: ${Fonts.Article};
        h1 {
          font-size: 200%;
          margin-top: 20px;
        }
        h2 {
          font-size: 180%;
          margin-top: 18px;
        }
        h3 {
          font-size: 160%;
          margin-top: 16px;
        }
        h4 {
          font-size: 140%;
          margin-top: 14px;
        }
        h5 {
          font-size: 120%;
          margin-top: 12px;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          color: ${Colors.Brand};
          font-family: ${Fonts.Base};
          line-height: 1em;
        }
        img {
          border-radius: ${SpaceUnit()} / 2;
          display: block;
          margin: ${SpaceUnit()} * 2 auto;
          max-width: 100%;
        }
        blockquote {
          color: lighten(${Colors.Black}, 20%);
          position: relative;
          &::before {
            content: "“";
            position: absolute;
            left: -${SpaceUnit()} * 3;
            font-size: 40px;
            color: lighten(${Colors.Black}, 60%);
          }
        }
        .gatsby-highlight {
          // overflow-x: scroll;
          // width: 100%;
          // max-width: 694px;
          // @media (max-width: $mobile-width) {
          //   max-width: $mobile-width;
          // }
          pre {
            border-radius: ${SpaceUnit()} / 2;
            overflow: auto;
            word-wrap: normal;
            white-space: pre;
          }
        }
      }
      .post-meta {
        margin-top: ${SpaceUnit()} * 4;
      }
    }
  }
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

export const TagItem = styled.li`
  display: inline-block;
  margin-right: ${SpaceUnit()};
  &:last-child {
    margin-right: 0;
  }
`

export const Toc = styled.div`
  border-left: ${Border(2)};
  ul {
    padding-left: ${SpaceUnit(2)};
    list-style: none;
    margin: 0;
    li {
      margin-bottom: 4px;
      p {
        margin: 0;
      }
      a {
        text-decoration: none;
        color: ${Colors.Gray};
        font-size: 14px;
        &:hover,
        &:focus {
          color: ${Colors.Black};
        }
        &.active {
          color: ${Colors.Brand};
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
    color: ${Colors.Gray};
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
      color: ${Colors.Gray};
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
    color: ${Colors.Gray};
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
