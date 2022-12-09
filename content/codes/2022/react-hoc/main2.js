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

const EnhancedButton = withLogging(Button)

const App = () => (
  <>
    <EnhancedHeader />
    <EnhancedButton />
  </>
)

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
