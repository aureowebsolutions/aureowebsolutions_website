import React from 'react'
import './feature.css'

const Feature = ({title, text, imgUrl}) => {
  return (
    <div className='AUREO__features-container__feature'>
      <div className='AUREO__features-container__feature-title'>
          <img src={imgUrl} width='64px' alt='services-features '/>
          <div></div>
          <h1>{title}</h1>
      </div>
      <div className='AUREO__features-container__feature-text'>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default Feature
