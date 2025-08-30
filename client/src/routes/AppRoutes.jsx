import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import BlogForm from "@/components/BlogForm";
import BlogLayout from "@/layouts/BlogLayout";
import BlogDetails from "@/components/BlogDetails";
import Newsletter from "@/pages/Newsletter";
import Home from "@/pages/Home";
import Support from "@/pages/Support";
import About from "@/pages/About";
import Login from "@/pages/Login";

// Simple auth check: returns true if token exists
const isAuthenticated = () => !!localStorage.getItem("authToken");

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

      {/* All blogs */}
      <Route
        path="/blogs"
        element={
          <RequireAuth>
            <BlogLayout />
          </RequireAuth>
        }
      />

      {/* User-specific blogs */}
      <Route
        path="/userblogs"
        element={
          <RequireAuth>
            <BlogLayout />
          </RequireAuth>
        }
      />

      {/* Blog details */}
      <Route
        path="/blogs/:id"
        element={
          <RequireAuth>
            <BlogDetails />
          </RequireAuth>
        }
      />

      {/* Create new blog */}
      <Route
        path="/blogs/create"
        element={
          <RequireAuth>
            <BlogForm />
          </RequireAuth>
        }
      />

      {/* Edit blog */}
      <Route
        path="/blogs/:id/edit"
        element={
          <RequireAuth>
            <BlogForm isEdit={true} />
          </RequireAuth>
        }
      />

      {/* Other pages */}
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

      {/* Catch-all redirect */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated() ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
