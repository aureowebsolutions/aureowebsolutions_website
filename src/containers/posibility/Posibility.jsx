import React from 'react'
import './posibility.css'

const steps = [
  {
    num: '01',
    title: 'Discovery',
    text: 'We start by understanding your business from the inside out — your customers, competitors, margins, and growth targets. No templates, no assumptions. Just careful listening and sharp questions.',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.35 }}>
        <circle cx="32" cy="32" r="28" stroke="#C9A84C" strokeWidth="2" />
        <path d="M20 32h24M32 20v24" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="32" r="8" stroke="#C9A84C" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Strategy',
    text: 'We design a precise execution plan with clear KPIs, realistic timelines, and defined deliverables. You\'ll know exactly what gets built, when, and why — before a single line of code is written.',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.35 }}>
        <path d="M12 44l14-14 8 8 18-22" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8" y="8" width="48" height="48" rx="6" stroke="#C9A84C" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Build',
    text: 'We construct, test, and refine every detail before go-live. Staged reviews, staging environments, and real-device QA ensure your launch day is smooth and your store is bulletproof.',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.35 }}>
        <path d="M16 48l8-8 6 6 16-24 6 8" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 56h48" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Grow',
    text: 'Launch is day one, not the finish line. Ongoing SEO, content publishing, and conversion-rate optimization compound your results month over month — turning your store into a durable revenue engine.',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.35 }}>
        <path d="M32 10v44M10 32h44M18 18l28 28M46 18L18 46" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="32" r="22" stroke="#C9A84C" strokeWidth="2" />
      </svg>
    ),
  },
]

const Posibility = () => (
  <section className="aureo-process" id="process">
    <div className="aureo-process__inner">
      <p className="aureo-process__overline fade-up">How We Work</p>
      <h2 className="aureo-process__heading fade-up delay-1">From First Call to Launch Day.</h2>

      <div className="aureo-process__steps">
        {steps.map((step, i) => {
          const flip = i % 2 === 1
          return (
            <div className="aureo-process__row fade-up" key={step.num}>
              <div className={`aureo-process__text${flip ? ' aureo-process__text--right' : ''}`}>
                <div className="aureo-process__step-num" aria-hidden="true">{step.num}</div>
                <div className="aureo-process__step-content">
                  <h3 className="aureo-process__step-title">{step.title}</h3>
                  <p className="aureo-process__step-body">{step.text}</p>
                </div>
              </div>
              <div className={`aureo-process__visual${flip ? ' aureo-process__visual--left' : ''}`}>
                <div className="aureo-process__visual-inner">
                  <div className="aureo-process__visual-glow" aria-hidden="true" />
                  {step.icon}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </section>
)

export default Posibility
