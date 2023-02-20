import React from 'react'
import './features.css'
import { Feature } from '../../components'
import {icon04, icon05,icon06,icon07} from '../../containers/whatAUREO/icons'

const featuresData = [
  {
    title: 'Maintenance and Support',
    text: 'Providing ongoing website maintenance and technical support services to help businesses keep their websites up-to-date and running smoothly.',
    imgUrl: icon04,
  },
  {
    title: 'Migration',
    text: 'Helping businesses migrate their websites to new platforms or hosting providers.',
    imgUrl: icon05,
  },
  {
    title: 'Optimization',
    text: 'Improving website performance through search engine optimization (SEO) and speed optimization services.',
    imgUrl: icon06,
  },
  {
    title: 'Analytics and Tracking',
    text: 'Setting up website analytics and tracking to help businesses understand their websites performance and make data-driven decisions.',
    imgUrl: icon07,
  },
];

const Features = () => {
  return (
    <div className='AUREO__features section__padding' id="services">
      <div className='AUREO__features-heading'>
        <h1 className='gradient__text-yellow'> maximize your online reach with our services </h1>
        <p ><a href="/contact-us">Request Early Access to Get Started</a></p>
      </div>
      <div className='AUREO__features-container'>
        {featuresData.map((item,index) => (
          <Feature imgUrl={item.imgUrl} title={item.title} text={item.text} key={item.title + index} />
        ))}
      </div>
    </div>
  )
}

export default Features
