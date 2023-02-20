import React from 'react'
import possibilityImage from '../../assets/Ecommerce_campaign-cuate.png'
import './posibility.css'

const Posibility = () => {
  return (
    <div className='AUREO__possibility section__padding' id='possibility'>
      <div className='AUREO__possibility-image'>
        <img src={possibilityImage} alt="possibility" />
      </div>
     <div className='AUREO__possibility-content'>
      
      <h1 className='gradient__text-yellow'>Transform Your Online Business: <span className='gradient__text-none'> Custom Shopify Development & Support</span></h1>
      <p>Take your online business to the next level with our custom Shopify development and support services. Our team will design and develop a professional, optimized store tailored to your needs and provide ongoing technical support to ensure success.</p>
      <h4><a href="/contact-us">Request Early access to Get Started</a></h4>
     </div>
    </div>
  )
}

export default Posibility
