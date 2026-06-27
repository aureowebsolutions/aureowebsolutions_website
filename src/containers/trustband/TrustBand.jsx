import React from 'react'
import './trustband.css'

const badges = [
  { label: 'Shopify Partner',    sub: 'Official Partner Agency' },
  { label: 'No.1 Focus',        sub: 'Conversion Rate Optimization' },
  { label: '100% Transparent',  sub: 'Weekly Reports, Real Numbers' },
  { label: 'US-Based Team',     sub: 'Based in South Florida' },
]

const TrustBand = () => (
  <section className="aureo-trust">
    <div className="aureo-trust__inner">
      <h2 className="aureo-trust__headline fade-up">YOUR GROWTH IS OUR METRIC.</h2>
      <p className="aureo-trust__sub fade-up delay-1">
        We measure our success by the revenue, rankings, and results we generate for our clients.
      </p>
      <div className="aureo-trust__grid fade-up delay-2">
        {badges.map((b) => (
          <div className="aureo-trust__badge" key={b.label}>
            <div className="aureo-trust__badge-label">{b.label}</div>
            <div className="aureo-trust__badge-sub">{b.sub}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default TrustBand
