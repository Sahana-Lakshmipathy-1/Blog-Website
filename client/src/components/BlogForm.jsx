import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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


const BlogForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { formData, setFormData, loading, error, success, handleSubmit } =
    useBlogFormState();

  // Fetch blog data if editing
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch(`http://127.0.0.1:2500/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch blog");

        const data = await response.json();

        setFormData({
          title: data?.title || "",
          subtitle: data?.subtitle || "",
          content: data?.content || "",
          badge: data?.badge || "New Article",
          img_file: null,          // new file state
          img_url: data?.img_url || "",
        });
      } catch (err) {
        console.error("Error fetching blog:", err.message);
      }
    };

    fetchBlog();
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img_file" && files.length > 0) {
      setFormData((prev) => ({ ...prev, img_file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(isEdit ? "update" : "create", isEdit ? id : null);
  };

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

            {/* Title */}
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
              />
            </div>

            {/* Subtitle */}
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
              />
            </div>

            {/* Content */}
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
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="img_file" className="text-gray-700 font-semibold">
                Cover Image (optional)
              </Label>
              <Input
                id="img_file"
                name="img_file"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
              {formData.img_file && (
                <p className="text-sm text-gray-500">
                  Selected file: {formData.img_file.name}
                </p>
              )}
              {!formData.img_file && formData.img_url && (
                <img
                  src={formData.img_url}
                  alt="Existing cover"
                  className="mt-2 max-h-48 rounded-lg"
                />
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-6 py-3" disabled={loading}>
              {buttonText}
            </Button>
          </form>
          <Button
              type="button"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
              onClick={() => handleClick('/generate')}
            >
              Generate with AI
            </Button>
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
