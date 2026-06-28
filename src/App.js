import React from 'react'
import './App.css'
import Home from './pages/home/Home'
import ContactUs from './pages/contact-us/ContactUs'
import LoginPage from './pages/LoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminWorksPage from './pages/admin/AdminWorksPage'
import AdminBlogPage from './pages/admin/AdminBlogPage'
import WorksFormPage from './pages/admin/WorksFormPage'
import BlogFormPage from './pages/admin/BlogFormPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BlogLayout from './containers/blog_layout/BlogLayout'
import ScrollToTop from './components/scrollTop/ScrollTotop'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="contact-us/" element={<ContactUs />} />
              <Route path="blog/:id" element={<BlogLayout />} />
              <Route path="login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<AdminBlogPage />} />
                  <Route path="blog" element={<AdminBlogPage />} />
                  <Route path="blog/new" element={<BlogFormPage />} />
                  <Route path="blog/:id" element={<BlogFormPage />} />
                  <Route path="works" element={<AdminWorksPage />} />
                  <Route path="works/new" element={<WorksFormPage />} />
                  <Route path="works/:id" element={<WorksFormPage />} />
                </Route>
              </Route>
            </Routes>
          </ScrollToTop>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App