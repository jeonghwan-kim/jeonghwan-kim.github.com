import styled from "styled-components"
import { Colors, SpaceUnit, Widths } from "../../styles/style-variables"

export const PostList = styled.ul`
  list-style: none;
  padding: 0;
`

export const PostItem = styled.li`
  a {
    text-decoration: none;
  }
  margin: ${SpaceUnit(7)} 0;
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

export const PostSummary = styled.p`
  color: ${Colors.Foreground1};
  line-height: 1.5em;
  @media (max-width: calc(${Widths.Tablet} - 1px)) {
    display: none;
  }
`
