import React from 'react'
import './blog.css'
import Article from '../../components/article/Article'
import {blogs_json} from './imports'

const blogImages = require.context('../../assets', true)

const Blog = () => {
  
  return (
    
    <div className='AUREO__blog section__padding' id="blog">
      <div className='AUREO__blog-heading'>
        <h1 className='gradient__text-yellow'>A lot is happening, <br /> We are blogging about it.</h1>
      </div>
      <div className='AUREO__blog-container'>
        {blogs_json.blogs.map((item, index) => {
          if(index === 0){

            return(
                <div className='AUREO__blog-container_groupA'>
                  <Article blogId={item.id} imgUrl={blogImages(`./${item.image_url}`)} date={item.date_published} title={item.title}/>
                </div>
            )
          }else{
            return null;
          }
        })}
        <div className='AUREO__blog-container_groupB'>
            {blogs_json.blogs.map((item, index) => {
              if(index !== 0){
                return(
                  <Article blogId={item.id} imgUrl={blogImages(`./${item.image_url}`)} date={item.date_published} title={item.title}/>
                )
              }else{
                return null;
              }
            })}
        </div>
      </div>
        {/* <div className='AUREO__blog-container_groupA'>
          <Article imgUrl={blog01}  date='Sep 16, 2021' title='The Impact of GPT-3 on Website Development'/>
        </div>
        <div className='AUREO__blog-container_groupB'>
        <Article imgUrl={blog02} date='Sep 16, 2021' title='The Role of a Website in a Companys Online Presence'/>
        <Article imgUrl={blog03} date='Sep 16, 2021' title='How to Optimize Your Website for Search Engines'/>
        <Article imgUrl={blog04} date='Sep 16, 2021' title='The Role of Mobile Responsiveness in Website Design'/>
        <Article imgUrl={blog05} date='Sep 16, 2021' title='The Benefits of Ecommerce for Small Businesses'/>
        </div> */}
      
    </div>
  )
}

export default Blog
