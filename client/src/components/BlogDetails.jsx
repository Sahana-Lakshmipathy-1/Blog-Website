import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useBlogChanges } from "../hooks/BlogChanges";
import ReactMarkdown from "react-markdown";

dayjs.extend(relativeTime);

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleDelete, handleBack } = useBlogChanges(id);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current user info from localStorage
  const currentUser = localStorage.getItem("username");

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`http://127.0.0.1:2500/api/blogs/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Blog not found.");
          } else {
            setError("Failed to load blog.");
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!blog) return <div className="text-center mt-10">No blog found.</div>;

  const isOwner = currentUser === blog.username; // Only owner can modify

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-4xl font-bold mb-2 prose">
        <ReactMarkdown>{blog.title || ""}</ReactMarkdown>
      </div>

      <div className="text-xl text-gray-600 mb-4 prose">
        <ReactMarkdown>{blog.subtitle || ""}</ReactMarkdown>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Published on {dayjs(blog.created_at).format("DD MMM YYYY, h:mm A")} •{" "}
        {dayjs(blog.created_at).fromNow()}
      </p>

      <p className="text-sm text-gray-400 mb-6">Published by {blog.username}</p>

      <div className="prose prose-lg leading-relaxed text-gray-800">
        <ReactMarkdown>{blog.content || ""}</ReactMarkdown>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        {isOwner && (
          <>
            <button
              onClick={() => navigate(`/blogs/${id}/edit`)}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              Delete
            </button>
          </>
        )}
        <button
          onClick={handleBack}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
        >
          Back to Blogs
        </button>
      </div>
    </div>
  );
};

export default BlogDetails;
