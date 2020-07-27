import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import * as serviceWorker from "./serviceWorker";
import Login from "./components/pages/login";
import Registration from "./components/pages/registration";
import Header from "./components/header";
import Dropdown from "./components/pages/Dropdown";
import { Notfound } from "./components/pages/notFound";

import "./index.css";
import App from "./App";
import reducer from "./rootReducer";
import withAuth from "./components/withAuth";

//           final state
export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // chrome devtools thing
);

ReactDOM.render(
  <React.Fragment>
    <SnackbarProvider maxSnack={3}>
    <Provider store={store}>
      <Router>
        <div className="main">
          <Header />
          <Switch>
            <Route exact path="/" component={withAuth(App)} />
            <Route path="/login" component={Login} />
            <Route path="/registration" component={Registration} />
            <Route path="/dropdown" component={Dropdown} />
            <Route component={Notfound} />
          </Switch>
        </div>
      </Router>
    </Provider>
    </SnackbarProvider>
  </React.Fragment>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
