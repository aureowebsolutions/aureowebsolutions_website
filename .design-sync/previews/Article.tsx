import React from 'react'
import { Article } from 'aureowebsolutions-ui'

export function BlogCard() {
  return (
    <div style={{ background: '#031B34', padding: 24, maxWidth: 400 }}>
      <Article
        blogId="the-impact-of-gpt3-on-website-development"
        date="2023-02-24"
        author="Lewins Correa"
        title="The Impact of GPT-3 on Website Development"
        content="Explore how GPT-3 is reshaping the way developers build and design modern web applications."
        imgUrl=""
      />
    </div>
  )
}

export function WithoutContent() {
  return (
    <div style={{ background: '#031B34', padding: 24, maxWidth: 300 }}>
      <Article
        blogId="the-role-of-a-website-in-a-company-online-presence"
        date="2023-01-15"
        author="Lewins Correa"
        title="The Role of a Website in a Company's Online Presence"
        imgUrl=""
      />
    </div>
  )
}
