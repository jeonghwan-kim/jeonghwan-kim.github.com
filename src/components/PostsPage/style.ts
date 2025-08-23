import styled from "styled-components"
import { Colors, SpaceUnit } from "../../styles/style-variables"
import { PropsWithChildren } from "react"

export const Wrapper = styled.div`
  padding: ${SpaceUnit()};
`

export const ArchiveList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
`

export const ArchiveListItem = styled.li<PropsWithChildren>`
  a {
    padding: ${SpaceUnit()} ${SpaceUnit()};
    display: flex;
    align-items: center;
    text-decoration: none;
    border-radius: 6px;
    font-size: 14px;
    &.active {
      background-color: ${Colors.Primary};
      color: ${Colors.Background1};
    }
    &:hover {
      cursor: pointer;
    }
    label {
      flex: 1;
      &:hover {
        cursor: pointer;
      }
    }
  }
`

export const ArchiveListTitle = styled(ArchiveListItem)`
  color: ${Colors.Foreground3};
  font-weight: 500;
  font-size: 12px;
  padding-left: 0;
  margin-bottom: ${SpaceUnit()};
`

export const TagList = styled(ArchiveList)`
  margin-top: ${SpaceUnit(3)};
`
export const TagListTitle = styled(ArchiveListTitle)``
export const TagListItem = styled(ArchiveListItem)`
  display: inline-block;
  a {
    background-color: ${Colors.Background2};
    border-radius: 4px;
    margin-right: ${SpaceUnit(0.5)};
    margin-bottom: ${SpaceUnit(0.5)};
  }
`

export const SeriesList = styled(ArchiveList)`
  margin-top: ${SpaceUnit(3)};
`
export const SeriesListTitle = styled(ArchiveListTitle)``
export const SeriesListItem = styled(ArchiveListItem)``
