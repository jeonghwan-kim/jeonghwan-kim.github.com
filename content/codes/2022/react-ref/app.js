class App extends React.Component {
  elementRef = { current: null } // current 속성을 가진 객체를 정의해도 된다.
  componentRef = React.createRef() // createRef() 함수를 사용해도 된다

  state = { value: 0 }

  constructor() {
    super()

    console.log("constructor", this.elementRef) // { current: null }
  }

  componentDidMount() {
    console.log("componentDidMount", this.elementRef) // { current: <button> }

    if (this.elementRef.current) {
      this.elementRef.current.focus()
      this.elementRef.current.style.background = "red"
    }

    if (this.componentRef.current) {
      console.log(
        "componentDidMount",
        this.componentRef, // { current: Foo }
        this.componentRef.current instanceof Foo // true
      )
    }
  }

  componentDidUpdate() {
    console.log("componentDidUpdate", this.elementRef)
  }

  handleClick = () => this.setState({ value: this.state.value + 1 })

  render() {
    console.log("render", this.elementRef) // { current: <button> }

    return (
      <>
        {this.state.value}
        <button ref={this.elementRef} onClick={this.handleClick}>
          상태 업데이트 하기
        </button>
        <Foo ref={this.componentRef} />
      </>
    )
  }
}

class Foo extends React.Component {
  render() {
    return <div>Foo Component</div>
  }
}

const root = ReactDOM.createRoot(document.querySelector("#root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
