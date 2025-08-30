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

const BlogForm = ({ isEdit = false }) => {
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {isEdit ? "Update Blog" : "Write Your Own Blog"}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? "Make changes to your blog..."
              : "Get your ideas up and running..."}
          </CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-6">
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Give a title for your blog"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                type="text"
                placeholder="Give a suitable subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your blog here..."
                className="min-h-[180px]"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {buttonText}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="text-sm text-muted-foreground">
          <p>
            {isEdit
              ? "Review your changes before saving."
              : "Click submit to publish your blog."}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogForm;
