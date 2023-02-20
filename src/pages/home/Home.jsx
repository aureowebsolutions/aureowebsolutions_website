import React from 'react'
import './Home.css'
import {Brand, Cta, Navbar } from '../../components'
import { Footer, Blog, Features, WhatAUREO, Header, Posibiity} from '../../containers'
import ContactUs from '../contact-us/ContactUs'
import ContactForm from '../../containers/forms/ContactForm'

const Home = () => {
  return (
    <div className='App'>
          <div className='gradient__bg'>
               <Navbar />
               <Header />
          </div> 
          <Brand />
          <WhatAUREO />
          <Features />
          <Posibiity />
          <Cta />
          <Blog />
          <Footer />
          
     </div>
  )
}

export default Home