import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// CREATE Thunk
export const getSimilarity = createAsyncThunk("analysis/getSimilarity", async (endpoint, thunkAPI) => {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
         return thunkAPI.rejectWithValue({ error: error.message });
    }
});

export const getSimilarityHistogram = createAsyncThunk("analysis/getSimilarityHistogram", async (endpoint, thunkAPI) => {
    try {
        const response = await axios.get('/api/get/similarityhistogram');
        return response.data;
    } catch (error) {
         return thunkAPI.rejectWithValue({ error: error.message });
    }
});

// CREATE SLICE
const analysisSlice = createSlice({
  name: "analysis",
  initialState: {
    similarityHistogramData: [],
    similarityData: {'ds_similarity': '', 'city1':'','city2':'','state1':'','state2':''},
    similarityCity1: "",
    similarityCity2: "",
    similarityState1: "",
    similarityState2: "",
  },
  reducers: {
    setSimilarityCity1: (state, action) => {state.similarityCity1 = action.payload;},
    setSimilarityCity2: (state, action) => {state.similarityCity2 = action.payload;},
    setSimilarityState1: (state, action) => {state.similarityState1 = action.payload;},
    setSimilarityState2: (state, action) => {state.similarityState2 = action.payload;},
  },
  extraReducers: (builder) => {
    // global
    builder.addCase(getSimilarity.pending, (state) => {
        state.similarityData = {'ds_similarity': '', 'city1':'','city2':'','state1':'','state2':''};
    });
    builder.addCase(getSimilarity.fulfilled, (state, { payload }) => {
        state.similarityData['ds_similarity'] = payload[0]['ds_similarity'];
        state.similarityData['city1'] = payload[0]['city1'];
        state.similarityData['city2'] = payload[0]['city2'];
        state.similarityData['state1'] = payload[0]['state1'];
        state.similarityData['state2'] = payload[0]['state2'];
    });
    builder.addCase(getSimilarityHistogram.pending, (state) => {
        state.similarityHistogramData = [];
    });
    builder.addCase(getSimilarityHistogram.fulfilled, (state, { payload }) => {
        state.similarityHistogramData = payload;
    });
  }
});

export const { setSimilarityCity1, setSimilarityCity2, setSimilarityState1, setSimilarityState2  } = analysisSlice.actions;

export default analysisSlice