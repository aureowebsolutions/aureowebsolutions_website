import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri'
import './navbar.css'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`aureo-nav${scrolled ? ' aureo-nav--scrolled' : ''}`}>
      <div className="aureo-nav__brand">
        <a href="/">
          <span className="aureo-nav__brand-aureo">Aureo</span>
          <span className="aureo-nav__brand-sub"> Web Solutions</span>
        </a>
      </div>

      <div className="aureo-nav__links">
        <a href="/#services">Services</a>
        <a href="/#work">Work</a>
        <a href="/#process">Process</a>
        <a href="/#contact">Contact</a>
      </div>

      <div className="aureo-nav__actions">
        <Link to="/login" className="aureo-nav__login">Log In</Link>
        <a href="/#contact" className="aureo-nav__cta">Get Started</a>
      </div>

      <button
        className="aureo-nav__hamburger"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen
          ? <RiCloseLine color="var(--body)" size={24} />
          : <RiMenu3Line color="var(--body)" size={24} />}
      </button>

      {menuOpen && (
        <div className="aureo-nav__mobile scale-up-center">
          <a href="/#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="/#work"     onClick={() => setMenuOpen(false)}>Work</a>
          <a href="/#process"  onClick={() => setMenuOpen(false)}>Process</a>
          <a href="/#contact"  onClick={() => setMenuOpen(false)}>Contact</a>
          <Link to="/login"    onClick={() => setMenuOpen(false)} className="aureo-nav__login">Log In</Link>
          <a href="/#contact"  onClick={() => setMenuOpen(false)} className="aureo-nav__cta">Get Started</a>
        </div>
      )}
    </nav>
  )
}

export default Navbar
