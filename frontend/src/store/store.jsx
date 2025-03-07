import {configureStore} from "@reduxjs/toolkit"
import  authReducer  from "../features/authSlice"
import storyReducer from "../features/travelStorySlice"
import likeReducer from "../features/likeSlice"

export default configureStore({
    reducer:{
        auth:authReducer,
        story:storyReducer,
        like:likeReducer
    }
})