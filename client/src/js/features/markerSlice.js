import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// CREATE Thunk
export const getGlobal = createAsyncThunk("markers/getGlobal", async (endpoint, thunkAPI) => {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
         return thunkAPI.rejectWithValue({ error: error.message });
    }
});

export const getCity = createAsyncThunk("markers/getCity", async (endpoint, thunkAPI) => {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
         return thunkAPI.rejectWithValue({ error: error.message });
    }
});

export const getFreeDraw = createAsyncThunk("markers/getFreeDraw", async (endpoint, thunkAPI) => {
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
    global: [],
    city: [],
    freedraw: [],
    globalfilter: 'Native Trees',
    cityfilter: 'Native Trees',
    endpoint: "/api/get/global",
    scan_status: "waiting",
    scan_radius: 0,
    scan_lat: 37.8,
    scan_lng: -96,
    scan_zoom: 3,
    cityZoom: 10,
    treeZoom: 16,
    view_status: "global",
    previous_view_status: "global",
    loading: false,
  },
  reducers: {
    setEndpoint: (state, action) => {
        if (action.payload.type === "global") {
            state.endpoint = "/api/get/global"
        } else if (action.payload.type === "city") {
            state.endpoint = "/api/get/city?lat="+action.payload.lat+"&lng="+action.payload.lng+"&radius="+action.payload.radius+"&limit="+action.payload.limit
        } else if (action.payload.type === "freedraw") {
            state.endpoint = "/api/get/freedraw?lat="+action.payload.lat+"&lng="+action.payload.lng+"&radius="+action.payload.radius+"&polygons="+action.payload.polygons;
        }
    },
    clearCity: (state) => {state.city = [];},
    setLoading: (state, action) => {state.loading = action.payload;},
    clearFreeDraw: (state) => {state.freedraw = [];},
    setScanStatus: (state, action) => {state.scan_status = action.payload;},
    setViewStatus: (state, action) => {
        state.previous_view_status = state.view_status;
        state.view_status = action.payload;
    },
    setScanRadius: (state, action) => {state.scan_radius = action.payload;},
    setScanZoom: (state, action) => {state.scan_zoom = action.payload;},
    setScanCenter: (state, action) => {
        state.scan_lat = action.payload.lat;
        state.scan_lng = action.payload.lng;
    },
    setScanLng: (state, action) => {state.scan_lng = action.payload;},
    setGlobalFilter: (state, action) => {state.globalfilter = action.payload;},
    setCityFilter: (state, action) => {state.cityfilter = action.payload;},
  },
  extraReducers: (builder) => {
    // global
    builder.addCase(getGlobal.pending, (state) => {
        state.global = [];
    });
    builder.addCase(getGlobal.fulfilled, (state, { payload }) => {
        state.global = payload;
    });
    builder.addCase(getGlobal.rejected,(state, action) => {
        state.loading = false;
    });
    // city
    builder.addCase(getCity.pending, (state) => {
        state.loading = true;
        state.city = [];
    });
    builder.addCase(getCity.fulfilled, (state, { payload }) => {
        payload = payload.map(function(o) {
          o.position = [o.latitude, o.longitude];
          o.markerSpriteAnchor = [0.5,0.5];
          if (state.cityfilter == "Native Trees") {
              if (o.native === "TRUE") {
                o.iconId = "icon_green";
                o.customIcon = '<svg xmlns="http://www.w3.org/2000/svg" overflow="visible" fill="#d95f0e" preserveAspectRatio="xMinYMin meet" width="10" height="10" viewBox="0 0 10 10"><circle r="50%" cx="50%" cy="50%" /></svg>'
              } else {
                o.iconId = "icon_gray";
                o.customIcon = '<svg xmlns="http://www.w3.org/2000/svg" overflow="visible" fill="gray" fill-opacity="50%" width="10" height="10" preserveAspectRatio="xMinYMin meet" viewBox="0 0 10 10"><circle r="50%" cx="50%" cy="50%" /></svg>'
              }

          }
          return o;
        });
        state.city = payload;
        state.loading = false;
    });
    builder.addCase(getCity.rejected,(state, action) => {
        state.loading = false;
    });
    // free draw
    builder.addCase(getFreeDraw.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(getFreeDraw.fulfilled, (state, { payload }) => {
        state.freedraw = payload;
        state.loading = false;
    });
    builder.addCase(getFreeDraw.rejected,(state, action) => {
        state.loading = false;
    });
  }
});

export const {
        setEndpoint,
        setViewStatus,
        clearCity,
        clearFreeDraw,
        setScanStatus,
        setScanRadius,
        setScanCenter,
        setScanZoom,
        setLoading,
        setGlobalFilter,
        setCityFilter,
    } = markerSlice.actions;

export default markerSlice