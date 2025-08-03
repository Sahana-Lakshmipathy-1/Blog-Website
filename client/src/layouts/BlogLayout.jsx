// 📁 src/pages/BlogLayout.jsx

import React from 'react';
import BlogCard from '@/components/BlogCard';
import useBlogFeed from '@/hooks/useBlogFeed';

const BlogLayout = () => {
  const { visibleBlogs, hasMore } = useBlogFeed(); // 👈 Custom hook

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Blog Feed</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {hasMore && (
        <p className="text-center mt-6 text-gray-500 animate-pulse">
          Loading more blogs...
        </p>
      )}
    </main>
  );
};

export default BlogLayout;
