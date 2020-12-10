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
    previous_zoom: 3,
    latBndNE: null,
    lngBndNE: null,
    latBndSW: null,
    lngBndSW: null,
    searchLatNE: null,
    searchLngNE: null,
    searchLatSW: null,
    searchLngSW: null,
    lat: 37.8,
    lng: -96,
    previous_lat: 37.8,
    previous_lng: -96,
    search: "",
    previous_search: "",
  },
  reducers: {
    setLatBndNE: (state, action) => {state.latBndNE = action.payload},
    setLngBndNE: (state, action) => {state.lngBndNE = action.payload},
    setLatBndSW: (state, action) => {state.latBndSW = action.payload},
    setLngBndSW: (state, action) => {state.lngBndSW = action.payload},
    setSearchLatNE: (state, action) => {state.searchLatNE = action.payload},
    setSearchLngNE: (state, action) => {state.searchLngNE = action.payload},
    setSearchLatSW: (state, action) => {state.searchLatSW = action.payload},
    setSearchLngSW: (state, action) => {state.searchLngSW = action.payload},
    setZoom: (state, action) => {
        state.previous_zoom = state.zoom
        state.zoom = action.payload
    },
    setLat: (state, action) => {
        state.previous_lat = state.lat
        state.lat = action.payload
    },
    setLng: (state, action) => {
        state.previous_lng = state.lng
        state.lng = action.payload
    },
    setSearch: (state, action) => {
        state.previous_search = state.search
        state.search = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSearch.pending, (state) => {
        state.loading = "loading";
    });
    builder.addCase(getSearch.fulfilled, (state, { payload }) => {
        const lat = payload.results[0].geometry.lat
        const lng = payload.results[0].geometry.lng

        state.previous_lat = state.lat
        state.previous_lng = state.lng
        state.lat = lat;
        state.lng = lng;

        state.loading = "loaded";

        state.previous_zoom = state.zoom
        state.zoom = 11;
    });
    builder.addCase(getSearch.rejected,(state, action) => {
        state.loading = "error";
        state.error = action.error.message;
    });
  }
});

export const {
    setLatBndNE,
    setLngBndNE,
    setLatBndSW,
    setLngBndSW,
    setSearchLatNE,
    setSearchLngNE,
    setSearchLatSW,
    setSearchLngSW,
    setZoom,
    setLat,
    setLng,
    setSearch
} = mapSlice.actions;

export default mapSlice