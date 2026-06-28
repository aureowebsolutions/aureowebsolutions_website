import React from 'react'
import { Link } from 'react-router-dom'
import { useBlogs } from '../../hooks/useBlogs'
import './HomeBlogPreview.css'

const SkeletonCard = () => (
  <div className="hbp-card hbp-card--skeleton" aria-hidden="true">
    <div className="hbp-card__img-skeleton" />
    <div className="hbp-card__body">
      <div className="hbp-skeleton hbp-skeleton--tag" />
      <div className="hbp-skeleton hbp-skeleton--title" />
      <div className="hbp-skeleton hbp-skeleton--line" />
      <div className="hbp-skeleton hbp-skeleton--line hbp-skeleton--short" />
    </div>
  </div>
)

const BlogCard = ({ blog }) => (
  <Link to={`/blog/${blog.id}`} className="hbp-card">
    {blog.image_url && (
      <div className="hbp-card__img-wrap">
        <img src={blog.image_url} alt={blog.title} className="hbp-card__img" loading="lazy" />
      </div>
    )}
    <div className="hbp-card__body">
      <span className="hbp-card__date">{blog.date_published}</span>
      <h3 className="hbp-card__title">{blog.title}</h3>
      <p className="hbp-card__author">By {blog.author}</p>
    </div>
  </Link>
)

const HomeBlogPreview = () => {
  const { blogs, loading } = useBlogs()

  if (!loading && blogs.length === 0) return null

  return (
    <section className="hbp-section fade-up" id="blog">
      <div className="hbp-section__inner">
        <div className="hbp-section__header">
          <p className="hbp-section__overline">From the blog</p>
          <h2 className="hbp-section__heading">Latest Insights</h2>
        </div>

        <div className="hbp-grid">
          {loading
            ? [0, 1, 2].map(i => <SkeletonCard key={i} />)
            : blogs.slice(0, 3).map(b => <BlogCard key={b.id} blog={b} />)
          }
        </div>

        {!loading && blogs.length > 0 && (
          <div className="hbp-section__footer">
            <Link to="/blog" className="hbp-view-all">View all posts →</Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default HomeBlogPreview
