import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const tokenFromStorage = localStorage.getItem('token') || null;

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Login failed' });
  }
});

export const register = createAsyncThunk('auth/register', async ({ username, email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Register failed' });
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Fetch user failed' });
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.put('/users/profile', payload);
    return response.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Update profile failed' });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: tokenFromStorage,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const token = action.payload.access_token || action.payload.token;
        state.token = token;
        if (token) localStorage.setItem('token', token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Register failed';
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'User not authenticated';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
