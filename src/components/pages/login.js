import React, { Component, createRef } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";

import { login } from "../../redux/actions/logIn-logOut";
import { showSnackbar } from "../../redux/actions/snackbar";

class Login extends Component {
  idField = createRef();
  passField = createRef();

  authorisation = (e) => {
    const { login, showSnackbar } = this.props.actions;
    e.preventDefault();
    let idField = this.idField.current.value;
    let passField = this.passField.current.value;

    if (!idField.trim() && !passField.trim()) {
      showSnackbar(true, "Please, enter username and password.");
    } else if (!passField.trim()) {
      showSnackbar(true, "Please, enter password.");
    } else if (!idField.trim()) {
      showSnackbar(true, "Please, enter username.");
    } else {
      let userObject = {
        // COMMENT hash getrequest for pass
        username: idField,
        password: passField,
      };

      axios
        .post("http://localhost:8000/login", userObject)
        .then((res) => {
          if (res.data === 'Incorrect password') {
              showSnackbar(true, 'Incorrect password');
            } else if (res.data === 'No Users Found') {
              showSnackbar(true, 'No Users Found');
            } else {
              login();
              localStorage.setItem('token', res.data.token);
              this.props.history.push('/');
            }
      	})
        .catch((err) => {
          console.error(err);
          showSnackbar(true, "Error logging in please try again.");
        });
    }
  };

  handleKeyPress = (e) => {
    const { showSnackbar } = this.props.actions;
    if (e.key === "Enter") {
      e.preventDefault();
      this.authorisation(e);
      setTimeout(() => {
        showSnackbar(false, null);
      }, 2000);
    }
  };

  render() {
    const { snackbarState, snackbarMessage } = this.props;
    const { showSnackbar } = this.props.actions;
    return (
      <section className="login">
        <h1>Login</h1>
        <div className="loginBody">
          <label className="ID">ID </label>
          <TextField
            inputRef={this.idField}
            size="small"
            label="Enter your ID"
            variant="outlined"
            onKeyPress={this.handleKeyPress}
          />
          <br />
          <label className="password">Password </label>
          <TextField
            inputRef={this.passField}
            size="small"
            type="password"
            label="Enter your Password"
            variant="outlined"
            onKeyPress={this.handleKeyPress}
          />
          <br />
        </div>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={(e) => {
            this.authorisation(e);
            setTimeout(() => {
              showSnackbar(false, null);
            }, 2000);
          }}
        >
          Authorize
        </Button>
        <br />
        <span id="forgotPassword">Forgot Password</span>

        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbarState}
          message={snackbarMessage}
        />
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn,
    snackbarState: state.snackbarState,
    snackbarMessage: state.snackbarMessage
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
        login,
        showSnackbar
      },
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
