import React from 'react'
import './footer.css'

const Footer = () => (
  <footer className="aureo-footer">
    <div className="aureo-footer__inner">
      <div className="aureo-footer__grid">
        <div className="aureo-footer__brand">
          <div className="aureo-footer__logo">
            <span className="aureo-footer__logo-gold">Aureo</span>
            <span className="aureo-footer__logo-body"> Web Solutions</span>
          </div>
          <p className="aureo-footer__tagline">
            Shopify stores, SEO strategies, and content that drives measurable revenue growth.
          </p>
          <div className="aureo-footer__socials">
            <a href="https://www.instagram.com/aureowebsolutions/" target="_blank" rel="noopener noreferrer" className="aureo-footer__social-link" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/aureowebsolutions" target="_blank" rel="noopener noreferrer" className="aureo-footer__social-link" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/aureowebsolutions" target="_blank" rel="noopener noreferrer" className="aureo-footer__social-link" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="aureo-footer__col">
          <h4 className="aureo-footer__col-heading">Services</h4>
          <a href="#services" className="aureo-footer__link">Shopify Development</a>
          <a href="#services" className="aureo-footer__link">SEO &amp; Visibility</a>
          <a href="#services" className="aureo-footer__link">Content Creation</a>
          <a href="#work" className="aureo-footer__link">Case Studies</a>
        </div>

        <div className="aureo-footer__col">
          <h4 className="aureo-footer__col-heading">Company</h4>
          <a href="#process" className="aureo-footer__link">Our Process</a>
          <a href="/blog/the-impact-of-gpt3-on-website-development" className="aureo-footer__link">Blog</a>
          <a href="#contact" className="aureo-footer__link">Contact</a>
          <a href="/contact-us/" className="aureo-footer__link">Contact Page</a>
        </div>

        <div className="aureo-footer__col">
          <h4 className="aureo-footer__col-heading">Contact</h4>
          <span className="aureo-footer__contact-item">Homestead, FL 33032</span>
          <a href="tel:+17863789067" className="aureo-footer__link">+1 (786) 378-9067</a>
          <a href="mailto:aureowebsolutions@gmail.com" className="aureo-footer__link">aureowebsolutions@gmail.com</a>
        </div>
      </div>

      <div className="aureo-footer__bottom">
        <span className="aureo-footer__copy">© 2025 Aureo Web Solutions LLC. All rights reserved.</span>
        <span className="aureo-footer__built">Built with purpose in South Florida.</span>
      </div>
    </div>
  </footer>
)

export default Footer
