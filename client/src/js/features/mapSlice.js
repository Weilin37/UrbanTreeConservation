import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

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
    searchLatNE: 37.8,
    searchLngNE: -96,
    lat: 37.8,
    lng: -96,
    previous_lat: 37.8,
    previous_lng: -96,
  },
  reducers: {
    setSearchBounds: (state, action) => {
        state.searchLatNE = action.payload.latNE;
        state.searchLngNE = action.payload.lngNE;
    },
    setZoom: (state, action) => {state.zoom = action.payload},
    setCenter: (state, action) => {
        state.previous_lat = state.lat;
        state.previous_lng = state.lng;
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

        state.previous_lat = state.lat;
        state.previous_lng = state.lng;

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
    setSearchBounds,
    setZoom,
    setCenter,
    setSearch
} = mapSlice.actions;

export default mapSlice