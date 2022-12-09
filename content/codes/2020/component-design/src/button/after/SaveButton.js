import * as React from "react"
import FooterButton from "./FooterButton"

/**
 * 역할: 어떻게 동작함
 * - 클릭 처리기
 * - 버튼 클릭 막음
 */
export default class SaveButton extends React.Component {
  constructor() {
    super()
    this.state = { fetching: false }
  }
  render() {
    const { fetching } = this.state

    return (
      <FooterButton disabled={fetching} onClick={this.onClick.bind(this)}>
        {fetching ? "저장중..." : "저장"}
      </FooterButton>
    )
  }
  onClick() {
    this.setState({ fetching: true })
    this.save(() => this.setState({ fetching: false }))
  }
  save(callback) {
    setTimeout(callback, 1000)
  }
}
