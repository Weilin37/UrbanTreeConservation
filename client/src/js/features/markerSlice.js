import { createSlice,createSelector,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// CREATE Thunk
export const getMarkers = createAsyncThunk("markers/getMarkers", async (endpoint, thunkAPI) => {
    try {
        const response = await axios.get(endpoint);
        return await response.data;
    } catch (error) {
         return thunkAPI.rejectWithValue({ error: error.message });
    }
});

// CREATE SLICE
const markerSlice = createSlice({
  name: "markers",
  initialState: {
    markers: [],
    markerType: "cities",
    endpoint: "/api/get/cities",
    loading: "loading",
    error: "",
  },
  reducers: {
    setMarkerType: (state, action) => {state.markerType = action.payload},
    setEndpoint: (state, action) => {
        state.markerType = action.payload;
        if (action.payload === "cities") {
            state.endpoint = "/api/get/cities"
        } else if (action.payload === "trees") {
            state.endpoint = "/api/get/markers"
        }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMarkers.pending, (state) => {
        state.markers = [];
        state.loading = "loading";
    });
    builder.addCase(getMarkers.fulfilled, (state, { payload }) => {
        state.markers = payload;
        state.loading = "loaded";
    });
    builder.addCase(getMarkers.rejected,(state, action) => {
        state.loading = "error";
        state.error = action.error.message;
    });
  }
});

export const { setMarkerType, setEndpoint } = markerSlice.actions;

export const selectMarkers = createSelector(
  (state) => ({
     markerSlice: state.markers,
     loading: state.loading,
     markerType: state.markerType,
     endpoint: state.endpoint
  }), (state) =>  state
);

export default markerSlice