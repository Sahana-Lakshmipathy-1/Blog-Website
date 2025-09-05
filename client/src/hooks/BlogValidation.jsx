import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:2500/api";

const useBlogFormState = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    badge: "New Article",
    img_file: null, // file upload
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      content: "",
      badge: "New Article",
      img_file: null,
    });
  };

  const handleSubmit = async (type, id = null) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = Cookies.get("accessToken");
      const username = Cookies.get("username");

      if (!token || !username) {
        // clear cookies if session invalid
        Cookies.remove("accessToken");
        Cookies.remove("username");
        navigate("/login");
        throw new Error("Not authenticated. Please log in again.");
      }

      if (!["create", "update"].includes(type)) {
        throw new Error(`Invalid submit type: ${type}`);
      }

      const url =
        type === "update" && id
          ? `${API_BASE_URL}/blogs/${id}/edit`
          : `${API_BASE_URL}/blogs`;
      const method = type === "update" ? "PUT" : "POST";

      // Build FormData payload
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("subtitle", formData.subtitle?.trim() || "");
      payload.append("content", formData.content.trim());
      payload.append("badge", formData.badge?.trim() || "New Article");
      payload.append("username", username);
      if (formData.img_file) payload.append("file", formData.img_file);
      if (type === "create")
        payload.append("created_at", new Date().toISOString());

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`, // ✅ don't set Content-Type manually
        },
        body: payload,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ Blog submit error:", result);
        throw new Error(result.detail || `Failed to ${type} blog`);
      }

      setSuccess(
        `✅ Blog ${type === "update" ? "updated" : "created"} successfully!`
      );

      const blogId = type === "create" ? result.id : id;
      setTimeout(() => {
        resetForm();
        navigate(`/blogs/${blogId}`);
      }, 1500);
    } catch (err) {
      console.error("❌ handleSubmit error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    success,
    handleSubmit,
  };
};

export default useBlogFormState;
