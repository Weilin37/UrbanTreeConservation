import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { NONE } from 'react-leaflet-freedraw';

// CREATE Thunk
export const uploadData = createAsyncThunk("upload/uploadData", async (data, thunkAPI) => {
    try {
        const response = await axios.post('/api/post/data', data);
        return response.data;
    } catch (error) {
         return thunkAPI.rejectWithValue({ error: error.message });
    }
});


// CREATE SLICE
const uploadSlice = createSlice({
  name: "upload",
  initialState: {

  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(uploadData.pending, (state) => {
        console.log("test3")
    });
    builder.addCase(uploadData.fulfilled, (state, { payload }) => {
        console.log("test")
        console.log(payload);
    });
    builder.addCase(uploadData.rejected,(state, action) => {
        console.log("test2")
    });
  }
});

export const {

} = uploadSlice.actions;

export default uploadSlice