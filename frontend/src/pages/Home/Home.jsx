import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStories } from '../../features/travelStorySlice'

function Home() {
  const {stories}=useSelector((state)=>state.story)

  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(fetchStories())
  },[dispatch])
  return (
    <div>
      <Navbar/>
    </div>
  )
}

export default Home
