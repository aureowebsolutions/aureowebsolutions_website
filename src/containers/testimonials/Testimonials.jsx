import React from 'react'
import './testimonials.css'

const quotes = [
  {
    text: '"Aureo rebuilt our Shopify store from the ground up. We went from 0.8% to 3.4% conversion rate in two months. The ROI paid for the project in week three."',
    name: 'Carlos Mendez',
    title: 'Founder, Luz Candle Co.',
  },
  {
    text: '"Their SEO work is methodical, transparent, and it actually works. We rank #1 for our top 12 keywords now. That traffic is our best acquisition channel."',
    name: 'Sarah Lin',
    title: 'CMO, Forma Athletic',
  },
  {
    text: '"The content they produced — photos, videos, copy — elevated our brand instantly. Our email revenue doubled the quarter we launched with Aureo\'s assets."',
    name: 'Javier Ruiz',
    title: 'CEO, Mesa Verde Foods',
  },
]

const Testimonials = () => (
  <section className="aureo-testimonials">
    <div className="aureo-testimonials__inner">
      <p className="aureo-testimonials__overline fade-up">Client Stories</p>
      <h2 className="aureo-testimonials__heading fade-up delay-1">Don't Take Our Word For It.</h2>
      <div className="aureo-testimonials__grid">
        {quotes.map((q, i) => (
          <div className={`aureo-quote fade-up delay-${i}`} key={q.name}>
            <div className="aureo-quote__mark" aria-hidden="true">&ldquo;</div>
            <p className="aureo-quote__text">{q.text}</p>
            <div>
              <div className="aureo-quote__name">{q.name}</div>
              <div className="aureo-quote__title">{q.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Testimonials
