import styled from "styled-components"
import { Border, Colors } from "../../../styles/style-variables"

export const SiteFooter = styled.footer`
  border-top: ${Border()};
  background-color: transparent;
  text-align: center;
`

export const Copyright = styled.div`
  font-size: 14px;
  color: ${Colors.Black};
  display: inline-flex;
  align-items: center;
`
