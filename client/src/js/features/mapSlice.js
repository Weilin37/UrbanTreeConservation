import { createSlice,createSelector } from "@reduxjs/toolkit";

// CREATE SLICE
const mapSlice = createSlice({
  name: "map",
  initialState: {
    bounds: [],
    zoom: 3,
    center: [37.8, -96]
  },
  reducers: {
    getBounds: (state, action) => {
        state.bounds = action.payload
    },
    getZoom: (state, action) => {
        state.zoom = action.payload
    },
    getCenter: (state, action) => {
        state.center = action.payload
    },
  },
});

export const selectMarkers = createSelector(
  (state) => ({
     mapSlice: state.bounds,
  }), (state) =>  state
);

export default mapSlice