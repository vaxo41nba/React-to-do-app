import React, { Component, createRef } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import { TodoItem } from "./components/TodoItem";
import "./App.css";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Snackbar from "@material-ui/core/Snackbar";
import * as jwt from "jsonwebtoken";

import {
  addItems,
  checkItem,
  editItem,
  deleteItem,
  selectAll,
  unselectAll,
  removeAll,
  getAll,
} from "./redux/actions/toDoItemRelated";
import { nextPage, prevPage } from "./redux/actions/paginationButtons";
import { showSnackbar } from "./redux/actions/snackbar";

class App extends Component {
  inputRef = createRef();
  drawList = () => {
    const { numberPerPage, currentPage, items } = this.props;

    const start = (currentPage - 1) * numberPerPage;
    const end = start + numberPerPage;
    return items.filter((item, index) => index >= start && index < end);
  };

  addItem = () => {
    const { addItems, showSnackbar } = this.props.actions;
    let { value } = this.inputRef.current;

    let token = localStorage.getItem("token");
    let decoded = jwt.decode(token, { complete: true });
    let username = decoded.payload.username;

    if (value.trim()) {
      axios
        .post("http://localhost:8000/add", {
          value,
          checked: false,
          user: username,
        })
        .then((response) => {
          const { value, checked, _id } = response.data;
          addItems(value, checked, _id);
          this.inputRef.current.value = "";
        })
        .catch((err) => {
          console.log(err + " unable to save to database");
        });
    } else {
      showSnackbar(true, "Please enter something :)")
      setTimeout(() => {
        showSnackbar(false, null)
      }, 2000);
    } 
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.addItem();
    }
  };

  handleCheckboxClick = (id, checkedStatus) => {
    const { checkItem } = this.props.actions;
    checkItem(id);
    axios
      .put(`http://localhost:8000/edit/${id}`, { checked: !checkedStatus })
      .then(() => {
        console.log(`Item checked successfully`);
      })
      .catch((err) => console.log(err));
  };

  handleEdit = (e, id, newValue) => {
    const { editItem } = this.props.actions;
    editItem(id, newValue);

    axios
      .put(`http://localhost:8000/edit/${id}`, { value: newValue })
      .then(() => {
        console.log(`Item edited successfully`);
      })
      .catch((err) => console.log(err));
  };

  handleDeleteClick = (id) => {
    const { deleteItem } = this.props.actions;
    deleteItem(id);

    axios
      .delete(`http://localhost:8000/delete/${id}`)
      .then((doc) => {
        if (!doc) {
          console.log("Error");
        }
        console.log("Successfully deleted");
      })
      .catch((error) => {
        console.log(error + " Unable to delete");
      });
  };

  handleSelectAll = () => {
    const { selectAll } = this.props.actions;
    selectAll();

    axios
      .put(`http://localhost:8000/selectAll`)
      .then((res) => {
        if (!res) console.log("No Response");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleUnselectAll = () => {
    const { unselectAll } = this.props.actions;
    unselectAll();

    axios
      .put(`http://localhost:8000/unSelectAll`)
      .then((res) => {
        if (!res) console.log("No Response");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleRemoveAll = () => {
    const { removeAll } = this.props.actions;
    removeAll();

    axios
      .delete(`http://localhost:8000/deleteSelected/`)
      .then((doc) => {
        if (!doc) {
          console.log("Error");
        } else {
          console.log("Successfully deleted");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  get = () => {
    const { getAll } = this.props.actions;
    let token = localStorage.getItem("token");
    let decoded = jwt.decode(token, { complete: true });
    let username = decoded.payload.username;

    axios
      .get(`http://localhost:8000/${username}`)
      .then((response) => {
        getAll(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    } else {
      this.get();
    }
  }

  render() {
    const { items, currentPage, numberPerPage, snackbarState, snackbarMessage } = this.props;
    const { prevPage, nextPage, showSnackbar } = this.props.actions;
    const showItems = this.drawList();
    let numberOfPages = Math.ceil(items.length / numberPerPage);
    return (
      <div className="App">
        <h1 className="title">To-Do List</h1>
        <TextField
          id="listItem"
          label="Add New Task"
          placeholder="Write Down..."
          multiline
          variant="outlined"
          size="small"
          onKeyPress={this.handleKeyPress}
          inputRef={this.inputRef}
        />
        <Fab
          id="button"
          size="small"
          color="primary"
          aria-label="add"
          onClick={this.addItem}
        >
          <AddIcon />
        </Fab>
        <ul id="list">
          {showItems.map((item) => {
            return (
              <TodoItem
                item={item}
                key={item._id}
                remove={this.handleDeleteClick}
                edit={this.handleEdit}
                check={this.handleCheckboxClick}
                showSnackbar={showSnackbar}
                snackbarState={snackbarState}
                snackbarMessage={snackbarMessage}
              />
            );
          })}
        </ul>
        <KeyboardArrowLeftIcon
          className={currentPage <= 1 ? "hide" : "show"}
          fontSize="large"
          id="previous"
          onClick={() => prevPage()}
        />
        <Button size="small" variant="outlined" color="primary">
          {currentPage}
        </Button>
        <KeyboardArrowRightIcon
          className={
            currentPage === numberOfPages || items.length === 0
              ? "hide"
              : "show"
          }
          fontSize="large"
          id="next"
          onClick={() => nextPage()}
        />
        <br />

        <div className="bigButtons">
          <Button
            variant="outlined"
            color="primary"
            onClick={this.handleSelectAll}
          >
            Complete Tasks
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.handleUnselectAll}
          >
            Uncomplete Tasks
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.handleRemoveAll}
          >
            Remove Completed Tasks
          </Button>

          <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbarState}
          message={snackbarMessage}
        />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    items: state.items,
    numberPerPage: state.numberPerPage,
    currentPage: state.currentPage,
    loggedIn: state.loggedIn,
    snackbarState: state.snackbarState,
    snackbarMessage: state.snackbarMessage
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
        addItems,
        checkItem,
        editItem,
        deleteItem,
        selectAll,
        unselectAll,
        removeAll,
        getAll,
        nextPage,
        prevPage,
        showSnackbar
      },
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
