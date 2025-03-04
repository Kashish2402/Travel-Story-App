import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const fetchStories = createAsyncThunk(
  "story/fetchStories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance("/travelStory/fetch-all-stories");
      //   console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.log(response.data.message);
      return rejectWithValue(
        response.data.message || "Unable to fetch Stories"
      );
    }
  }
);

export const addStory = createAsyncThunk(
  "story/addStory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance(
        "travelStory/create-travel-story",
        formData
      );
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      console.log(response.data.message);
      return rejectWithValue(
        response.data.message || "Unable to add Story"
      );
    }
  }
);

export const StorySlice = createSlice({
  name: "story",
  initialState: {
    stories: [],
    isStoriesFetching: false,
    isPostingStory: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.isStoriesFetching = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.stories = action.payload;
        state.isStoriesFetching = false;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.isStoriesFetching = false;
        state.error = action.payload;
      });
  },
});

export default StorySlice.reducer;
