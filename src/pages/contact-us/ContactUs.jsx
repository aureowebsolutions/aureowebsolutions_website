import React from 'react'
import './ContactUs.css'
import { Navbar } from '../../components'
import { Footer } from '../../containers'
import ContactForm from '../../containers/forms/ContactForm'

const ContactUs = () => {
  return (
    <div className='gradient__bg'>
      <Navbar />
      <ContactForm />
      <Footer />
    </div> 
  )
}

export default ContactUs