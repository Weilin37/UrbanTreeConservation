import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { NONE } from 'react-leaflet-freedraw';

// CREATE Thunk
export const getSearch = createAsyncThunk("search/getSearch", async (location, thunkAPI) => {
    location = location.replace(",","%2C")
    location = location.replace(" ","%20")
    try {
        const response = await axios.get("https://api.opencagedata.com/geocode/v1/json?key=efb8bfa10d614e67b5ba72a2934f6b25&q="+location+"&pretty=1");
        return await response.data;
    } catch (error) {
         return thunkAPI.rejectWithValue({ error: error.message });
    }
});


// CREATE SLICE
const mapSlice = createSlice({
  name: "map",
  initialState: {
    zoom: 3,
    lat: 37.8,
    lng: -96,
    search: "waiting",
    draw_mode: NONE,
  },
  reducers: {
    setZoom: (state, action) => {state.zoom = action.payload},
    setDrawMode: (state, action) => {state.draw_mode = action.payload},
    setSearch: (state, action) => {state.search = action.payload},
    setCenter: (state, action) => {
        state.lat = action.payload.lat;
        state.lng = action.payload.lng;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSearch.pending, (state) => {
        state.loading = "loading";
    });
    builder.addCase(getSearch.fulfilled, (state, { payload }) => {
        const lat = payload.results[0].geometry.lat
        const lng = payload.results[0].geometry.lng

        state.search = "searching";

        state.lat = lat;
        state.lng = lng;

        state.loading = "loaded";

        state.zoom = 10;
    });
    builder.addCase(getSearch.rejected,(state, action) => {
        state.loading = "error";
        state.error = action.error.message;
    });
  }
});

export const {
    setZoom,
    setCenter,
    setSearch,
    setDrawMode
} = mapSlice.actions;

export default mapSlice