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
    similarityData: {'ds_similarity': '', 'greater_metro1':'','greater_metro2':''},
    similarityGreaterMetro1: "",
    similarityGreaterMetro2: "",
  },
  reducers: {
    setSimilarityGreaterMetro1: (state, action) => {state.similarityGreaterMetro1 = action.payload;},
    setSimilarityGreaterMetro2: (state, action) => {state.similarityGreaterMetro2 = action.payload;},
  },
  extraReducers: (builder) => {
    // global
    builder.addCase(getSimilarity.pending, (state) => {
        state.similarityData = {'ds_similarity': '', 'greater_metro1':'','greater_metro2':''};
    });
    builder.addCase(getSimilarity.fulfilled, (state, { payload }) => {
        state.similarityData['ds_similarity'] = payload[0]['ds_similarity'];
        state.similarityData['greater_metro1'] = payload[0]['greater_metro1'];
        state.similarityData['greater_metro2'] = payload[0]['greater_metro2'];
    });
    builder.addCase(getSimilarityHistogram.pending, (state) => {
        state.similarityHistogramData = [];
    });
    builder.addCase(getSimilarityHistogram.fulfilled, (state, { payload }) => {
        state.similarityHistogramData = payload;
    });
  }
});

export const { setSimilarityGreaterMetro1, setSimilarityGreaterMetro2 } = analysisSlice.actions;

export default analysisSlice