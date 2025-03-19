import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const getLikedStories=createAsyncThunk("like/getLikedStories",async(_,{rejectWithValue})=>{
  try {
    const response=await axiosInstance.get("/likes/get-liked-stories")
    return response.data.data
  } catch (error) {
    // console.log(response.data.message);
      return rejectWithValue(
        response.data.message || "Error getting liked videos.."
      );
  }
})

export const toggleLike = createAsyncThunk(
  "like/toggleLike",
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/likes/like/${storyId}`);
      return response.data.data;
    } catch (error) {
      // console.log(response.data.message);
      return rejectWithValue(
        response.data.message || "Error toggling like"
      );
    }
  }
);

export const likeSlice = createSlice({
  name: "like",
  initialState: {
    likedStories: [],
    error: null,
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
      })
      .addCase(toggleLike.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const {isLiked,totalLikes} = action.payload;
        const index = state.likedStories.findIndex(
          (story) => story._id === action.meta.arg
        );

        if (isLiked) {
          if (index === -1) state.likedStories.push({ _id: action.meta.arg });
        } else {
          if (index !== -1) state.likedStories.splice(index, 1);
        }
      }).addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
      });;
  },
});

export default likeSlice.reducer;
