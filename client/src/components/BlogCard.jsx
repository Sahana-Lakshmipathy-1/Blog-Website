import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { Badge } from "@/components/ui/badge"

const BlogCard = ({ blog }) => {
  const badgeColor = blog.badge === 'Trending'
    ? 'bg-black text-white border-white'
    : blog.badge === 'New Article'
    ? 'bg-blue-100 text-blue-800 border-blue-300'
    : 'bg-gray-200 text-gray-800 border-gray-300';

  return (
    <div className="grid-3col-3 relative">
      <Card className="h-full flex flex-col justify-between relative">
        <div className="p-4">
          {blog.badge && (
            <div className="absolute top-4 right-4">
              <Badge
                variant="default"
                className={`text-[10px] uppercase tracking-wider border px-2 py-1 rounded-md shadow-sm ${badgeColor}`}
              >
                {blog.badge}
              </Badge>
            </div>
          )}

          <CardHeader>
            <CardTitle>{blog.title}</CardTitle>
            <CardDescription>{blog.subtitle}</CardDescription>
          </CardHeader>

          <CardContent>
            <p>{blog.content}</p>
          </CardContent>
        </div>

        <CardFooter className="flex flex-col items-start gap-2 px-6 pb-4">
          <p className="text-sm text-gray-500">
            Published on {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <Button asChild className="w-fit px-4 py-2 text-sm">
            <Link to={`/blog/${blog.id}`}>Read More</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default BlogCard
