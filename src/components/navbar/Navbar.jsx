import React, {useState} from 'react'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri'
import logo from '../../assets/Logo-aureowebsolutions-whiteletter.png'
import './navbar.css'


//BEN -> Block Element Modifier

const Navbar = () => { 
  const [toggleMenu, setToggleMenu] = useState(false)
  return (
    <div className='AUREO__navbar'>
      <div className='AUREO__navbar-links'>
        <div className='AUREO__navbar-links_logo'>
          <img src={logo} alt="logo" />
        </div>
        <div className='AUREO__navbar-links_container'>
          <p><a href="/">Home</a></p>
          <p><a href="/#wAUREO">What's AUREO</a></p>
          <p><a href="/#services">Services</a></p>
          <p><a href="/contact-us">Contact Us</a></p>
          <p><a href="/#blog">Blogs</a></p>
        </div>
      </div>
      <div className='AUREO__navbar-sign'>
        <p>Sign in</p>
        <button type='button'>Sign up</button>
      </div>
      <div className='AUREO__navbar-menu'>
        {
          toggleMenu
            ? <RiCloseLine color="#fff" size={27} onClick={()=> setToggleMenu(false)} />
            : <RiMenu3Line color="#fff" size={27} onClick={()=> setToggleMenu(true)} />
        }
        { toggleMenu && (
          <div className='AUREO__navbar-menu_container scale-up-center'>
            <div className='AUREO__navbar-menu_container-links'>
            <p><a href="/">Home</a></p>
          <p><a href="/#wAUREO">What's AUREO</a></p>
          <p><a href="/#services">Services</a></p>
          <p><a href="/contact-us">Contact Us</a></p>
          <p><a href="/#blog">Blogs</a></p>
              </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
