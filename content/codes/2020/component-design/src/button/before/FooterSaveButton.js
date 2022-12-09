import * as React from "react"
import "./FooterSaveButton.css"

export default class FooterSaveButton extends React.Component {
  constructor() {
    super()
    this.state = { fetching: false }
  }
  render() {
    const { fetching } = this.state
    return (
      <button
        className="FooterSaveButton"
        disabled={fetching}
        onClick={() => this.onClick()}
      >
        {fetching ? "저장중..." : "저장"}
      </button>
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
