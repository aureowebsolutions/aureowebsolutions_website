import React, { useState, useRef, useEffect } from 'react'
import './ContactForm.css'
import ReCAPTCHA from 'react-google-recaptcha'

const ContactForm = () => {
  const form = useRef()
  const captchaToken = useRef(null)
  const recaptchaRef = useRef(null)
  const [result, showResult] = useState(false)
  const [sendError, setSendError] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!result) return
    const timer = setTimeout(() => showResult(false), 5000)
    return () => clearTimeout(timer)
  }, [result])

  function onChange(value) {
    captchaToken.current = value
    setVerified(!!value)
  }

  const sendEmail = async (e) => {
    e.preventDefault()
    setSendError(false)
    const data = new FormData(form.current)
    try {
      const res = await fetch('/.netlify/functions/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: data.get('from_name'),
          email: data.get('email'),
          phone: data.get('phone'),
          message: data.get('message'),
          captchaToken: captchaToken.current,
        }),
      })
      if (res.ok) {
        form.current.reset()
        captchaToken.current = null
        recaptchaRef.current?.reset()
        setVerified(false)
        showResult(true)
      } else {
        setSendError(true)
      }
    } catch {
      setSendError(true)
    }
  }

  return (
    <section className="aureo-contact" id="contact">
      <div className="aureo-contact__card">
        {result ? (
          <div className="aureo-contact__success">
            <div className="aureo-contact__success-icon">✓</div>
            <p className="aureo-contact__success-title">Message sent!</p>
            <p className="aureo-contact__success-sub">We'll be in touch within 24 hours.</p>
          </div>
        ) : (
          <>
            <h2 className="aureo-contact__heading">Ready to Grow Your Store?</h2>
            <p className="aureo-contact__sub">
              Tell us about your project. We'll respond within 24 hours with a clear plan.
            </p>
            <form
              ref={form}
              onSubmit={sendEmail}
              name="contact"
              method="POST"
              data-netlify-recaptcha="true"
              data-netlify="true"
              className="aureo-contact__form"
            >
              <input
                type="text"
                name="from_name"
                placeholder="Your name"
                required
                className="aureo-contact__input"
              />
              <input
                type="email"
                name="email"
                placeholder="Work email"
                required
                className="aureo-contact__input"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone (optional)"
                className="aureo-contact__input"
              />
              <textarea
                rows="4"
                name="message"
                placeholder="Tell us about your project"
                required
                className="aureo-contact__textarea"
              />
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LceXqckAAAAAORLyh4jaKaTYzMIbv9_sopmk4Gt"
                onChange={onChange}
                theme="dark"
              />
              <button
                type="submit"
                disabled={!verified}
                className="aureo-contact__submit"
              >
                Send Message
              </button>
              {sendError && (
                <p className="aureo-contact__error">
                  Failed to send. Please try again or email us directly.
                </p>
              )}
            </form>
          </>
        )}
        <p className="aureo-contact__direct">
          Or reach us directly:{' '}
          <a href="mailto:aureowebsolutions@gmail.com" className="aureo-contact__email-link">
            aureowebsolutions@gmail.com
          </a>{' '}
          · +1 (786) 378-9067
        </p>
      </div>
    </section>
  )
}

export default ContactForm
