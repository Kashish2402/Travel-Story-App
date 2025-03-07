import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";

export const getLikedStories = createAsyncThunk(
  "like/getLikedStories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/likes/get-liked-stories");
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      console.log(response.data.message);
      return rejectWithValue(
        response.data.message || "Unable to fetch liked Stories"
      );
    }
  }
);

export const likeSlice = createSlice({
  name: "like",
  initialState: {
    likedStories: [],
    errors: null,
    isFetchingLikedStories: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getLikedStories.pending, (state) => {
        state.error = null;
        state.isFetchingLikedStories = true;
      })
      .addCase(getLikedStories.fulfilled, (state, action) => {
        state.likedStories = action.payload;
        state.isFetchingLikedStories = false;
      })
      .addCase(getLikedStories.rejected, (state, action) => {
        state.error = action.payload;
        state.isFetchingLikedStories = false;
      });
  },
});

export default likeSlice.reducer;
