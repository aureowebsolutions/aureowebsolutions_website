import React from 'react'
import './cta.css'
const Cta = () => {
  return (
    <div className='AUREO__cta'>
      <div className='AUREO__cta-content'>
      <p>Request Early Access to Get Started</p>
      <h3>Register Today & start exploring the endless possibilities.</h3>
      </div>
      <div className='AUREO__cta-btn'>
        <button type='button'><a href="/contact-us">Get Started</a></button>
      </div>
    </div>
  )
}

export default Cta