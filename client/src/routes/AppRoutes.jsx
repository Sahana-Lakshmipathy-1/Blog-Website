// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlogForm from '../components/BlogForm';
import BlogLayout from '@/layouts/BlogLayout';
import UserDropDown from '@/components/UserDropDown';
import BlogDetails from '@/components/BlogDetails';
import Newsletter from '@/pages/Newsletter';
import Home from '@/pages/Home';
import Support from '@/pages/Support';
import About from '@/pages/About';


const AppRoutes = () => {
  return (
    // defining the our routes
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/blog' element={<BlogLayout/>} />
      <Route path='/create' element={<BlogForm />} />
      <Route path='/user' element={<UserDropDown/>}/>
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path='/support' element={<Support/>}/>
      <Route path='about' element={<About/>}/>
      <Route path='/newsletter' element={<Newsletter/>}/>

    </Routes>
  );
};

export default AppRoutes;
