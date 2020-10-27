import styled from "styled-components"
import { Border, Widths } from "../../styles/style-variables"

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

export const Main = styled.main``
