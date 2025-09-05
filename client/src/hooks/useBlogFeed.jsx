import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const API_BASE_URL = "http://127.0.0.1:2500/api";

const useBlogFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ Read token + username from cookies
        const token = Cookies.get("accessToken");
        const username = Cookies.get("username");

        if (!token) {
          setError("Authentication token missing. Please log in.");
          setBlogs([]); // clear blogs when not authenticated
          setLoading(false);
          return;
        }

        let url = `${API_BASE_URL}/blogs/`;
        if (location.pathname.startsWith("/userblogs")) {
          if (!username) {
            throw new Error("Username missing in cookies.");
          }
          url = `${API_BASE_URL}/blogs/user/${username}`;
        }

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.redirected) {
          console.warn("API redirected to:", response.url);
          throw new Error("Server redirected the request (likely due to auth).");
        }

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Failed to fetch blogs. Status: ${response.status}, Body: ${text}`
          );
        }

        const data = await response.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message || "Failed to load blogs. Please try again later.");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [location.pathname]);

  return { blogs, loading, error };
};

export default useBlogFeed;
