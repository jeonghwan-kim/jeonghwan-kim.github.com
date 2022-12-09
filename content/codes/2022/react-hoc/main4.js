class App extends React.Component {
  constructor() {
    super()
    this.state = { count: 0 }
  }
  handleClick = () => this.setState({ count: this.state.count + 1 })
  render() {
    class Button extends React.Component {
      constructor() {
        super()
        this.state = {
          count: 0,
        }
      }
      handleClick = () => this.setState({ count: this.state.count + 1 })
      render() {
        return (
          <button onClick={this.handleClick}>Button:{this.state.count}</button>
        )
      }
    }
    return (
      <>
        <Button />
        <button onClick={this.handleClick}>App: {this.state.count}</button>
      </>
    )
  }
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
