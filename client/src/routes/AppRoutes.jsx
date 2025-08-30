import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import BlogForm from '../components/BlogForm';
import BlogLayout from '@/layouts/BlogLayout';
import UserDropDown from '@/components/UserDropDown';
import BlogDetails from '@/components/BlogDetails';
import Newsletter from '@/pages/Newsletter';
import Home from '@/pages/Home';
import Support from '@/pages/Support';
import About from '@/pages/About';
import Login from '@/pages/Login';

// Simple auth check: returns true if token exists
const isAuthenticated = () => !!localStorage.getItem('authToken');

const RequireAuth = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const RedirectIfAuth = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route: Login */}
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <Login />
          </RedirectIfAuth>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route
        path="/blog"
        element={
          <RequireAuth>
            <BlogLayout />
          </RequireAuth>
        }
      />
      <Route
        path="/create"
        element={
          <RequireAuth>
            {/* The form is for creating, so no isEdit prop is needed */}
            <BlogForm />
          </RequireAuth>
        }
      />
      <Route
        path="/user"
        element={
          <RequireAuth>
            <UserDropDown />
          </RequireAuth>
        }
      />
      <Route
        path="/blog/:id"
        element={
          <RequireAuth>
            <BlogDetails />
          </RequireAuth>
        }
      />
      <Route
        path="/support"
        element={
          <RequireAuth>
            <Support />
          </RequireAuth>
        }
      />
      <Route
        path="/about"
        element={
          <RequireAuth>
            <About />
          </RequireAuth>
        }
      />
      <Route
        path="/newsletter"
        element={
          <RequireAuth>
            <Newsletter />
          </RequireAuth>
        }
      />
      <Route
        path="/blogs/:id/edit" // Use a clearer path for editing
        element={
          <RequireAuth>
            {/* ✅ Pass the isEdit prop to tell the component to fetch data */}
            <BlogForm isEdit={true} />
          </RequireAuth>
        }
      />
      

      {/* Catch-all redirect unknown paths to home or login */}
      <Route
        path="*"
        element={
          isAuthenticated() ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
