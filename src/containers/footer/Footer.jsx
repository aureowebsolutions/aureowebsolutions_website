import React from 'react';
//import AUREOLogo from '../../assets/logo.svg';
import AUREOLogo from '../../assets/Logo-aureowebsolutions-whiteletter.png'
import './footer.css';

const Footer = () => (
  <div className="AUREO__footer section__padding">
    <div className="AUREO__footer-heading">
      <h1 className="gradient__text">Do you want to step in to the future before others</h1>
    </div>

    <div className="AUREO__footer-btn">
      <p><a href="/contact-us"> Request Early Access</a></p>
    </div>

    <div className="AUREO__footer-links">
      <div className="AUREO__footer-links_logo">
        <img src={AUREOLogo} alt="AUREO_logo" />
        <p>Aureo web solutions llc, <br /> All Rights Reserved</p>
      </div>
      <div className="AUREO__footer-links_div">
        <h4>Links</h4>
        <p><a href="/">Home</a></p>
        <p><a href="/#wAUREO">What's AUREO</a></p>
        <p><a href="/#services">Services</a></p>
        <p><a href="/contact-us">Contact Us</a></p>
        <p><a href="/#blog">Blogs</a></p>
      </div>
      <div className="AUREO__footer-links_div">
        <h4>Company</h4>
        <p>Terms & Conditions </p>
        <p>Privacy Policy</p>
      </div>
      <div className="AUREO__footer-links_div">
        <h4>Get in touch</h4>
        <p>Homestead Florida 33032</p>
        <p>(786)-378-9067</p>
        <p>aureowebsolutions@gmail.com</p>
      </div>
    </div>

    <div className="AUREO__footer-copyright">
      <p>@2023 Aureo web solutions. All rights reserved.</p>
    </div>
  </div>
);

export default Footer;