import { createGlobalStyle } from "styled-components"
import { Colors, Fonts, SpaceUnit, Widths } from "./style-variables"
import { styleNormalize } from "./style-nomalize"

const GlobalStyle = createGlobalStyle`
  ${styleNormalize}

  * {
    box-sizing: border-box;
  }
  body {
    font-family: ${Fonts.Base};
    color: ${Colors.Black};
    min-width: 320px;
  }
  a {
    color: ${Colors.Black};
  }
  .container {
    max-width: ${Widths.Site};
    min-width: ${Widths.Mobile};
    margin-left: auto;
    margin-right: auto;
    padding-left: ${SpaceUnit()};
    padding-right: ${SpaceUnit()};
    height: 100%;
  }
  .container-sm {
    /* Extend .container */
    max-width: ${Widths.Site};
    min-width: ${Widths.Mobile};
    margin-left: auto;
    margin-right: auto;
    padding-left: ${SpaceUnit()};
    padding-right: ${SpaceUnit()};
    height: 100%;

    max-width: ${Widths.Content}
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-1 {
    flex: 1;
    overflow: auto;
  }
  .flex-0 {
    flex: 0;
    overflow: auto;
  }

  .align-left {
    text-align: left;
  }
  .align-right {
    text-align: right;
  }

  .hidden {
    display: none;
  }

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
`
export default GlobalStyle
