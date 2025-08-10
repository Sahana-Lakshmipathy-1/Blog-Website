import React from 'react';
import { useNavigate } from 'react-router-dom';
import useBlogFormState from '../hooks/BlogValidation';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const BlogForm = () => {
  const navigate = useNavigate();
  const { formData, setFormData, loading, error, success, handleSubmit } = useBlogFormState();

  const onChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Write Your Own Blog</CardTitle>
          <CardDescription>Get your ideas up and running...</CardDescription>
        </CardHeader>

        <form onSubmit={(e) => handleSubmit(e, navigate)}>
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
                onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
              />
            </div>
            
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Saving...' : 'Submit'}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="text-sm text-muted-foreground">
          <p>Click the button to see the preview.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogForm;
