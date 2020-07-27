import { actionTypes } from "./actionTypes";

export const showSnackbar = (show, message) => {
  return {
    type: actionTypes.SNACKBAR,
    show,
    message
  };
};