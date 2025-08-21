import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/apiClient'

// Đọc token từ localStorage khi load lần đầu
const tokenFromStorage = localStorage.getItem('access_token') || null

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(email, password)
      const token = data.token
      if (!token) throw new Error('Token không hợp lệ')

      // Lưu token vào localStorage
      localStorage.setItem('access_token', token)

      // Lấy user info từ API /me
      const meRes = await authService.me()
      return { token, user: meRes.data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const meThunk = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('access_token')
      if (!token) return rejectWithValue('No token')
      const { data } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      return { user: data, token }
    } catch (err) {
      return rejectWithValue('Session expired')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,        // {email, role, ...}
    token: tokenFromStorage,
    status: 'idle',    // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('access_token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('access_token', action.payload.token)
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Login failed'
      })
      .addCase(meThunk.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(meThunk.rejected, (state) => {
        state.user = null
        state.token = null
        localStorage.removeItem('access_token')
      })
  },
})

export const { logout } = authSlice.actions
export const selectAuth = (s) => s.auth
export const selectIsAuthed = (s) => Boolean(s.auth.token && s.auth.user)
export default authSlice.reducer
