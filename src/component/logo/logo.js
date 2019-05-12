import React from 'react'
import './logo.css'
import pic from './job.png'

class Logo extends React.Component{
  render(){
    return (
      <div className="logo-container">
        <img src={pic} alt=""/>
      </div>
    )
  }
}
export default Logo