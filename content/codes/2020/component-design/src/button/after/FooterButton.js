import * as React from "react"
import "./FooterButton.css"

/**
 * 역할: 어떻게 보여짐
 * - 활성/비활성시의 모습을 결정 (by css)
 * - 버튼 모습
 * - 클릭여부를 전달
 */
const FooterButton = props => (
  <button className="FooterButton" {...props}>
    {props.children}
  </button>
)

export default FooterButton
