import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:3000/api/auth';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('fullname', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }

    const response = await axios.post(`${API_URL}/register`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/get-me`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload?.user || null;
      });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
