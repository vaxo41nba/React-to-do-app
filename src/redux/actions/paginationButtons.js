import { actionTypes } from "./actionTypes";

export const nextPage = () => {
  return {
    type: actionTypes.NEXT_PAGE,
  };
};

export const prevPage = () => {
  return {
    type: actionTypes.PREV_PAGE,
  };
};
