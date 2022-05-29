import styled from "styled-components"
import { Border, Colors } from "../../styles/style-variables"

export const Footer = styled.footer<{ bordered: boolean }>`
  border-top: ${props => (props.bordered ? Border() : `none`)};
  background-color: transparent;
  text-align: center;
`

export const Copyright = styled.div`
  font-size: 14px;
  color: ${Colors.Foreground3};
  display: inline-flex;
  align-items: center;
`
