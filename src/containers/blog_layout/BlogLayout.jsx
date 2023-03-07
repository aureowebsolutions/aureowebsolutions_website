import React from 'react'
import { Navbar } from '../../components'
import { BlogPage } from '../blog/BlogPage'
import { blog01,blog02, blog03, blog04, blog05 } from '../blog/imports'
import Footer from '../footer/Footer'

const BlogLayout = () => {
  return (
    
    <main class=" bg-gray-100 min-h-screen">
        <div className='gradient__bg'>
            <Navbar />
        </div>
         {/**** Blog layout Middle-botton section ****/}
        <div class="container mx-auto xl:px-4 lg:px-1 flex flex-wrap lg:flex-nowrap">
            <div class="xl:w-9/12 xl:py-12 lg:w-8/12  lg:py-0 w-full mx-6">
                
                 {/**** Article description Middle section ****/}
                <div class="br-white shadow-sm rounded-sm">
                    <BlogPage/>
                </div>
                {/**** Related post Middle section ****/}
                <div class="flex justify-between bg-white px-3 py-2 items-center rounded-sm mb-4 max-sm:hidden">
                    <h5 class="text-base uppercase font-semibold">Related Post</h5>
                    <a href="" class="text-white bg-blue-500 px-3 py-1 rounded-sm uppercase text-sm hover:bg-transparent hover:text-blue-500 transition border-blue-500"> see more</a>
                </div>
                {/**** Articles list medium image Middle-botton section ****/}
                <div class="grid gap-4 grid-cols-2 mt-4 max-sm:hidden">
                    <div className="p-4 bg-white rounded-sm shadow-sm">
                        <a href="the-role-of-a-website-in-a-company-online-presence" class="overflow-hidden block">
                            <img src={blog02} alt="" class="w-full h-60 object-cover rounded transform hover:scale-110 transition duration-500"/>
                        </a>
                        <a href="the-role-of-a-website-in-a-company-online-presence" class="overflow-hidden block">
                            <div class="mt-3">
                                <h2 class="text-xl font-semibold text-gray-700 hover:text-blue-500 transition">
                                The Role of a Website in a Company's Online Presence
                                </h2>
                            </div>
                            <div className="flex mt-2 space-x-5">
                                <div className='flex items-center text-sm text-gray-400'>
                                    <span className="mr-2 text-xs" ><i class="far fa-user"></i></span>
                                Blogging Tips
                                </div>
                                <div className='flex items-center text-sm text-gray-400'>
                                    <span className="mr-2 text-xs" ><i class="far fa-clock"></i></span>
                                    Jan 31, 2023
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="p-4 bg-white rounded-sm shadow-sm">
                        <a href="the-role-of-movile-responsiveness-in-website-design" class="overflow-hidden block">
                            <img src={blog04} alt="" class="w-full h-60 object-cover rounded transform hover:scale-110 transition duration-500"/>
                        </a>
                        <a href="the-role-of-movile-responsiveness-in-website-design" class="overflow-hidden block">
                            <div class="mt-3">
                                <h2 class="text-xl font-semibold text-gray-700 hover:text-blue-500 transition">
                                    The Role of Mobile Responsiveness in Website Design
                                </h2>
                            </div>
                            <div className="flex mt-2 space-x-5">
                                <div className='flex items-center text-sm text-gray-400'>
                                    <span className="mr-2 text-xs" ><i class="far fa-user"></i></span>
                                Blogging Tips
                                </div>
                                <div className='flex items-center text-sm text-gray-400'>
                                    <span className="mr-2 text-xs" ><i class="far fa-clock"></i></span>
                                    Jan 31, 2023
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="p-4 bg-white rounded-sm shadow-sm">
                        <a href="how-to-optimize-your-website-for-search-engines" class="overflow-hidden block">
                            <img src={blog03} alt="" class="w-full h-60 object-cover rounded transform hover:scale-110 transition duration-500"/>
                        </a>
                        <a href="how-to-optimize-your-website-for-search-engines" class="overflow-hidden block">
                            <div class="mt-3">
                                <h2 class="text-xl font-semibold text-gray-700 hover:text-blue-500 transition">
                                    How to Optimize Your Website for Search Engines
                                </h2>
                            </div>
                            <div className="flex mt-2 space-x-5">
                                <div className='flex items-center text-sm text-gray-400'>
                                    <span className="mr-2 text-xs" ><i class="far fa-user"></i></span>
                                Blogging Tips
                                </div>
                                <div className='flex items-center text-sm text-gray-400'>
                                    <span className="mr-2 text-xs" ><i class="far fa-clock"></i></span>
                                    Jan 31, 2023
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="p-4 bg-white rounded-sm shadow-sm">
                        <a href="the-benefits-of-ecommerce-for-small-businesses" class="overflow-hidden block">
                            <img src={blog05} alt="" class="w-full h-60 object-cover rounded transform hover:scale-110 transition duration-500"/>
                        </a>
                        <a href="the-benefits-of-ecommerce-for-small-businesses" class="overflow-hidden block">
                            <div class="mt-3">
                                <h2 class="text-xl font-semibold text-gray-700 hover:text-blue-500 transition">
                                The Benefits of Ecommerce for Small Businesses
                                </h2>
                            </div>
                            <div className="flex mt-2 space-x-5">
                                <div className='flex items-center text-sm text-gray-400'>
                                    <span className="mr-2 text-xs" ><i class="far fa-user"></i></span>
                                Blogging Tips
                                </div>
                                <div className='flex items-center text-sm text-gray-400'>
                                    <span className="mr-2 text-xs" ><i class="far fa-clock"></i></span>
                                    Jan 31, 2023
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
             {/**** Blog layout Right-side section ****/}
            <div class="xl:w-3/12 xl:py-12 lg:w-4/12 lg:py-0 w-full">
                {/**** Social Media Right-side section ****/}
                <div class="bg-white shadow-sm rounded-sm p-4 max-lg:mt-8 max-md:mt-0">
                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Social Plugin</h3>
                    <div class=" flex gap-2">
                        <a href="https://www.facebook.com/aureowebsolutions" target="_blank" class='w-8 h-8 rounded-sm flex items-center justify-center border border-gray-400 text-base text-gray-800'>
                            <i class="fab fa-facebook-f" aria-hidden="true"></i>
                        </a>
                        <a href="https://www.instagram.com/aureowebsolutions" target="_blank" class='w-8 h-8 rounded-sm flex items-center justify-center border border-gray-400 text-base text-gray-800'>
                            <i class="fab fa-instagram" aria-hidden="true"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/lewins-jose-correa-cisneros-823a4515a/" target="_blank" class='w-8 h-8 rounded-sm flex items-center justify-center border border-gray-400 text-base text-gray-800'>
                            <i class="fab fa-linkedin-in" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
                {/**** All Blogs Right-side section ****/}
                <div class="bg-white shadow-sm rounded-sm p-4 mt-8">
                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Most Popular Post</h3>
                    <div class="space-y-4">
                        <a href="the-impact-of-gpt3-on-website-development" class="flex group">
                            <div class="flex-shrink-0">
                                <img src={blog01} alt="blog01" class="w-20 h-14 rounded object-cover"/>
                            </div>
                            <div class="flex-grow pl-3">
                                <h5 class="text-md leading-5 font-semibold group-hover:text-blue-500 transition">
                                    The Impact of GPT-3 on Website Development
                                </h5>
                                <div class=" flex text-gray-400 text-sm item-center">
                                    <span class="mr-1 text-xs">
                                        <i class="far fa-clock"></i>
                                    </span>
                                    Jan 31 2023
                                </div>
                            </div>
                        </a>
                        <a href="the-role-of-a-website-in-a-company-online-presence" class="flex group">
                            <div class="flex-shrink-0">
                                <img src={blog02} alt="blog01" class="w-20 h-14 rounded object-cover"/>
                            </div>
                            <div class="flex-grow pl-3">
                                <h5 class="text-md leading-5 font-semibold group-hover:text-blue-500 transition">
                                    The Role of a Website in a Company's Online Presence
                                </h5>
                                <div class=" flex text-gray-400 text-sm item-center">
                                    <span class="mr-1 text-xs">
                                        <i class="far fa-clock"></i>
                                    </span>
                                    Jan 31 2023
                                </div>
                            </div>
                        </a>
                        <a href="the-benefits-of-ecommerce-for-small-businesses" class="flex group">
                            <div class="flex-shrink-0">
                                <img src={blog05} alt="blog01" class="w-20 h-14 rounded object-cover"/>
                            </div>
                            <div class="flex-grow pl-3">
                                <h5 class="text-md leading-5 font-semibold group-hover:text-blue-500 transition">
                                The Benefits of Ecommerce for Small Businesses
                                </h5>
                                <div class=" flex text-gray-400 text-sm item-center">
                                    <span class="mr-1 text-xs">
                                        <i class="far fa-clock"></i>
                                    </span>
                                    Jan 31 2023
                                </div>
                            </div>
                        </a>
                        <a href="how-to-optimize-your-website-for-search-engines" class="flex group">
                            <div class="flex-shrink-0">
                                <img src={blog03} alt="blog01" class="w-20 h-14 rounded object-cover"/>
                            </div>
                            <div class="flex-grow pl-3">
                                <h5 class="text-md leading-5 font-semibold group-hover:text-blue-500 transition">
                                    How to Optimize Your Website for Search Engines
                                </h5>
                                <div class=" flex text-gray-400 text-sm item-center">
                                    <span class="mr-1 text-xs">
                                        <i class="far fa-clock"></i>
                                    </span>
                                    Jan 31 2023
                                </div>
                            </div>
                        </a>
                        <a href="the-role-of-movile-responsiveness-in-website-design" class="flex group">
                            <div class="flex-shrink-0">
                                <img src={blog04} alt="blog01" class="w-20 h-14 rounded object-cover"/>
                            </div>
                            <div class="flex-grow pl-3">
                                <h5 class="text-md leading-5 font-semibold group-hover:text-blue-500 transition">
                                    The Role of Mobile Responsiveness in Website Design
                                </h5>
                                <div class=" flex text-gray-400 text-sm item-center">
                                    <span class="mr-1 text-xs">
                                        <i class="far fa-clock"></i>
                                    </span>
                                    Jan 31 2023
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
                {/**** Tags Right-side section ****/}
                <div class="bg-white shadow-sm rounded-sm p-4 mt-8">
                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Tags</h3>
                    <div class="flex flex-wrap gap-2">
                        <a href="" class="px-3 py-1 text-sm border corder-gray-200 rounded-sm hover:bg-blue-500 hover:text-white transition">Web Design</a>
                        <a href="" class="px-3 py-1 text-sm border corder-gray-200 rounded-sm hover:bg-blue-500 hover:text-white transition">SEO</a>
                        <a href="" class="px-3 py-1 text-sm border corder-gray-200 rounded-sm hover:bg-blue-500 hover:text-white transition">Web Develop</a>
                        <a href="" class="px-3 py-1 text-sm border corder-gray-200 rounded-sm hover:bg-blue-500 hover:text-white transition">Optimization</a>
                        <a href="" class="px-3 py-1 text-sm border corder-gray-200 rounded-sm hover:bg-blue-500 hover:text-white transition">Website</a>
                        <a href="" class="px-3 py-1 text-sm border corder-gray-200 rounded-sm hover:bg-blue-500 hover:text-white transition">Google Possitioning</a>
                        <a href="" class="px-3 py-1 text-sm border corder-gray-200 rounded-sm hover:bg-blue-500 hover:text-white transition">Shopify</a>
                        <a href="" class="px-3 py-1 text-sm border corder-gray-200 rounded-sm hover:bg-blue-500 hover:text-white transition">Store</a>
                        <a href="" class="px-3 py-1 text-sm border corder-gray-200 rounded-sm hover:bg-blue-500 hover:text-white transition">Chat GTP</a>
                        <a href="" class="px-3 py-1 text-sm border corder-gray-200 rounded-sm hover:bg-blue-500 hover:text-white transition">Artificial Intelligence</a>
                        <a href="" class="px-3 py-1 text-sm border corder-gray-200 rounded-sm hover:bg-blue-500 hover:text-white transition">Store</a>
                    </div>
                </div>
                {/**** Categories Right-side section ****/}
                <div class="bg-white shadow-sm rounded-sm p-4">
                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Categories</h3>
                    <div class="text-gray-700 space-y-2">
                        <a href="" class="flex items-center font-semibold leading-4 uppercase text-sm hover:text-blue-500 transition">
                            <span class="mr-2">
                                <i class="far fa-folder-open"></i>
                            </span>
                            <span>
                                Reanult
                            </span>
                            <span class='font-normal ml-auto'>(12)</span>
                        </a>
                    </div>
                </div>
                {/**** random post Right-side section ****/}
                <div class="bg-white shadow-sm rounded-sm p-4 mt-8 mb-8">
                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Random Post</h3>
                    <div class="space-y-4">
                        <a href="the-impact-of-gpt3-on-website-development" class="flex group">
                            <div class="flex-shrink-0">
                                <img src={blog01} alt="blog01" class="w-20 h-14 rounded object-cover"/>
                            </div>
                            <div class="flex-grow pl-3">
                                <h5 class="text-md leading-5 font-semibold group-hover:text-blue-500 transition">
                                    The Impact of GPT-3 on Website Development
                                </h5>
                                <div class=" flex text-gray-400 text-sm item-center">
                                    <span class="mr-1 text-xs">
                                        <i class="far fa-clock"></i>
                                    </span>
                                    Jan 31 2023
                                </div>
                            </div>
                        </a>
                        <a href="the-role-of-a-website-in-a-company-online-presence" class="flex group">
                            <div class="flex-shrink-0">
                                <img src={blog02} alt="blog01" class="w-20 h-14 rounded object-cover"/>
                            </div>
                            <div class="flex-grow pl-3">
                                <h5 class="text-md leading-5 font-semibold group-hover:text-blue-500 transition">
                                    The Role of a Website in a Company's Online Presence
                                </h5>
                                <div class=" flex text-gray-400 text-sm item-center">
                                    <span class="mr-1 text-xs">
                                        <i class="far fa-clock"></i>
                                    </span>
                                    Jan 31 2023
                                </div>
                            </div>
                        </a>
                        <a href="the-benefits-of-ecommerce-for-small-businesses" class="flex group">
                            <div class="flex-shrink-0">
                                <img src={blog05} alt="blog01" class="w-20 h-14 rounded object-cover"/>
                            </div>
                            <div class="flex-grow pl-3">
                                <h5 class="text-md leading-5 font-semibold group-hover:text-blue-500 transition">
                                The Benefits of Ecommerce for Small Businesses
                                </h5>
                                <div class=" flex text-gray-400 text-sm item-center">
                                    <span class="mr-1 text-xs">
                                        <i class="far fa-clock"></i>
                                    </span>
                                    Jan 31 2023
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </main>
  )
}

export default BlogLayout