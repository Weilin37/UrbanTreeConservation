import { createSlice,createSelector,PayloadAction,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// CREATE Thunk
export const getMarkers = createAsyncThunk("markers/getMarkers", async (_, thunkAPI) => {
    try {
        const response = await axios.get("/api/get/markers");
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
    loading: "loading",
    error: "",
  },
  reducers: {},
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


export const selectMarkers = createSelector(
  (state) => ({
     markerSlice: state.markers,
     loading: state.loading,
  }), (state) =>  state
);

export default markerSlice