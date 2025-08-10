import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BlogDetails = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('You must be logged in to view this blog.');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://127.0.0.1:2500/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Blog not found.');
          } else {
            setError('Failed to load blog.');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

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
