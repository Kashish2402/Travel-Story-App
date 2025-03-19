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
      // console.log(error.response?.data?.message || "Unable to register User");
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
      // console.log(error.response?.data?.message || "Unable to login User");
      return rejectWithValue(
        error.response?.data?.message || "Unable to login User"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        "/users/change-password",
        data
      );

      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      // console.log(error.response?.data?.message || "Unable to change password");
      return rejectWithValue(
        error.response?.data?.message || "Unable to change password"
      );
    }
  }
);

export const editUserDetails = createAsyncThunk(
  "users/editUserDetails",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        "/users/edit-user-details",
        formData
      );

      toast.success(response.data.message);

      return response.data.data;
    } catch (error) {
      // console.log(error.response?.data?.message || "Unable to edit Details");
      return rejectWithValue(
        error.response?.data?.message || "Unable to edit Details"
      );
    }
  }
);

export const updateCoverImage = createAsyncThunk(
  "users/updateCoverImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        "/users/update-coverImage",
        formData
      );

      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      // console.log(
      //   error.response?.data?.message || "Unable to update cover Image"
      // );
      return rejectWithValue(
        error.response?.data?.message || "Unable to update cover Image"
      );
    }
  }
);

export const updateAvatarImage = createAsyncThunk(
  "users/updateAvatarImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        "/users/update-profilePic",
        formData
      );

      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      // console.log(
      //   error.response?.data?.message || "Unable to update avatar Image"
      // );
      return rejectWithValue(
        error.response?.data?.message || "Unable to update avatar Image"
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
      // console.log(error.response?.data?.message || "Unable to logout User");
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
    isUpdatingUserDetails: false,
    isImageUpdating: false,
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
        // console.log(state.authUser)
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
        // console.log(state.authUser.username)
      })
      .addCase(changePassword.pending, (state) => {
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {})
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.error = action.payload;
      })
      .addCase(editUserDetails.pending, (state) => {
        (state.error = null), (state.isUpdatingUserDetails = true);
      })
      .addCase(editUserDetails.fulfilled, (state, action) => {
        state.isUpdatingUserDetails = false;
      })
      .addCase(editUserDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.isUpdatingUserDetails = false;
      })
      .addCase(updateCoverImage.pending, (state) => {
        state.isImageUpdating = true;
        state.error = null;
      })
      .addCase(updateCoverImage.fulfilled, (state) => {
        state.isImageUpdating = false;
      })
      .addCase(updateCoverImage.rejected, (state, action) => {
        state.error = action.payload;
        state.isImageUpdating = false;
      }).addCase(updateAvatarImage.pending,(state)=>{
        state.error=null
        state.isImageUpdating=true
      }).addCase(updateAvatarImage.fulfilled,(state)=>{
        state.isImageUpdating=true
      }).addCase(updateAvatarImage.rejected,(state,action)=>{
        state.error=action.payload
        state.isImageUpdating=false
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
