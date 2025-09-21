import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
//Slice - a piece of the redux store that contains 
// Initial State 
// Reducers (functions to update the state)
// Actions (Functions you call to trigger that the state has changes)

// createAsyncThunk - handle asynchrnous operations like API calls 

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials) => {
    const response = await api.post("/token/", credentials);
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData) => {
    const response = await api.post("/users/register/", userData);
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth ",
  initialState: {
    user: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
