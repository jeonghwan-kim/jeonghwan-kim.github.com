const getComponentName = ({ displayName, name }) =>
  displayName || name || "Component"

const withLogging = WrappedComponent => {
  const log = message => {
    console.log(`[${getComponentName(WrappedComponent)}]`, message)
  }

  class WithLogging extends React.Component {
    renderCount = 0

    componentDidMount() {
      log("마운트")
    }

    render() {
      this.renderCount++
      log(`${this.renderCount}회 렌더`)

      const enhancedProps = {
        log,
      }

      return <WrappedComponent {...this.props} {...enhancedProps} />
    }
  }

  WithLogging.displayName = `WithLogging(${getComponentName(WrappedComponent)})`

  return WithLogging
}

const Header = () => <header>Header</header>

const EnhancedHeader = withLogging(Header)

const Button = ({ log }) => {
  const handleClick = () => log("클릭")
  return <button onClick={handleClick}>클릭</button>
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      count: 0,
    }
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    const EnhancedButton = withLogging(Button)
    return (
      <>
        <EnhancedHeader />
        <EnhancedButton />
        <div>
          <span>Count: {this.state.count}</span>
          <button onClick={this.handleClick}>Plus</button>
        </div>
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
