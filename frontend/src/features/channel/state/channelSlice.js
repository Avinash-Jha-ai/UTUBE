import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://utube-b49v.onrender.com/api/channel';
axios.defaults.withCredentials = true;

export const fetchMyChannel = createAsyncThunk('channel/fetchMyChannel', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/get-channel`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const createChannel = createAsyncThunk('channel/createChannel', async (channelData, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('name', channelData.name);
    formData.append('handle', channelData.handle);
    formData.append('description', channelData.description);
    if (channelData.avatar) formData.append('avatar', channelData.avatar);
    if (channelData.banner) formData.append('banner', channelData.banner);

    const response = await axios.post(`${API_URL}/create-channel`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

const channelSlice = createSlice({
  name: 'channel',
  initialState: {
    myChannel: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearChannelError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyChannel.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.myChannel = action.payload.channel;
      })
      .addCase(fetchMyChannel.rejected, (state, action) => {
        state.loading = false;
        state.myChannel = null;
        state.error = action.payload;
      })
      .addCase(createChannel.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.myChannel = action.payload.channel;
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearChannelError } = channelSlice.actions;
export default channelSlice.reducer;
