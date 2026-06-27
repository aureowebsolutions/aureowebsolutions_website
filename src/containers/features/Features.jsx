import React from 'react'
import './features.css'

const services = [
  {
    title: 'Shopify Stores Built to Convert',
    text: 'Custom theme development, seamless app integrations, and checkout optimization engineered to maximize revenue per visitor from day one.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 5h16M3 5v12a2 2 0 002 2h12a2 2 0 002-2V5M3 5l2-3h12l2 3M9 10h4M11 10v5"
          stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Visibility That Drives Revenue',
    text: 'Technical SEO audits, content strategy, keyword research, and rank tracking — built to compound over time and reduce dependence on paid acquisition.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="9" cy="9" r="6" stroke="#C9A84C" strokeWidth="1.6" />
        <path d="M13.5 13.5L19 19M6 6l2 3 3-5" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Content That Sells Your Brand',
    text: 'Product photography, brand videos, conversion copywriting, and social content — assets that earn trust and drive customers from first impression to checkout.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="5" width="16" height="12" rx="1.5" stroke="#C9A84C" strokeWidth="1.6" />
        <circle cx="8" cy="9" r="1.5" stroke="#C9A84C" strokeWidth="1.4" />
        <path d="M3 15l4-4 3 3 3-4 4 5" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const Features = () => (
  <section className="aureo-services" id="services">
    <div className="aureo-services__inner">
      <p className="aureo-services__overline fade-up">Our Services</p>
      <h2 className="aureo-services__heading fade-up delay-1">
        Everything Your Store Needs.<br />Nothing It Doesn't.
      </h2>
      <div className="aureo-services__grid">
        {services.map((s, i) => (
          <div className={`aureo-service-card fade-up delay-${i}`} key={s.title}>
            <div className="aureo-service-card__icon">{s.icon}</div>
            <div>
              <h3 className="aureo-service-card__title">{s.title}</h3>
              <p className="aureo-service-card__text">{s.text}</p>
            </div>
            <a href="#contact" className="aureo-service-card__link">Explore the service →</a>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Features
