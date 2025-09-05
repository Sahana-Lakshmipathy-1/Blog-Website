import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const useBlogChanges = (id) => {
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:2500/api/blogs";

  /**
   * Deletes a blog post and navigates back to the blog list.
   */
  const handleDelete = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.warn("No auth token found. Please log in.");
        return;
      }

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete blog.");
      }

      console.log("Blog deleted successfully!");
      navigate("/blogs");
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  /**
   * Updates a blog post with new data.
   */
  const handleUpdate = async (updatedData) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.warn("No auth token found. Please log in.");
        return;
      }

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update blog.");
      }

      console.log("Blog updated successfully!");
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  /**
   * Navigates back to the blog list.
   */
  const handleBack = () => {
    navigate("/blogs");
  };

  return { handleDelete, handleUpdate, handleBack };
};
