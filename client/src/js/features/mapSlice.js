import { createSlice,createSelector,createAction } from "@reduxjs/toolkit";

// CREATE SLICE
const mapSlice = createSlice({
  name: "map",
  initialState: {
    latNE: null,
    lngNE: null,
    latSW: null,
    lngSW: null,
    zoom: 3,
    lat: 37.8,
    lng: -96,
  },
  reducers: {
    setLatNE: (state, action) => {state.latNE = action.payload},
    setLngNE: (state, action) => {state.lngNE = action.payload},
    setLatSW: (state, action) => {state.latSW = action.payload},
    setLngSW: (state, action) => {state.lngSW = action.payload},
    setZoom: (state, action) => {state.zoom = action.payload},
    setLat: (state, action) => {state.lat = action.payload},
    setLng: (state, action) => {state.lng = action.payload},
  },
});

export const selectMarkers = createSelector(
  (state) => ({
     mapSlice: state.bounds,
  }), (state) =>  state
);

export const { setLatNE, setLngNE, setLatSW, setLngSW, setZoom, setLat, setLng } = mapSlice.actions;

export default mapSlice