import {configureStore} from "@reduxjs/toolkit"
import  authReducer  from "../features/authSlice"
import storyReducer from "../features/travelStorySlice"

export default configureStore({
    reducer:{
        auth:authReducer,
        story:storyReducer
    }
})