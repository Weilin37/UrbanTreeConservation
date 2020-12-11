import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
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
    endpoint: "/api/get/cities",
    scan_status: "waiting",
    scan_radius: 0,
    scan_lat: 37.8,
    scan_lng: -96,
    clusterZoom: 10,
    treeZoom: 16,
    view_status: "cities",
  },
  reducers: {
    setEndpoint: (state, action) => {
        if (action.payload.type === "cities") {
            state.endpoint = "/api/get/cities"
        } else if (action.payload.type === "trees") {
            state.endpoint = "/api/get/trees?lat="+action.payload.lat+"&lng="+action.payload.lng+"&radius="+action.payload.radius+"&limit="+action.payload.limit
        }
    },
    clearTrees: (state) => {state.trees = [];},
    setScan: (state, action) => {state.scan_status = action.payload;},
    setViewStatus: (state, action) => {state.view_status = action.payload;},
    setScanRadius: (state, action) => {state.scan_radius = action.payload;},
    setScanCenter: (state, action) => {
        state.scan_lat = action.payload.lat;
        state.scan_lng = action.payload.lng;
    },
    setScanLng: (state, action) => {state.scan_lng = action.payload;},
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
        state.scan_status = "waiting"
    });
    builder.addCase(getTrees.rejected,(state, action) => {
        state.loading = "error";
        state.scan_status = "waiting"
    });
  }
});

export const { setEndpoint, setViewStatus, clearTrees, setScan, setScanRadius, setScanCenter } = markerSlice.actions;

export default markerSlice