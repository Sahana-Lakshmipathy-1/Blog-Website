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
import BlogWizard from "@/components/BlogWizard";

// Auth check: returns true if token exists
const isAuthenticated = () => !!localStorage.getItem("authToken");

// Wrapper for protected routes
const RequireAuth = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

// Wrapper for public routes (redirect if logged in)
const RedirectIfAuth = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : <>{children}</>;
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

      {/* Protected Home route */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />

      {/* Blogs */}
      <Route
        path="/blogs/:id/edit"
        element={
          <RequireAuth>
            <BlogForm isEdit />
          </RequireAuth>
        }
      />
      <Route
        path="/blogs/:id"
        element={
          <RequireAuth>
            <BlogDetails />
          </RequireAuth>
        }
      />
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

      {/* Create new blog */}
      <Route
        path="/create"
        element={
          <RequireAuth>
            <BlogForm />
          </RequireAuth>
        }
      />

      {/* Blog Wizard / Stepwise Generator */}
      <Route
        path="/generate"
        element={
          <RequireAuth>
            <BlogWizard />
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

      {/* Catch-all route */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated() ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
