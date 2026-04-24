import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://utube-b49v.onrender.com/api/content';

export const fetchAllVideos = createAsyncThunk('video/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/video/all`);
    return response.data.videos;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    videos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVideos.pending, (state) => { state.loading = true; })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default videoSlice.reducer;
