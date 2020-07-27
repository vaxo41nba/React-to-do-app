import { actionTypes } from "./actionTypes";

export const login = () => {
  return {
    type: actionTypes.LOG_IN
  };
};

export const logout = () => {
  return {
    type: actionTypes.LOG_OUT
  };
};
