class Header extends React.Component {
  componentDidMount() {
    // 로깅
    console.log(`[Header] 마운트`)
  }
  render() {
    return <header>Header</header>
  }
}

class Button extends React.Component {
  componentDidMount() {
    // 로깅
    console.log(`[Button] 마운트`)
  }
  handleClick = () => {
    // 로깅
    console.log(`[Button] 클릭`)
  }
  render() {
    return <button onClick={this.handleClick}>클릭</button>
  }
}

const App = () => (
  <>
    <Header />
    <Button />
  </>
)

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
