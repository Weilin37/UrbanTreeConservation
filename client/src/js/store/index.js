// src/js/store/index.js
import {
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import markerSlice from "../features/markerSlice";
import mapSlice from "../features/mapSlice";
import analysisSlice from "../features/analysisSlice";


const middleware = [
  ...getDefaultMiddleware({immutableCheck: false, serializableCheck: false}),
  /*YOUR CUSTOM MIDDLEWARES HERE*/
];

const rootReducer = combineReducers({
    marker: markerSlice.reducer,
    map: mapSlice.reducer,
    analysis: analysisSlice.reducer,
});

// CREATE STORE
export const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export default store;