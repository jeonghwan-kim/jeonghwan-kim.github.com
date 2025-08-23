import styled from "styled-components"
import { Colors, SpaceUnit } from "../../styles/style-variables"
import { PropsWithChildren } from "react"

export const PostList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

export const PostItem = styled.li<PropsWithChildren>`
  a {
    text-decoration: none;
  }
  margin: ${SpaceUnit(4)} 0;
  &:first-of-type {
    margin-top: 0;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
  text-decoration: none;
  display: block;
`

export const PostTitle = styled.h2`
  color: ${Colors.Foreground2};
  margin-top: 0;
  margin-bottom: ${SpaceUnit()};
  &:hover {
    color: ${Colors.Primary};
  }
`

export const PostMeta = styled.div`
  color: ${Colors.Foreground2};
`
