import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const useBlogChanges = (id) => {
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:2500/api/blogs";

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------- Fetch blog for prepopulate ----------------
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("accessToken");
        if (!token) throw new Error("Authentication token missing");

        const res = await fetch(`${BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error("Blog not found");
          throw new Error("Failed to fetch blog");
        }

        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(err.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // ---------------- Delete blog ----------------
  const handleDelete = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No auth token found");

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete blog");
      }

      navigate("/blogs");
    } catch (err) {
      console.error("Delete failed:", err.message);
      setError(err.message);
    }
  };

  // ---------------- Update blog ----------------
  const handleUpdate = async (updatedData) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No auth token found");

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update blog");
      }

      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error("Update failed:", err.message);
      setError(err.message);
    }
  };

  // ---------------- Navigate back ----------------
  const handleBack = () => {
    navigate("/blogs");
  };

  return { blog, loading, error, handleDelete, handleUpdate, handleBack };
};
