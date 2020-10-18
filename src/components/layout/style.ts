import styled, { css } from "styled-components"
import { Border, SpaceUnit, Widths } from "../../styles/style-variables"

export const AsideLeft = styled.aside`
  align-self: flex-start;
  min-width: 200px;
  height: 100vh;
  overflow-y: hidden;
  border-right: ${Border()};
  position: sticky;
  top: 0px;
  @media (max-width: calc(${Widths.Tablet} - 1px)) {
    display: none;
  }
`

export const Main = styled.main<{ hasAside: boolean }>`
  ${props =>
    props.hasAside &&
    css`
      padding-left: ${SpaceUnit(4)};
      @media (max-width: calc(${Widths.Tablet} - 1px)) {
        padding-left: 0;
      }
    `}
`

export const Section = styled.section`
  padding: ${SpaceUnit(6)} ${SpaceUnit()};
`

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
`
