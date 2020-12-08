import { createSlice,createSelector,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// CREATE Thunk
export const getCities = createAsyncThunk("markers/getCities", async (endpoint, thunkAPI) => {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
         return thunkAPI.rejectWithValue({ error: error.message });
    }
});

export const getTrees = createAsyncThunk("markers/getTrees", async (endpoint, thunkAPI) => {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
         return thunkAPI.rejectWithValue({ error: error.message });
    }
});

// CREATE SLICE
const markerSlice = createSlice({
  name: "markers",
  initialState: {
    cities: [],
    trees: [],
    markerType: "cities",
    endpoint: "/api/get/cities",
  },
  reducers: {
    setMarkerType: (state, action) => {state.markerType = action.payload},
    setEndpoint: (state, action) => {
        state.markerType = action.payload.type;
        if (action.payload.type === "cities") {
            state.endpoint = "/api/get/cities"
        } else if (action.payload.type === "trees") {
            state.endpoint = "/api/get/trees?lat="+action.payload.lat+"&lng="+action.payload.lng+"&latbnd="+action.payload.latbnd+"&lngbnd="+action.payload.lngbnd+"&limit="+action.payload.limit
        }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCities.pending, (state) => {
        state.cities = [];
    });
    builder.addCase(getCities.fulfilled, (state, { payload }) => {
        state.cities = payload;
    });
    builder.addCase(getCities.rejected,(state, action) => {
        state.loading = "error";
    });
    builder.addCase(getTrees.pending, (state) => {
        state.trees = [];
    });
    builder.addCase(getTrees.fulfilled, (state, { payload }) => {
        state.trees = payload;
    });
    builder.addCase(getTrees.rejected,(state, action) => {
        state.loading = "error";
    });
  }
});

export const { setMarkerType, setEndpoint } = markerSlice.actions;

export const selectMarkers = createSelector(
  (state) => ({
     stateCity: state.cities,
     stateTrees: state.trees,
     markerType: state.markerType,
     endpoint: state.endpoint
  }), (state) =>  state
);

export default markerSlice