import React from 'react';
import Feature from '../../components/feature/Feature';
import './whatAUREO.css';
import {icon01, icon02,icon03,logo_aureo} from './icons'

const WhatAUREO = () => (
  <div className="AUREO__whatAUREO section__margin" id="wAUREO">
    <div className="AUREO__whatAUREO-feature">
      <Feature imgUrl={logo_aureo} title="What is AUREO" text="Aureo Web Solutions is a dynamic web development startup that is dedicated to helping businesses establish and enhance their online presence. Our team of expert developers is equipped with the latest technology and skills to deliver innovative and tailored web development solutions that meet the unique needs of each client. From custom website design and development to e-commerce solutions and website maintenance, we offer a full range of services to help businesses succeed in the digital age. Our commitment to quality, speed, and affordability sets us apart and makes us the go-to choice for businesses looking to revamp their online presence. Let us take your business to the next level with our professional web development services." />
    </div>
    <div className="AUREO__whatAUREO-heading">
      <h1 className="gradient__text-yellow">Unleash Your Business Potential with Aureo Web Solutions</h1>
      <p>Explore the Library</p>
    </div>
    <div className="AUREO__whatAUREO-container">
      <Feature imgUrl={icon01} title="Tailored Solution" text="We work closely with clients to create custom web development solutions that align with their brand identity and business objectives." />
      <Feature imgUrl={icon02} title="Expertise and Quality" text="We ensure that every project is completed to the highest standard and meets industry standards." />
      <Feature imgUrl={icon03} title="Efficient Services" text="We make sure that projects are completed on time, so clients can start seeing the benefits of their investment as soon as possible." />
    </div>
  </div>
);

export default WhatAUREO;