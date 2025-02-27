import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/get-current-user");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to Fetch User"
      );
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/signUp", userData);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      console.log(error.response?.data?.message || "Unable to register User");
      return rejectWithValue(
        error.response?.data?.message || "Unable to register User"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", userData);
      toast.success(response.data.message);
      return response.data.data.user;
    } catch (error) {
      console.log(error.response?.data?.message || "Unable to login User");
      return rejectWithValue(
        error.response?.data?.message || "Unable to login User"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/logout");

      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      console.log(error.response?.data?.message || "Unable to logout User");
      return rejectWithValue(
        error.response?.data?.message || "Unable to logout User"
      );
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isAuthenticated: false,
    isSigningUp: false,
    isLoggingIn: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.payload;
        state.authUser = null;
        state.isAuthenticated = false;
      })
      .addCase(signUp.pending, (state) => {
        state.error = null;
        state.isSigningUp = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isAuthenticated = true;
        state.isSigningUp = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload;
        state.isSigningUp = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isAuthenticated = true;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.authUser = null;
        state.isAuthenticated = false;
        state.isSigningUp = false;
        state.isLoggingIn = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
