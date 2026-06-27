import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import { Header, WhatAUREO, Features, Posibility, Portfolio, TrustBand, Testimonials, Footer } from '../../containers'
import ContactForm from '../../containers/forms/ContactForm'
import { useFadeUp } from '../../components/useFadeUp'

const Home = () => {
  useFadeUp()
  return (
    <div>
      <Navbar />
      <Header />
      <WhatAUREO />
      <Features />
      <Posibility />
      <Portfolio />
      <TrustBand />
      <Testimonials />
      <ContactForm />
      <Footer />
    </div>
  )
}

export default Home
