import React from 'react'
import './header.css'
import people from '../../assets/people.png'
import AI from '../../assets/Online_world-amico.png'

const Header = () => {
  return (
    <div className='AUREO__header section__padding'>
      <div className='AUREO__header-content'>
        <h1 className='gradient__text-yellow'> Elevating Your <spam class='AUREO__header-white_color_text'>Online Presence and Sales</spam></h1>
        <p>
        Take your business to the next level with our professional web development services. Our team of experts will work closely with you to create a custom website that not only represents your brand, but also provides a seamless user experience. 
        </p>
        
        <div className='AUREO__header-content__input'>
          <input type="email" placeholder='Your Email Address' />
          <button type='button'>Get Started</button>
        </div>

        <div className='AUREO__header-content__people'>
          <img src={people} alt="people" />
          <p>1.600 people requested access a visit in the las 24 hours</p>
        </div>
      </div>
      <div className='AUREO__header-image'>
          <img src={AI} alt="AI" />
          <a href="https://storyset.com/online">Online illustrations by Storyset</a>
      </div>
    </div>
  )
}

export default Header
