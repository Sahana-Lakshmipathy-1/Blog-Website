import { useEffect, useState } from 'react';
import blogs from '../data/blog.json';
import useInfiniteScroll from './ScrollHooks'; 

const useBlogFeed = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadCount] = useState(6); // Fixed load count per scroll

  // Load blogs (static + user) and sort them
  useEffect(() => {
    const storedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const combined = [...blogs, ...storedBlogs];

    combined.sort((a, b) => {
      const priority = (blog) =>
        blog.badge === 'Trending' ? 0 : blog.badge === 'New Article' ? 2 : 1;
      return priority(a) - priority(b);
    });

    setAllBlogs(combined);
    setVisibleBlogs(combined.slice(0, loadCount));
  }, [loadCount]);

  // Load more blogs when scrolling to the bottom
  const loadMoreBlogs = () => {
    const nextBlogs = allBlogs.slice(visibleBlogs.length, visibleBlogs.length + loadCount);
    setVisibleBlogs((prev) => [...prev, ...nextBlogs]);

    if (visibleBlogs.length + nextBlogs.length >= allBlogs.length) {
      setHasMore(false);
    }
  };

  // Scroll-based auto loading
  useInfiniteScroll(loadMoreBlogs, hasMore, [visibleBlogs]);

  return {
    visibleBlogs,
    hasMore,
  };
};

export default useBlogFeed;