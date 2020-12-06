// src/js/store/index.js
import {
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import coordinateSlice from "../features/coordinateSlice";


const middleware = [
  ...getDefaultMiddleware(),
  /*YOUR CUSTOM MIDDLEWARES HERE*/
];

const rootReducer = combineReducers({
    coordinate: coordinateSlice.reducer
});

// CREATE STORE
const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export default store;