import React, { useState, useRef } from 'react'
import './ContactForm.css'
import emailjs from '@emailjs/browser';
import ReCAPTCHA from "react-google-recaptcha";

const ContactForm = () => {
   const form = useRef();
   
   const Result = () => {
      return(
         <p> Your message has been successfully sent. I will contact you soon.</p>
      )
   }
   
   const[result,showResult] = useState(false)
   const[verified, setVerified] = useState(false)

   function onChange(value) {
      console.log("Captcha value:", value);
      setVerified(true);
    }
   const sendEmail = (e) => {
      e.preventDefault();
  
      emailjs.sendForm('service_t9x28ev', 'template_do871yd', form.current, '3LADHJ1x98S3Kwx9Y')
        .then((result) => {
            console.log('SUCCESS!', result.status, result.text);
        }, (error) => {
            console.log('FAILED...', error);
        });
        e.target.reset();
        showResult(true);
    };

    //hide result
    setTimeout(() => {
      showResult(false)
    }, 5000);

  return (
    <div>
<section class="bg-white py-20 lg:py-[120px] overflow-hidden relative z-10">
   <div class="flex lg:justify-center">
      <div class="flex flex-wrap lg:justify-between -mx-4">
         <div class="w-full lg:w-1/2 xl:w-6/12 px-4">
            <div class="max-w-[570px] mb-12 px-10 lg:mb-0">
               <span className='AUREO_contact-us' class="block mb-4 text-base text-primary font-semibold">
               Contact Us
               </span>
               <h2 className='AUREO_contact-us-text '
                  class="
                  text-transparent
                  gradient__text
                  mb-6
                  uppercase
                  font-bold
                  bg-clip-text
                  text-[32px]
                  sm:text-[40px]
                  lg:text-[36px]
                  xl:text-[40px]
                  "
                  >
                  GET IN TOUCH WITH US
               </h2>
               <p class="text-base text-body-color leading-relaxed mb-9">
                We'll get back to you as soon as possible and work with you to create a plan that suits your needs and budget. We look forward to hearing from you and helping you take your business to the next level!
               </p>

            </div>
         </div>
         <div class="w-full lg:w-1/2 xl:w-5/12 px-4">
            <div class="bg-white relative rounded-lg p-8 sm:p-12 shadow-lg">
               <form ref={form} onSubmit={sendEmail}
               name="contact" 
               method="POST" 
               data-netlify-recaptcha="true" 
               data-netlify="true">
                  <div class="mb-6">
                     <input
                        type="text"
                        name="from_name"
                        placeholder="Your Name"
                        class="
                        w-full
                        rounded
                        py-3
                        px-[14px]
                        text-body-color text-base
                        border border-[f0f0f0]
                        outline-none
                        focus-visible:shadow-none
                        focus:border-primary
                        "
                        required
                        />
                  </div>
                  <div class="mb-6">
                     <input
                        type="email"
                        name='email'
                        placeholder="Your Email"
                        class="
                        w-full
                        rounded
                        py-3
                        px-[14px]
                        text-body-color text-base
                        border border-[f0f0f0]
                        outline-none
                        focus-visible:shadow-none
                        focus:border-primary
                        "
                        required
                        />
                  </div>
                  <div class="mb-6">
                     <input
                        type="text"
                        name='phone'
                        placeholder="Your Phone"
                        class="
                        w-full
                        rounded
                        py-3
                        px-[14px]
                        text-body-color text-base
                        border border-[f0f0f0]
                        outline-none
                        focus-visible:shadow-none
                        focus:border-primary
                        "
                        required
                        />
                  </div>
                  <div class="mb-6">
                     <textarea
                        rows="6"
                        name='message'
                        placeholder="Your Message"
                        class="
                        w-full
                        rounded
                        py-3
                        px-[14px]
                        text-body-color text-base
                        border border-[f0f0f0]
                        resize-none
                        outline-none
                        focus-visible:shadow-none
                        focus:border-primary
                        "
                        required
                        ></textarea>
                  </div>
                  <ReCAPTCHA
                     sitekey="6LceXqckAAAAAORLyh4jaKaTYzMIbv9_sopmk4Gt"
                     onChange={onChange}
                  />
                  <div>
                     <button
                        type="submit"
                        class="
                        w-full
                        text-white
                        bg-yellow-400
                        rounded
                        border border-primary
                        p-3
                        transition
                        hover:bg-opacity-90
                        mt-5
                        "
                        disabled={!verified}
                        >
                     Send Message
                     </button>
                  </div>
                  <div className='AUREO_result-message'>
                     {result ? <Result /> : null}
                  </div>
               </form>
               <div>
                  <span class="absolute -top-10 -right-9 z-[-1]">
                     <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                           fill-rule="evenodd"
                           clip-rule="evenodd"
                           d="M0 100C0 44.7715 0 0 0 0C55.2285 0 100 44.7715 100 100C100 100 100 100 0 100Z"
                           fill="#3056D3"
                           />
                     </svg>
                  </span>
                  <span class="absolute -right-10 top-[90px] z-[-1]">
                     <svg
                        width="34"
                        height="134"
                        viewBox="0 0 34 134"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <circle
                           cx="31.9993"
                           cy="132"
                           r="1.66667"
                           transform="rotate(180 31.9993 132)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="117.333"
                           r="1.66667"
                           transform="rotate(180 31.9993 117.333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="102.667"
                           r="1.66667"
                           transform="rotate(180 31.9993 102.667)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="88"
                           r="1.66667"
                           transform="rotate(180 31.9993 88)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="73.3333"
                           r="1.66667"
                           transform="rotate(180 31.9993 73.3333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="45"
                           r="1.66667"
                           transform="rotate(180 31.9993 45)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="16"
                           r="1.66667"
                           transform="rotate(180 31.9993 16)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="59"
                           r="1.66667"
                           transform="rotate(180 31.9993 59)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="30.6666"
                           r="1.66667"
                           transform="rotate(180 31.9993 30.6666)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="1.66665"
                           r="1.66667"
                           transform="rotate(180 31.9993 1.66665)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="132"
                           r="1.66667"
                           transform="rotate(180 17.3333 132)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="117.333"
                           r="1.66667"
                           transform="rotate(180 17.3333 117.333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="102.667"
                           r="1.66667"
                           transform="rotate(180 17.3333 102.667)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="88"
                           r="1.66667"
                           transform="rotate(180 17.3333 88)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="73.3333"
                           r="1.66667"
                           transform="rotate(180 17.3333 73.3333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="45"
                           r="1.66667"
                           transform="rotate(180 17.3333 45)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="16"
                           r="1.66667"
                           transform="rotate(180 17.3333 16)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="59"
                           r="1.66667"
                           transform="rotate(180 17.3333 59)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="30.6666"
                           r="1.66667"
                           transform="rotate(180 17.3333 30.6666)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="1.66665"
                           r="1.66667"
                           transform="rotate(180 17.3333 1.66665)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="132"
                           r="1.66667"
                           transform="rotate(180 2.66536 132)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="117.333"
                           r="1.66667"
                           transform="rotate(180 2.66536 117.333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="102.667"
                           r="1.66667"
                           transform="rotate(180 2.66536 102.667)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="88"
                           r="1.66667"
                           transform="rotate(180 2.66536 88)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="73.3333"
                           r="1.66667"
                           transform="rotate(180 2.66536 73.3333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="45"
                           r="1.66667"
                           transform="rotate(180 2.66536 45)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="16"
                           r="1.66667"
                           transform="rotate(180 2.66536 16)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="59"
                           r="1.66667"
                           transform="rotate(180 2.66536 59)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="30.6666"
                           r="1.66667"
                           transform="rotate(180 2.66536 30.6666)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="1.66665"
                           r="1.66667"
                           transform="rotate(180 2.66536 1.66665)"
                           fill="#13C296"
                           />
                     </svg>
                  </span>
                  <span class="absolute -left-7 -bottom-7 z-[-1]">
                     <svg
                        width="107"
                        height="134"
                        viewBox="0 0 107 134"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <circle
                           cx="104.999"
                           cy="132"
                           r="1.66667"
                           transform="rotate(180 104.999 132)"
                           fill="#13C296"
                           />
                        <circle
                           cx="104.999"
                           cy="117.333"
                           r="1.66667"
                           transform="rotate(180 104.999 117.333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="104.999"
                           cy="102.667"
                           r="1.66667"
                           transform="rotate(180 104.999 102.667)"
                           fill="#13C296"
                           />
                        <circle
                           cx="104.999"
                           cy="88"
                           r="1.66667"
                           transform="rotate(180 104.999 88)"
                           fill="#13C296"
                           />
                        <circle
                           cx="104.999"
                           cy="73.3333"
                           r="1.66667"
                           transform="rotate(180 104.999 73.3333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="104.999"
                           cy="45"
                           r="1.66667"
                           transform="rotate(180 104.999 45)"
                           fill="#13C296"
                           />
                        <circle
                           cx="104.999"
                           cy="16"
                           r="1.66667"
                           transform="rotate(180 104.999 16)"
                           fill="#13C296"
                           />
                        <circle
                           cx="104.999"
                           cy="59"
                           r="1.66667"
                           transform="rotate(180 104.999 59)"
                           fill="#13C296"
                           />
                        <circle
                           cx="104.999"
                           cy="30.6666"
                           r="1.66667"
                           transform="rotate(180 104.999 30.6666)"
                           fill="#13C296"
                           />
                        <circle
                           cx="104.999"
                           cy="1.66665"
                           r="1.66667"
                           transform="rotate(180 104.999 1.66665)"
                           fill="#13C296"
                           />
                        <circle
                           cx="90.3333"
                           cy="132"
                           r="1.66667"
                           transform="rotate(180 90.3333 132)"
                           fill="#13C296"
                           />
                        <circle
                           cx="90.3333"
                           cy="117.333"
                           r="1.66667"
                           transform="rotate(180 90.3333 117.333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="90.3333"
                           cy="102.667"
                           r="1.66667"
                           transform="rotate(180 90.3333 102.667)"
                           fill="#13C296"
                           />
                        <circle
                           cx="90.3333"
                           cy="88"
                           r="1.66667"
                           transform="rotate(180 90.3333 88)"
                           fill="#13C296"
                           />
                        <circle
                           cx="90.3333"
                           cy="73.3333"
                           r="1.66667"
                           transform="rotate(180 90.3333 73.3333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="90.3333"
                           cy="45"
                           r="1.66667"
                           transform="rotate(180 90.3333 45)"
                           fill="#13C296"
                           />
                        <circle
                           cx="90.3333"
                           cy="16"
                           r="1.66667"
                           transform="rotate(180 90.3333 16)"
                           fill="#13C296"
                           />
                        <circle
                           cx="90.3333"
                           cy="59"
                           r="1.66667"
                           transform="rotate(180 90.3333 59)"
                           fill="#13C296"
                           />
                        <circle
                           cx="90.3333"
                           cy="30.6666"
                           r="1.66667"
                           transform="rotate(180 90.3333 30.6666)"
                           fill="#13C296"
                           />
                        <circle
                           cx="90.3333"
                           cy="1.66665"
                           r="1.66667"
                           transform="rotate(180 90.3333 1.66665)"
                           fill="#13C296"
                           />
                        <circle
                           cx="75.6654"
                           cy="132"
                           r="1.66667"
                           transform="rotate(180 75.6654 132)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="132"
                           r="1.66667"
                           transform="rotate(180 31.9993 132)"
                           fill="#13C296"
                           />
                        <circle
                           cx="75.6654"
                           cy="117.333"
                           r="1.66667"
                           transform="rotate(180 75.6654 117.333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="117.333"
                           r="1.66667"
                           transform="rotate(180 31.9993 117.333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="75.6654"
                           cy="102.667"
                           r="1.66667"
                           transform="rotate(180 75.6654 102.667)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="102.667"
                           r="1.66667"
                           transform="rotate(180 31.9993 102.667)"
                           fill="#13C296"
                           />
                        <circle
                           cx="75.6654"
                           cy="88"
                           r="1.66667"
                           transform="rotate(180 75.6654 88)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="88"
                           r="1.66667"
                           transform="rotate(180 31.9993 88)"
                           fill="#13C296"
                           />
                        <circle
                           cx="75.6654"
                           cy="73.3333"
                           r="1.66667"
                           transform="rotate(180 75.6654 73.3333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="73.3333"
                           r="1.66667"
                           transform="rotate(180 31.9993 73.3333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="75.6654"
                           cy="45"
                           r="1.66667"
                           transform="rotate(180 75.6654 45)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="45"
                           r="1.66667"
                           transform="rotate(180 31.9993 45)"
                           fill="#13C296"
                           />
                        <circle
                           cx="75.6654"
                           cy="16"
                           r="1.66667"
                           transform="rotate(180 75.6654 16)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="16"
                           r="1.66667"
                           transform="rotate(180 31.9993 16)"
                           fill="#13C296"
                           />
                        <circle
                           cx="75.6654"
                           cy="59"
                           r="1.66667"
                           transform="rotate(180 75.6654 59)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="59"
                           r="1.66667"
                           transform="rotate(180 31.9993 59)"
                           fill="#13C296"
                           />
                        <circle
                           cx="75.6654"
                           cy="30.6666"
                           r="1.66667"
                           transform="rotate(180 75.6654 30.6666)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="30.6666"
                           r="1.66667"
                           transform="rotate(180 31.9993 30.6666)"
                           fill="#13C296"
                           />
                        <circle
                           cx="75.6654"
                           cy="1.66665"
                           r="1.66667"
                           transform="rotate(180 75.6654 1.66665)"
                           fill="#13C296"
                           />
                        <circle
                           cx="31.9993"
                           cy="1.66665"
                           r="1.66667"
                           transform="rotate(180 31.9993 1.66665)"
                           fill="#13C296"
                           />
                        <circle
                           cx="60.9993"
                           cy="132"
                           r="1.66667"
                           transform="rotate(180 60.9993 132)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="132"
                           r="1.66667"
                           transform="rotate(180 17.3333 132)"
                           fill="#13C296"
                           />
                        <circle
                           cx="60.9993"
                           cy="117.333"
                           r="1.66667"
                           transform="rotate(180 60.9993 117.333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="117.333"
                           r="1.66667"
                           transform="rotate(180 17.3333 117.333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="60.9993"
                           cy="102.667"
                           r="1.66667"
                           transform="rotate(180 60.9993 102.667)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="102.667"
                           r="1.66667"
                           transform="rotate(180 17.3333 102.667)"
                           fill="#13C296"
                           />
                        <circle
                           cx="60.9993"
                           cy="88"
                           r="1.66667"
                           transform="rotate(180 60.9993 88)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="88"
                           r="1.66667"
                           transform="rotate(180 17.3333 88)"
                           fill="#13C296"
                           />
                        <circle
                           cx="60.9993"
                           cy="73.3333"
                           r="1.66667"
                           transform="rotate(180 60.9993 73.3333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="73.3333"
                           r="1.66667"
                           transform="rotate(180 17.3333 73.3333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="60.9993"
                           cy="45"
                           r="1.66667"
                           transform="rotate(180 60.9993 45)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="45"
                           r="1.66667"
                           transform="rotate(180 17.3333 45)"
                           fill="#13C296"
                           />
                        <circle
                           cx="60.9993"
                           cy="16"
                           r="1.66667"
                           transform="rotate(180 60.9993 16)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="16"
                           r="1.66667"
                           transform="rotate(180 17.3333 16)"
                           fill="#13C296"
                           />
                        <circle
                           cx="60.9993"
                           cy="59"
                           r="1.66667"
                           transform="rotate(180 60.9993 59)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="59"
                           r="1.66667"
                           transform="rotate(180 17.3333 59)"
                           fill="#13C296"
                           />
                        <circle
                           cx="60.9993"
                           cy="30.6666"
                           r="1.66667"
                           transform="rotate(180 60.9993 30.6666)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="30.6666"
                           r="1.66667"
                           transform="rotate(180 17.3333 30.6666)"
                           fill="#13C296"
                           />
                        <circle
                           cx="60.9993"
                           cy="1.66665"
                           r="1.66667"
                           transform="rotate(180 60.9993 1.66665)"
                           fill="#13C296"
                           />
                        <circle
                           cx="17.3333"
                           cy="1.66665"
                           r="1.66667"
                           transform="rotate(180 17.3333 1.66665)"
                           fill="#13C296"
                           />
                        <circle
                           cx="46.3333"
                           cy="132"
                           r="1.66667"
                           transform="rotate(180 46.3333 132)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="132"
                           r="1.66667"
                           transform="rotate(180 2.66536 132)"
                           fill="#13C296"
                           />
                        <circle
                           cx="46.3333"
                           cy="117.333"
                           r="1.66667"
                           transform="rotate(180 46.3333 117.333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="117.333"
                           r="1.66667"
                           transform="rotate(180 2.66536 117.333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="46.3333"
                           cy="102.667"
                           r="1.66667"
                           transform="rotate(180 46.3333 102.667)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="102.667"
                           r="1.66667"
                           transform="rotate(180 2.66536 102.667)"
                           fill="#13C296"
                           />
                        <circle
                           cx="46.3333"
                           cy="88"
                           r="1.66667"
                           transform="rotate(180 46.3333 88)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="88"
                           r="1.66667"
                           transform="rotate(180 2.66536 88)"
                           fill="#13C296"
                           />
                        <circle
                           cx="46.3333"
                           cy="73.3333"
                           r="1.66667"
                           transform="rotate(180 46.3333 73.3333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="73.3333"
                           r="1.66667"
                           transform="rotate(180 2.66536 73.3333)"
                           fill="#13C296"
                           />
                        <circle
                           cx="46.3333"
                           cy="45"
                           r="1.66667"
                           transform="rotate(180 46.3333 45)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="45"
                           r="1.66667"
                           transform="rotate(180 2.66536 45)"
                           fill="#13C296"
                           />
                        <circle
                           cx="46.3333"
                           cy="16"
                           r="1.66667"
                           transform="rotate(180 46.3333 16)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="16"
                           r="1.66667"
                           transform="rotate(180 2.66536 16)"
                           fill="#13C296"
                           />
                        <circle
                           cx="46.3333"
                           cy="59"
                           r="1.66667"
                           transform="rotate(180 46.3333 59)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="59"
                           r="1.66667"
                           transform="rotate(180 2.66536 59)"
                           fill="#13C296"
                           />
                        <circle
                           cx="46.3333"
                           cy="30.6666"
                           r="1.66667"
                           transform="rotate(180 46.3333 30.6666)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="30.6666"
                           r="1.66667"
                           transform="rotate(180 2.66536 30.6666)"
                           fill="#13C296"
                           />
                        <circle
                           cx="46.3333"
                           cy="1.66665"
                           r="1.66667"
                           transform="rotate(180 46.3333 1.66665)"
                           fill="#13C296"
                           />
                        <circle
                           cx="2.66536"
                           cy="1.66665"
                           r="1.66667"
                           transform="rotate(180 2.66536 1.66665)"
                           fill="#13C296"
                           />
                     </svg>
                  </span>
               </div>
            </div>
         </div>
      </div>
   </div>
</section>

    </div> 
  )
}

export default ContactForm