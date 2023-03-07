import React from 'react'
import { Navigate, useParams } from 'react-router-dom';
import { blogs_json } from './imports';

const blogImages = require.context('../../assets', true)

const getBlogById = (id) => {
    //return blogs_json.find (blog => blog.id === id)
    return blogs_json.blogs.find( blog => blog.id === id);
}

export const BlogPage = () => {

const {id} = useParams();

const blog = getBlogById(id);

if( !blog ){
    return <Navigate to="/#blog" />
}
console.log(blog);

    return (
            <div class="container prose-slate sm:prose-md md:prose-lg lg:prose-xl mx-auto ">
                <section class="mb-32 text-gray-800">
                    <div class="flex justify-center">
                        <img src={blogImages(`./${blog.image_url}`)} class="mb-6 mt-6" alt={blog.id} />
                    </div>
                    <div class="flex items-center mb-6">
                        <img src="https://mdbootstrap.com/img/Photos/Avatars/img (23).jpg" class="rounded-full mr-2 h-8" alt="" loading="lazy" />
                        <div>
                            <span> Published <u>{ blog.date_published } </u> by </span>
                            <a href="#!" class="font-medium">{ blog.author }</a>
                        </div>
                    </div>
                    
                    <h1 class="font-bold mb-6 ">{ blog.title }</h1>

                    {blog.content.map((item, index) => {
                        switch (item.type) {
                        case "heading":
                            return <h2 key={index}>{item.text}</h2>;
                        case "paragraph":
                            return <p key={index}>{item.text}</p>;
                        case "bullet_points":
                            return (
                            <ul key={index} class="prose-ul list-disc list-inside">
                                {item.items.map((bulletPoint, index) => (
                                <li key={index}>{bulletPoint}</li>
                                ))}
                            </ul>
                            );
                        default:
                            return null;
                        }
                    })}
                    
                </section>
            </div>
    )
}

