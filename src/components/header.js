import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import { logout } from "../redux/actions/logIn-logOut";

class Header extends Component {
  render() {
    let { loggedIn } = this.props;
    let { logout } = this.props.actions;

    return (
      <div className="header">
        <Link className= {loggedIn === false ? "navButtonHide" : "navButtonShow"} to="/">
          <Button variant="contained" size="small" color="primary">
            Home
          </Button>
        </Link>
        <Link className={loggedIn === true ? "navButtonHide" : "navButtonShow"} to="/login">
          <Button variant="contained" size="small" color="primary">
            Login
          </Button>
        </Link>
        <Link className={loggedIn === true ? "navButtonHide" : "navButtonShow"} to="/registration">
          <Button variant="contained" size="small" color="primary">
            Registration
          </Button>
        </Link>
        <Button
          className={loggedIn === false ? "navButtonHide" : "navButtonShow"}
          variant="contained"
          size="small"
          color="primary"
          onClick={() => {
            logout();
            localStorage.clear();
            window.location.href = "http://localhost:4000/login";
          }}
        >
          Sign Out
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
        logout
      },
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);