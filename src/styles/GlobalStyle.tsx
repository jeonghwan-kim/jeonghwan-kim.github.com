import { createGlobalStyle } from "styled-components"
import { styleNormalize } from "./style-nomalize"
import { Colors, Fonts, SpaceUnit } from "./style-variables"
import { theme } from "./theme"

const GlobalStyle = createGlobalStyle`
  ${styleNormalize}
  ${theme}

  * {
    box-sizing: border-box;
  }
  body {
    font-family: ${Fonts.Base};
    color: ${Colors.Foreground1};
    background-color: ${Colors.Background1};
    min-width: 320px;
  }
  a {
    color: ${Colors.Foreground1};
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
