import React, { useEffect, useState } from 'react';
import BlogCard from '@/components/BlogCard';
import blogs from '../data/blog.json';

const BlogLayout = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadCount, setLoadCount] = useState(6); // How many blogs to load each time

  useEffect(() => {
    const storedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const combined = [...blogs, ...storedBlogs];

    // Sort priority: trending (0), normal (1), new (2)
    combined.sort((a, b) => {
      const priority = (blog) => blog.badge === 'Trending' ? 0 : blog.badge === 'New Article' ? 2 : 1;
      return priority(a) - priority(b);
    });

    setAllBlogs(combined);
    setVisibleBlogs(combined.slice(0, loadCount));
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        hasMore
      ) {
        loadMoreBlogs();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleBlogs, hasMore]);

  const loadMoreBlogs = () => {
    const nextBlogs = allBlogs.slice(visibleBlogs.length, visibleBlogs.length + loadCount);

    setVisibleBlogs((prev) => [...prev, ...nextBlogs]);
    if (visibleBlogs.length + nextBlogs.length >= allBlogs.length) {
      setHasMore(false);
    }
  };

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Blog Feed</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {hasMore && (
        <p className="text-center mt-6 text-gray-500 animate-pulse">Loading more blogs...</p>
      )}
    </main>
  );
};

export default BlogLayout;
