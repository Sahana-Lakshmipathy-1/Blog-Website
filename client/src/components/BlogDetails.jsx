import React from 'react';
import { useParams } from 'react-router-dom';
import blogs from '../data/blog.json'; // Static blogs

const BlogDetails = () => {
  const { id } = useParams(); // ID from URL (string)

  // Fetch stored blogs from localStorage
  const storedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];

  // Merge static stored blogs to render
  const allBlogs = [...blogs, ...storedBlogs];

  // Find blog by ID (ensure string comparison) from the array to render
  const blog = allBlogs.find((b) => String(b.id) === id);

  if (!blog) {
    return (
      <div className="text-center text-red-500 mt-10 text-lg font-medium">
        Blog not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
      <h2 className="text-xl text-gray-600 mb-4">{blog.subtitle}</h2>
      <p className="text-sm text-gray-400 mb-6">
        Published on {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <p className="text-lg leading-relaxed whitespace-pre-line">{blog.content}</p>
    </div>
  );
};

export default BlogDetails;
