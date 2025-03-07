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

export const getUserStories=createAsyncThunk("story/getUserStories",async(_,{rejectWithValue})=>{
  try {
    const response=await axiosInstance.get(`/travelStory/fetch-user-stories`)
    toast.success(response.data.message)
    return response.data.data
  } catch (error) {
    console.log(response.data.message);
      return rejectWithValue(
        response.data.message || "Unable to fetch Stories"
      );
  }
})

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
      console.log(response.data.message);
      return rejectWithValue(response.data.message || "Unable to add Story");
    }
  }
);

export const StorySlice = createSlice({
  name: "story",
  initialState: {
    stories: [],
    yourStories:[],
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
      }).addCase(getUserStories.pending,(state)=>{
        state.error=null,
        state.isStoriesFetching=true
      }).addCase(getUserStories.fulfilled,(state,action)=>{
        state.yourStories=action.payload
        state.isStoriesFetching=false
      }).addCase(getUserStories.rejected,(state,action)=>{
        state.error=action.payload
        state.isStoriesFetching=false
      });
  },
});

export default StorySlice.reducer;
