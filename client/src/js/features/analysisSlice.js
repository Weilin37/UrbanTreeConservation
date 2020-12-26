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

// CREATE SLICE
const analysisSlice = createSlice({
  name: "analysis",
  initialState: {
    similarityData: [],
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
        state.similarityData = [];
    });
    builder.addCase(getSimilarity.fulfilled, (state, { payload }) => {
        state.similarityData = payload;
    });
  }
});

export const { setSimilarityCity1, setSimilarityCity2, setSimilarityState1, setSimilarityState2  } = analysisSlice.actions;

export default analysisSlice