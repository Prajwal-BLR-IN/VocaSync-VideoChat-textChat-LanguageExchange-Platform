import React from 'react'
import { assets } from '../assets/assets'

const CallButton = ({handleVideoCall}) => {
  return (
    <button onClick={handleVideoCall}  ><img src={assets.videoIcon} alt="" /></button>
  )
}

export default CallButton