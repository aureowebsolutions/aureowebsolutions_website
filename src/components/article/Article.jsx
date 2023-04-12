import React from 'react'
import './article.css'
import { Link } from 'react-router-dom'

const Article = ({ imgUrl, date, title ,blogId, content, author}) => (
    <div className='AUREO__blog-container_article'>
      <div className='AUREO__blog-container_article-image'>
      <Link to={`blog/${blogId}`}><img src={`${imgUrl}`} alt="blog" /></Link>
      </div>
      <div className='AUREO__blog-container_article-content'>
        <div>
          <p class='text-sm text-blue-400 mb-5'>{author}, {date} </p>
          <Link to={`blog/${blogId}`}><h3 class="text-2xl text-white mb-2">{title}</h3></Link>
          <p class='font-thin text-lg text-white max-xl:hidden'>{content}</p>
        </div>
        <Link to={`blog/${blogId}`}><p class="font-semibold lg:text-md md:text-sm sm:text-xs text-amber-300 ">Read Full Article ...</p></Link>
      </div>
    </div>
)

export default Article
