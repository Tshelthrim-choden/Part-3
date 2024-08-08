import React from "react"
import './Error.css'

const Notification = ({ message }) =>{
    if (message === null) {
      return null
    }
  
    return (
      <div className='notification'>
        {message}
      </div>
    )
  }
  export default Notification