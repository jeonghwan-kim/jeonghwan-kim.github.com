import { css } from "styled-components"
import { Colors, SpaceUnit } from "./style-variables"

export const codeHighlight = css`
  .gatsby-highlight {
    font-size: 14px;
    line-height: 1.5em;
    pre {
      position: relative;
      button.copy {
        position: absolute;
        top: ${SpaceUnit()};
        right: ${SpaceUnit()};
        background-color: transparent;
        border: none;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .gatsby-highlight-code-line {
    display: block;
    background-color: rgba(255, 255, 255, 0.65);
    box-shadow: inset;
    margin-right: -1em;
    margin-left: -1em;
    padding-right: 1em;
    padding-left: 0.75em;
    border-left: 0.25em solid ${Colors.Primary};
  }
`
