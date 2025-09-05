import { useState } from "react";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:2500/api";

const useBlogWizard = () => {
  // Wizard inputs
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");

  // Backend interaction state
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  /* -------------------------
   * Generate draft blog from AI
   * ------------------------- */
  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setBlog(null);

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Authentication token not found.");

      const res = await fetch(`${API_BASE_URL}/generate/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic, category, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate blog draft.");
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      // Extract structure: [title, subtitle, ...content]
      const [title, subtitle, ...contentLines] = data.content
        .split("\n")
        .filter((line) => line.trim());

      setBlog({
        title: title?.trim() || "Untitled Blog Post",
        subtitle: subtitle?.trim() || null,
        content: contentLines.join("\n").trim() || data.content,
      });
    } catch (err) {
      console.error("❌ handleGenerate error:", err);
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
   * Publish final blog
   * ------------------------- */
  const handlePublish = async () => {
    if (!blog) {
      setError("No blog draft available to publish.");
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      const username = Cookies.get("username");
      if (!token) throw new Error("Authentication token not found.");
      if (!username) throw new Error("Username not found in cookies.");

      // Pure JSON payload
      const body = JSON.stringify({
        title: blog.title?.trim() || "Untitled Blog",
        subtitle: blog.subtitle?.trim() || null,
        content: blog.content?.trim() || "",
        username: username.trim(),
        badge: "New Article",
        img_url: blog.img_url || null,
      });

      const res = await fetch(`${API_BASE_URL}/blogs/json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("❌ Server validation error:", result);
        throw new Error(result.detail || "Failed to publish blog.");
      }

      alert(`✅ Blog "${result.title}" published 🚀`);
    } catch (err) {
      console.error("❌ handlePublish error:", err);
      setError(err.message || "Failed to publish blog.");
    }
  };

  return {
    topic,
    setTopic,
    category,
    setCategory,
    tone,
    setTone,
    loading,
    blog,
    error,
    handleGenerate,
    handlePublish,
  };
};

export default useBlogWizard;
