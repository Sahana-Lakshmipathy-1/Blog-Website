import React from 'react';
import BlogCard from '@/components/BlogCard';
import useBlogFeed from '@/hooks/useBlogFeed';

const BlogLayout = () => {
  const { visibleBlogs, loading, error } = useBlogFeed();

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 animate-pulse">
        Loading blogs...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        Error loading blogs: {error}
      </p>
    );
  }

  if (visibleBlogs.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-700">
        No blogs found.
      </p>
    );
  }

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Blog Feed</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </main>
  );
};

export default BlogLayout;
