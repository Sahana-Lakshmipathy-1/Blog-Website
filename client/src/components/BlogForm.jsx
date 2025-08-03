import React from 'react';
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const BlogForm = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Write Your Own Blog</CardTitle>
          <CardDescription>Get your ideas up and running...</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Give a title for your blog"
              className="transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              type="text"
              placeholder="Give a suitable subtitle"
              className="transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your blog here..."
              className="min-h-[180px] rounded-xl border border-gray-300 bg-white shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
            />
          </div>

          <Button className="w-full mt-4">Submit</Button>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground">
          <p>Card Footer: Date/Time Published</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogForm;
