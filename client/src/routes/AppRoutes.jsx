import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import BlogForm from "@/components/BlogForm";
import BlogLayout from "@/layouts/BlogLayout";
import BlogDetails from "@/components/BlogDetails";
import Newsletter from "@/pages/Newsletter";
import Home from "@/pages/Home";
import Support from "@/pages/Support";
import About from "@/pages/About";
import Login from "@/pages/Login";
import BlogWizard from "@/components/BlogWizard";

/* ------------------ Auth Check ------------------ */
// Returns true if token exists in cookies
const isAuthenticated = () => {
  const token = Cookies.get("accessToken");
  console.log("[Router] Checking auth → token:", token ? "FOUND" : "MISSING");
  return !!token;
};

/* ------------------ Route Guards ------------------ */
const RequireAuth = ({ children }) => {
  if (!isAuthenticated()) {
    console.log("[Router] Protected route → no token, redirecting to /login");
    return <Navigate to="/login" replace />;
  }
  console.log("[Router] Protected route → token found, rendering page");
  return <>{children}</>;
};

const RedirectIfAuth = ({ children }) => {
  if (isAuthenticated()) {
    console.log("[Router] Already logged in → redirecting to /");
    return <Navigate to="/" replace />;
  }
  console.log("[Router] Public route → not logged in, rendering page");
  return <>{children}</>;
};

/* ------------------ Routes ------------------ */
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
