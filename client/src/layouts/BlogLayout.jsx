import React from 'react';
import BlogCard from '@/components/BlogCard';
import blogs from "../data/blog.json";

const BlogLayout = () => {
  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Blog Feed</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...blogs]
          .sort((a, b) => b.trending - a.trending)
          .map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
      </div>
    </main>
  );
};

export default BlogLayout;
