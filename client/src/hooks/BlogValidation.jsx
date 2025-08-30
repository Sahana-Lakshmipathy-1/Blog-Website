import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:2500/api";

const useBlogFormState = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    username: username,
    badge: "New Article", // Use a default value to satisfy the backend model.
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const resetForm = () => {
    setFormData({ title: "", subtitle: "", content: "", badge: "General" });
  };

  const handleSubmit = async (type, id = null) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");

      if (!["create", "update"].includes(type)) {
        throw new Error(`Invalid submit type: ${type}`);
      }

      let url = `${API_BASE_URL}/blogs`;
      let method = "POST";

      if (type === "update" && id) {
        url = `${API_BASE_URL}/blogs/${id}/edit`;
        method = "PUT";
      }

      // Add a console log to see exactly what you're sending
      console.log("Sending data to backend:", formData);
      console.log("URL:", url);
      console.log("Method:", method);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${type} blog`);
      }

      setSuccess(
        `Blog ${type === "update" ? "updated" : "created"} successfully!`
      );
      
      setTimeout(() => {
        resetForm();
        if (type === "create") {
          navigate("/blogs");
        } else if (type === "update" && id) {
          navigate(`/blogs/${id}`);
        }
      }, 2000);

    } catch (err) {
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
