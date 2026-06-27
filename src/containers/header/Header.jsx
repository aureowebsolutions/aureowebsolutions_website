import React from 'react'
import './header.css'

const Header = () => (
  <section className="aureo-hero">
    <div className="aureo-hero__bg-img" aria-hidden="true" />

    <div className="aureo-hero__content">
      <p className="aureo-hero__overline fade-up">Shopify · SEO · Content Creation</p>
      <h1 className="aureo-hero__headline fade-up delay-1">
        We Build Online Stores<br />
        <span className="aureo-hero__headline-gold">That Actually Sell.</span>
      </h1>
      <p className="aureo-hero__sub fade-up delay-2">
        Custom Shopify development, search-first SEO, and content that converts — all under one roof.
      </p>
      <div className="aureo-hero__ctas fade-up delay-3">
        <a href="#contact" className="aureo-btn-primary">Start a Project</a>
        <a href="#work"    className="aureo-btn-secondary">See Our Work</a>
      </div>
    </div>

    <div className="aureo-hero__stats fade-up">
      <div className="aureo-stat">
        <div className="aureo-stat__number">120+</div>
        <div className="aureo-stat__label">Stores Launched</div>
      </div>
      <div className="aureo-stat__divider" aria-hidden="true" />
      <div className="aureo-stat">
        <div className="aureo-stat__number">$18M+</div>
        <div className="aureo-stat__label">Client Revenue Generated</div>
      </div>
      <div className="aureo-stat__divider" aria-hidden="true" />
      <div className="aureo-stat">
        <div className="aureo-stat__number">97%</div>
        <div className="aureo-stat__label">Client Retention Rate</div>
      </div>
    </div>

    <div className="aureo-hero__scroll-indicator" aria-hidden="true">
      <div style={{ position: 'relative', width: 52, height: 52 }}>
        <svg viewBox="0 0 52 52" width="52" height="52" className="aureo-hero__scroll-ring">
          <defs>
            <path id="scroll-circle" d="M 26,26 m -18,0 a 18,18 0 1,1 36,0 a 18,18 0 1,1 -36,0" />
          </defs>
          <text fontSize="7.2" fontFamily="Inter,sans-serif" fontWeight="500" fill="#C9A84C" letterSpacing="2.6">
            <textPath href="#scroll-circle">scroll · scroll · scroll ·</textPath>
          </text>
        </svg>
        <svg width="14" height="14" viewBox="0 0 14 14" className="aureo-hero__scroll-arrow">
          <path d="M7 2v10M3 8l4 4 4-4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </div>
  </section>
)

export default Header
