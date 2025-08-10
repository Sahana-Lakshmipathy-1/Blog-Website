import { useEffect, useState } from 'react';

const useBlogFeed = () => {
  const [visibleBlogs, setVisibleBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Start loading true
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication token missing');

        const response = await fetch('http://127.0.0.1:2500/api/blogs/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.statusText}`);
        }

        const data = await response.json();

        // Optional: simulate delay for UX
        setTimeout(() => {
          setVisibleBlogs(data);
          setLoading(false);
        }, 2000); // 1-second fake loading delay
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return {
    visibleBlogs,
    loading,
    error,
  };
};

export default useBlogFeed;
