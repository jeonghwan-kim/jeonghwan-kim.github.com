import * as React from "react"
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom"
import RouteIf, { ROLE } from "./componentns/RouteIf.jsx"
import HomePage from "./pages/HomePage.jsx"
import UserManagePage from "./pages/UserManagePage.jsx"
import ProductManagePage from "./pages/ProductManagePage.jsx"
import AuthManagePage from "./pages/AuthManagePage.jsx"

const myRole = {
  users: ROLE.WRITE, // NONE | READ | WRITE
  products: ROLE.READ,
  auth: ROLE.NONE,
}

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <RouteIf
            path="/users"
            exact
            component={UserManagePage}
            role={ROLE.NONE}
          />
          <RouteIf
            path="/products"
            exact
            component={ProductManagePage}
            role={myRole.products}
          />
          <RouteIf
            path="/auth"
            exact
            component={AuthManagePage}
            role={myRole.auth}
          />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    )
  }
}
