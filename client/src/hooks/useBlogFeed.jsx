import { useEffect, useState } from 'react';
import blogs from '../data/blog.json';
import useInfiniteScroll from './ScrollHooks';

const useBlogFeed = () => {

  const [allBlogs, setAllBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadCount] = useState(6);

  useEffect(() => {
    // 1. Fetch blogs stored in localStorage (i.e., submitted by user)
    const storedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];

    // 2. Combine static blogs (from blog.json) and stored blogs
    const combined = [...blogs, ...storedBlogs];

    // 3. Sort combined blogs based on a priority:
    //    - "Trending" gets top priority → 0
    //    - Remaining normal blogs → 1
    //    - "New Article" → lowest priority → 2
    combined.sort((a, b) => {
      const priority = (blog) =>
        blog.badge === 'Trending' ? 0 : blog.badge === 'New Article' ? 2 : 1;

      return priority(a) - priority(b); // Lower number = higher priority
    });

    // 4. Save the sorted list in state
    setAllBlogs(combined);

    // 5. Show the initial slice of blogs (e.g., first 6 blogs)
    setVisibleBlogs(combined.slice(0, loadCount));
  }, [loadCount]); // Dependency: will only re-run if loadCount changes

  // 2️ Function: loadMoreBlogs
  // Loads the next set of blogs when user scrolls
  const loadMoreBlogs = () => {
    // 1. Calculate next batch of blogs to show (slice range)
    const nextBlogs = allBlogs.slice(
      visibleBlogs.length,
      visibleBlogs.length + loadCount
    );

    // 2. Add new blogs to the existing visible list
    setVisibleBlogs((prev) => [...prev, ...nextBlogs]);

    // 3. If we've reached or exceeded total blog count, disable further loading
    if (visibleBlogs.length + nextBlogs.length >= allBlogs.length) {
      setHasMore(false); // Prevent further scroll-based loading
    }
  };

 
  // 3️ Hook: useInfiniteScroll
  // Automatically call `loadMoreBlogs()` when user scrolls near bottom
  useInfiniteScroll(
    loadMoreBlogs, // The function to run when scrolled down
    hasMore,       // Only run if there are more blogs to load
    [visibleBlogs] // Re-register scroll logic if visibleBlogs changes
  );

  // 4️ Return the stateful data to components
  return {
    visibleBlogs, // The list of currently visible blogs
    hasMore       // Whether more blogs are available to scroll-load
  };
};

export default useBlogFeed;
