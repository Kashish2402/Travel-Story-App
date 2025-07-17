import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const fetchStories = createAsyncThunk(
  "story/fetchStories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance("/travelStory/fetch-all-stories");
      return response.data.data;
    } catch (error) {
      // console.log(error.response.data.message);
      return rejectWithValue(
        error.response.data.message || "Unable to fetch Stories"
      );
    }
  }
);

export const getUserStories = createAsyncThunk(
  "story/getUserStories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/travelStory/fetch-user-stories`
      );
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      // console.log(error.response.data.message);
      return rejectWithValue(
        error.response.data.message || "Unable to fetch Stories"
      );
    }
  }
);

export const searchStories = createAsyncThunk(
  "story/searchStories",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/travelStory/search`, {
        params: { query },
      });

      // console.log(response.data.data);

      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Unable to Search Stories"
      );
    }
  }
);

export const addStory = createAsyncThunk(
  "story/addStory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/travelStory/create-travel-story",
        formData
      );
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      // console.log(error.response.data.message);
      return rejectWithValue(
        error.response.data.message || "Unable to add Story"
      );
    }
  }
);

export const updateStory = createAsyncThunk(
  "story/updateStory",
  async ({ formData, storyId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/travelStory/update-story/${storyId}`,
        formData
      );

      toast.success(response.data.message);

      return response.data.data;
    } catch (error) {
      // console.log(error.response.data.message);
      return rejectWithValue(
        error.response.data.message || "Unable to edit Story"
      );
    }
  }
);

export const deleteStory = createAsyncThunk(
  "story/deleteStory",
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/travelStory/delete/${storyId}`
      );
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      // console.log(error.response.data.message);
      return rejectWithValue(
        error.response.data.message || "Unable to delete Story"
      );
    }
  }
);

export const StorySlice = createSlice({
  name: "story",
  initialState: {
    stories: [],
    yourStories: [],
    searchResults: [],
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
      })
      .addCase(addStory.pending, (state) => {
        state.isPostingStory = true;
        state.error = null;
      })
      .addCase(addStory.fulfilled, (state, action) => {
        state.stories.push(action.payload);
        state.isPostingStory = false;
      })
      .addCase(addStory.rejected, (state, action) => {
        state.isPostingStory = false;
        state.error = action.payload;
      })
      .addCase(getUserStories.pending, (state) => {
        (state.error = null), (state.isStoriesFetching = true);
      })
      .addCase(getUserStories.fulfilled, (state, action) => {
        state.yourStories = action.payload;
        state.isStoriesFetching = false;
      })
      .addCase(getUserStories.rejected, (state, action) => {
        state.error = action.payload;
        state.isStoriesFetching = false;
      })
      .addCase(updateStory.pending, (state) => {
        state.error = null;
      })
      .addCase(updateStory.fulfilled, (state, action) => {
        const updatedStoryIndex = state.stories.findIndex(
          (story) => story._id === action.payload._id
        );

        if (updatedStoryIndex !== -1) {
          state.stories[updatedStoryIndex] = action.payload;
        }
      })
      .addCase(updateStory.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteStory.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.stories = state.stories.filter(
          (story) => story._id !== action.meta.arg
        );
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(searchStories.pending, (state) => {
        state.error = null;
      })
      .addCase(searchStories.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(searchStories.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default StorySlice.reducer;
