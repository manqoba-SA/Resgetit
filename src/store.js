import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productDetailsReducer,
  productListReducer,
  categoryListReducer,
} from "./reducers/productReducers";
import authReducer from "./reducers/authReducers";
import cartReducer from "./reducers/cartReducer";
import { annoncementListReducer } from "./reducers/announcementReducer";

const reducer = combineReducers({
  categoryList: categoryListReducer,
  announcementList: annoncementListReducer,
  productList: productListReducer,
  productDetails: productDetailsReducer,
  authList: authReducer,
  cart: cartReducer,
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
