import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useBlogFormState from "../hooks/BlogValidation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const BlogForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // The custom hook now handles navigation internally
  const { formData, setFormData, loading, error, success, handleSubmit } =
    useBlogFormState();

  // Fetch blog when editing
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found.");
          return;
        }

        const response = await fetch(`http://127.0.0.1:2500/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }

        const data = await response.json();

        // ✅ Safely update formData
        setFormData({
          title: data?.title || "",
          subtitle: data?.subtitle || "",
          content: data?.content || "",
        });
      } catch (err) {
        console.error("Error fetching blog:", err.message);
      }
    };

    fetchBlog();
  }, [isEdit, id]); // No need to include setFormData in the dependency array

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(isEdit ? "update" : "create", isEdit ? id : null);
  };

  // Button text
  const buttonText = loading
    ? isEdit
      ? "Updating..."
      : "Saving..."
    : isEdit
      ? "Update Blog"
      : "Submit";

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-xl rounded-3xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-extrabold text-gray-900">
            {isEdit ? "Update Blog" : "Write Your Own Blog"}
          </CardTitle>
          <CardDescription className="text-gray-500 mt-1">
            {isEdit
              ? "Make changes to your blog before publishing."
              : "Share your ideas with the world. Start writing your blog below."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {error && <p className="text-red-600 font-medium">{error}</p>}
            {success && <p className="text-green-600 font-medium">{success}</p>}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-semibold">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Give a catchy title"
                value={formData.title}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-gray-700 font-semibold">
                Subtitle
              </Label>
              <Input
                id="subtitle"
                name="subtitle"
                type="text"
                placeholder="Add a brief subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-700 font-semibold">
                Content
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your blog here..."
                value={formData.content}
                onChange={handleChange}
                required
                className="min-h-[200px] border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6 py-3 bg-black text-white font-semibold rounded-xl shadow-lg hover:bg-gray-800 hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {buttonText}
            </Button>

            {/* AI Generation Button */}
            <Button
              type="button"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
              onClick={() => handleClick('/generate')}
            >
              Generate with AI
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-gray-500 mt-4">
          {isEdit
            ? "Review your changes before saving."
            : "Click submit to publish your blog."}
        </CardFooter>
      </Card>
    </div>

  );
};

export default BlogForm;
