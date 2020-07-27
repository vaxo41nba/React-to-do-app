import { actionTypes } from "./redux/actions/actionTypes";

const initialState = {
  items: [],
  numberPerPage: 10,
  currentPage: 1,
  loggedIn: localStorage.getItem("token") ? true : false,
  snackbarState: false,
  snackbarMessage: null
};

const reducer = (state = initialState, action) => {
  const { items, numberPerPage, currentPage } = state;
  switch (action.type) {
    case actionTypes.ADD_ITEM:
      return {
        ...state,
        items: [
          ...items,
          {
            value: action.value,
            checked: action.checked,
            _id: action.id,
          },
        ],
        currentPage: Math.ceil((items.length + 1) / numberPerPage),
      };

    case actionTypes.CHECK_ITEM:
      const checkedItems = items.map((item) =>
        item._id !== action.id ? item : { ...item, checked: !item.checked }
      );
      return {
        ...state,
        items: checkedItems,
      };

    case actionTypes.EDIT_ITEM:
      const editedItems = items.map((item) =>
        item._id !== action.id ? item : { ...item, value: action.value }
      );
      return {
        ...state,
        items: editedItems,
      };

    case actionTypes.DELETE_ITEM:
      return {
        ...state,
        items: items.filter((item) => item._id !== action.id),
        currentPage:
          items.length % numberPerPage === 1
            ? Math.ceil((items.length - 1) / numberPerPage)
            : currentPage,
      };

    case actionTypes.NEXT_PAGE:
      return {
        ...state,
        currentPage: currentPage + 1,
      };

    case actionTypes.PREV_PAGE:
      return {
        ...state,
        currentPage: currentPage - 1,
      };

    case actionTypes.SELECT_ALL:
      const selectedItems = items.map((item) => ({ ...item, checked: true }));
      return {
        ...state,
        items: selectedItems,
      };

    case actionTypes.UNSELECT_ALL:
      const unselectedItems = items.map((item) => ({
        ...item,
        checked: false,
      }));
      return {
        ...state,
        items: unselectedItems,
      };

    case actionTypes.REMOVE_ALL:
      let numberOfPages = Math.ceil(items.length / numberPerPage);
      const checkItems = [];
      items.forEach((item) => {
        if (item.checked) checkItems.push(item);
      });
      return {
        ...state,
        items: items.filter((item) => item.checked === false),
        currentPage:
          items.length % numberPerPage >= 0 &&
          items.length % numberPerPage < numberPerPage &&
          currentPage === numberOfPages
            ? Math.ceil((items.length - checkItems.length) / numberPerPage)
            : currentPage,
      };

    case actionTypes.GET_ALL:
      return {
        ...state,
        items: action.items,
      };

    case actionTypes.LOG_IN:
      return {
        ...state,
        loggedIn: true
      };

    case actionTypes.LOG_OUT:
      return {
        ...state,
        loggedIn: false
      };

      case actionTypes.SNACKBAR:
        return {
          ...state,
          snackbarState: action.show,
          snackbarMessage: action.message
        };

    default:
      return state;
  }
};
export default reducer;
