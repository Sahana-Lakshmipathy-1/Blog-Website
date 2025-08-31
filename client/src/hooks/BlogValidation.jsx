import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:2500/api";

const useBlogFormState = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    badge: "New Article",
    img_file: null, // for file upload
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
    // console.log("===== SUBMIT LOG =====");
    // console.log("Submit type:", type, "ID:", id);

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("authToken");
      const username = localStorage.getItem("username");
      if (!token || !username) throw new Error("Not authenticated or username missing");

      if (!["create", "update"].includes(type)) {
        throw new Error(`Invalid submit type: ${type}`);
      }

      const url = type === "update" && id
        ? `${API_BASE_URL}/blogs/${id}/edit`
        : `${API_BASE_URL}/blogs`;
      const method = type === "update" ? "PUT" : "POST";

      // Create FormData for file upload
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("subtitle", formData.subtitle?.trim() || "");
      payload.append("content", formData.content.trim());
      payload.append("badge", formData.badge?.trim() || "New Article");
      payload.append("username", username);
      if (formData.img_file) payload.append("file", formData.img_file);
      if (type === "create") payload.append("created_at", new Date().toISOString());

      // console.log("Method:", method);
      // console.log("URL:", url);
      // console.log("Payload FormData:", formData);
      // console.log("=======================");

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`, // don't set Content-Type manually
        },
        body: payload,
      });

      const result = await response.json();

      // console.log("===== RESPONSE LOG =====");
      // console.log("Status:", response.status);
      // console.log("Body:", result);
      // console.log("=======================");

      if (!response.ok) {
        throw new Error(result.detail || `Failed to ${type} blog`);
      }

      setSuccess(`Blog ${type === "update" ? "updated" : "created"} successfully!`);

      const blogId = type === "create" ? result.id : id;
      setTimeout(() => {
        resetForm();
        navigate(`/blogs/${blogId}`);
      }, 1500);

    } catch (err) {
      // console.error("Submit error:", err);
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
