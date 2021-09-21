import { createStore, applyMiddleware } from "redux";
import { composeWithDevtools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReduer from "./reducers";

const initialState = {};

const middleware = [thunk];
