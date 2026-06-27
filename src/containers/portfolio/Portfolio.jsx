import React from 'react'
import './portfolio.css'

const cases = [
  {
    img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    alt: 'Luz Candle Co. — candles lifestyle photography',
    tags: ['Shopify', 'SEO', 'Photography'],
    name: 'Luz Candle Co.',
    desc: 'DTC candles & home fragrance brand. Complete Shopify rebuild paired with a targeted SEO sprint.',
    metric: '+284%',
    metricLabel: 'revenue in 90 days',
  },
  {
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    alt: 'Forma Athletic — fitness lifestyle',
    tags: ['Shopify', 'Content', 'Copywriting'],
    name: 'Forma Athletic',
    desc: 'Fitness & sportswear brand. Full content strategy deployed across launch campaign and product pages.',
    metric: '3.2×',
    metricLabel: 'ROAS on launch month',
  },
  {
    img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
    alt: 'Mesa Verde Foods — gourmet specialty food',
    tags: ['Shopify', 'SEO', 'Video'],
    name: 'Mesa Verde Foods',
    desc: 'Specialty food & D2C grocery brand. Built from zero with Shopify, SEO, and a full-year content roadmap.',
    metric: '$1.2M',
    metricLabel: 'GMV in first year',
  },
]

const Portfolio = () => (
  <section className="aureo-portfolio" id="work">
    <div className="aureo-portfolio__inner">
      <p className="aureo-portfolio__overline fade-up">Our Work</p>
      <h2 className="aureo-portfolio__heading fade-up delay-1">Results You Can Measure.</h2>

      <div className="aureo-portfolio__list">
        {cases.map((c, i) => (
          <div className={`aureo-case fade-up delay-${i}`} key={c.name}>
            <div className="aureo-case__photo">
              <img src={c.img} alt={c.alt} loading="lazy" />
              <div className="aureo-case__photo-fade" aria-hidden="true" />
            </div>
            <div className="aureo-case__body">
              <div className="aureo-case__tags">
                {c.tags.map((t) => (
                  <span className="aureo-case__tag" key={t}>{t}</span>
                ))}
              </div>
              <h3 className="aureo-case__name">{c.name}</h3>
              <p className="aureo-case__desc">{c.desc}</p>
              <div className="aureo-case__metric">
                <span className="aureo-case__metric-num">{c.metric}</span>
                <span className="aureo-case__metric-label">{c.metricLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Portfolio
