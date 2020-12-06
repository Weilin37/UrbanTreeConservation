import { createSlice,createSelector,PayloadAction,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// CREATE Thunk
export const getCoordinates = createAsyncThunk("coordinates/getCoordinates", async (_, thunkAPI) => {
    try {
        const response = await axios.get("/api/get/coordinates");
        return await response.data;
    } catch (error) {
         return thunkAPI.rejectWithValue({ error: error.message });
    }
});

// CREATE SLICE
const coordinateSlice = createSlice({
  name: "coordinates",
  initialState: {
    coordinates: [],
    loading: "loading",
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCoordinates.pending, (state) => {
        state.coordinates = [];
        state.loading = "loading";
    });
    builder.addCase(getCoordinates.fulfilled, (state, { payload }) => {
        state.coordinates = payload;
        state.loading = "loaded";
    });
    builder.addCase(getCoordinates.rejected,(state, action) => {
        state.loading = "error";
        state.error = action.error.message;
    });
  }
});


export const selectCoordinates = createSelector(
  (state) => ({
     coordinateSlice: state.coordinates,
     loading: state.loading,
  }), (state) =>  state
);

export default coordinateSlice