import styled from "styled-components"
import { Colors, SpaceUnit, ZIndex } from "../../styles/style-variables"
import { PropsWithChildren } from "react"

export const Sidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background-color: white;
  width: 300px;
  padding: ${SpaceUnit()} ${SpaceUnit()} ${SpaceUnit(4)} ${SpaceUnit(4)};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${SpaceUnit()};
  z-index: ${ZIndex.Sidebar};
`

export const CloseButton = styled.button<
  PropsWithChildren<{ onClick: () => void }>
>`
  position: relative;
  width: 40px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
  align-self: flex-end;
  justify-self: end;
  &:before {
    content: "close";
    visibility: hidden;
  }
  margin-bottom: ${SpaceUnit(2)};
  &:hover {
    background-color: ${Colors.Background2};
  }
  padding: ${SpaceUnit(2)} 0;
  border-radius: 2px;

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 3px;
    background: #333;
    border-radius: 2px;
    transform-origin: center;
    &:first-child {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &:last-child {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
`

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
