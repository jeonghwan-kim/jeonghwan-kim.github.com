import styled from "styled-components"
import { Colors, SpaceUnit, Widths } from "../../styles/style-variables"
import { PropsWithChildren } from "react"

export const PostList = styled.ul`
  list-style: none;
  padding: 0;
`

export const PostItem = styled.li<PropsWithChildren>`
  a {
    text-decoration: none;
  }
  margin: ${SpaceUnit(4)} 0;
  text-decoration: none;
  display: block;
`

export const PostTitle = styled.h2`
  color: ${Colors.Foreground2};
  margin-bottom: ${SpaceUnit()};
  &:hover {
    color: ${Colors.Primary};
  }
`

export const PostMeta = styled.div`
  color: ${Colors.Foreground2};
`
