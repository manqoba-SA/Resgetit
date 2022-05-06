import * as actionTypes from "../constants/cartConstants";
import { updateObject } from "../storeUtility";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

const cartStart = (state, action) => {
  return updateObject(state, {
    // data: {},
    error: null,
    loading: true,
  });
};

const cartSuccess = (state, action) => {
  return updateObject(state, {
    data: action.data,
    error: null,
    loading: false,
  });
};

const cartFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CART_START:
      return cartStart(state, action);
    case actionTypes.CART_SUCCESS:
      return cartSuccess(state, action);
    case actionTypes.CART_FAIL:
      return cartFail(state, action);
    default:
      return state;
  }
};

export default cartReducer;
