import React, { useEffect, useState } from 'react';
import BlogCard from '@/components/BlogCard';
import blogs from '../data/blog.json';

const BlogLayout = () => {
  const [allBlogs, setAllBlogs] = useState([]);

  useEffect(() => {
    const userBlogs = JSON.parse(localStorage.getItem('blogs')) || [];

    const combined = [...blogs, ...userBlogs];

    // Sorting logic: Trending first, then Default, then New
    combined.sort((a, b) => {
      const getPriority = (blog) => {
        if (blog.badge === 'Trending') return 0;
        if (blog.badge === 'New Article') return 2;
        return 1;
      };
      return getPriority(a) - getPriority(b);
    });

    setAllBlogs(combined);
  }, []);

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Blog Feed</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </main>
  );
};

export default BlogLayout;
