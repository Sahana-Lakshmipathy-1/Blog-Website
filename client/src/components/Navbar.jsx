// src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import UserDropDown from './UserDropDown';
import { useNavigationHandler } from '@/hooks/NavigateHook';


const NavBar = () => {

   const handleClick = useNavigationHandler();
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      <h1 className="text-3xl font-semibold text-gray-800" onClick={() => handleClick('/')}> My Blog</h1>
      <div className="flex items-center gap-4">
        <Link 
          to='/about'
          className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
        >
          About
        </Link>
        <Link
          to="/blogs"
          className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
        >
          Blogs
        </Link>
        <Link
          to="/create"
          className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
        >
          Create Blog
        </Link>
        <UserDropDown />
      </div>

    </nav>
  );
};

export default NavBar;
