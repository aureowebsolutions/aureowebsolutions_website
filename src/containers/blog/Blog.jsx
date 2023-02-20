import React from 'react'
import './blog.css'
import Article from '../../components/article/Article'
import {blog01, blog02, blog03, blog04, blog05} from './imports'

const Blog = () => {
  return (
    <div className='AUREO__blog section__padding' id="blog">
      <div className='AUREO__blog-heading'>
        <h1 className='gradient__text-yellow'>A lot is happening, <br /> We are blogging about it.</h1>
      </div>
      <div className='AUREO__blog-container'>
        <div className='AUREO__blog-container_groupA'>
          <Article imgUrl={blog01}  date='Sep 16, 2021' title='The Impact of GPT-3 on Website Development'/>
        </div>
        <div className='AUREO__blog-container_groupB'>
        <Article imgUrl={blog02} date='Sep 16, 2021' title='The Role of a Website in a Companys Online Presence'/>
        <Article imgUrl={blog03} date='Sep 16, 2021' title='How to Optimize Your Website for Search Engines'/>
        <Article imgUrl={blog04} date='Sep 16, 2021' title='The Role of Mobile Responsiveness in Website Design'/>
        <Article imgUrl={blog05} date='Sep 16, 2021' title='The Benefits of Ecommerce for Small Businesses'/>
        </div>
      </div>
      Blog
    </div>
  )
}

export default Blog