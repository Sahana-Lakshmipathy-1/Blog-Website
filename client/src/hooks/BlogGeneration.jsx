import { useState } from "react";

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

  // -------------------------
  // Generate draft blog from AI
  // -------------------------
  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setBlog(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const res = await fetch(`${API_BASE_URL}/generate/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic, category, tone }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Request failed");
      }

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        // Split out title, subtitle, and content from AI text
        const [title, subtitle, ...contentLines] = data.content
          .split("\n")
          .filter((line) => line.trim());

        const content = contentLines.join("\n").trim();

        setBlog({
          title: title?.trim() || "Untitled Blog Post",
          subtitle: subtitle?.trim() || null,
          content: content || data.content,
        });
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Publish final blog
  // -------------------------
 // Publish final blog (JSON only)
const handlePublish = async () => {
  if (!blog) {
    setError("No blog draft available to publish.");
    return;
  }

  try {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");
    if (!token) throw new Error("Authentication token not found.");
    if (!username) throw new Error("Username not found in localStorage.");

    // 🟢 Pure JSON payload
    const body = JSON.stringify({
      title: blog.title?.trim() || "Untitled Blog",
      subtitle: blog.subtitle?.trim() || null,
      content: blog.content?.trim() || "",
      username: username.trim(),
      badge: "New Article",
      img_url: blog.img_url || null, // must be a string URL
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
      throw new Error(result.detail || "Failed to publish blog");
    }

    alert(`Blog "${result.title}" published 🚀`);
  } catch (err) {
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
