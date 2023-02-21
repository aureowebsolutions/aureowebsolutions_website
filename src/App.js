import React from 'react'
//import {Brand, Cta, Navbar } from './components'
//import { Footer, Blog, Features, WhatAUREO, Header, Posibiity} from './containers'
import './App.css'
import Home from './pages/home/Home'
import ContactUs from './pages/contact-us/ContactUs'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const App = () => {
     return (
       <div className="App">
         
         <BrowserRouter>
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="contact-us/*" element={<ContactUs />} />
           </Routes>
         </BrowserRouter>
         {/* <div className='gradient__bg'>
               <Navbar />
               <Header />
          </div> 
          <Brand />
          <WhatAUREO />
          <Features />
          <Posibiity />
          <Cta />
          <Blog />
          <Footer /> */}
       </div>
     );
}

export default App