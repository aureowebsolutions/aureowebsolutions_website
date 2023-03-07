import React from 'react'
import './article.css'
import { Link } from 'react-router-dom'

const Article = ({ imgUrl, date, title ,blogId}) => (
    <div className='AUREO__blog-container_article'>
      <div className='AUREO__blog-container_article-image'>
        <img src={`${imgUrl}`} alt="blog" />
      </div>
      <div className='AUREO__blog-container_article-content'>
        <div>
          <p>{date}</p>
          <h3>{title}</h3>
        </div>
        <Link to={`blog/${blogId}`}><p>Read Full Article</p></Link>
      </div>
    </div>
)

export default Article
