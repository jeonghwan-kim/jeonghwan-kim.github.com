let count = 0

const App = () => {
  console.log(count++) // 0, 1
  return <div>App</div>
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
