import { createGlobalStyle } from "styled-components"
import { styleNormalize } from "./style-nomalize"
import { Colors, Fonts, SpaceUnit } from "./style-variables"
import { theme } from "./theme"
import { codeHighlight } from "./code-highlight"

const GlobalStyle = createGlobalStyle`
  ${styleNormalize}
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

  ${codeHighlight}
  ${theme}
`
export default GlobalStyle
