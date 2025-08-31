import { useNavigate } from "react-router-dom";

export const useBlogChanges = (id) => {
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:2500/api/blogs";

  /**
   * Deletes a blog post and navigates back to the blog list.
   * @param {string} id - The ID of the blog to delete.
   */
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // console.error("No auth token found. You must be logged in to delete a blog.");
        return;
      }

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete blog.");
      }

      // console.log("Blog deleted successfully!");
      navigate("/blogs");
    } catch (err) {
      // console.error(err);
      // console.error(err.message);
    }
  };

  /**
   * Updates a blog post with new data.
   * @param {object} updatedData - The new data for the blog post (e.g., { title, subtitle, content }).
   */
  const handleUpdate = async (updatedData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // console.error("No auth token found. You must be logged in to update a blog.");
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
        const error = await response.json();
        throw new Error(error.message || "Failed to update blog.");
      }

      // console.log("Blog updated successfully!");
      navigate(`/blogs/${id}`);
    } catch (err) {
      // console.error(err);
      // console.error(err.message);
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
