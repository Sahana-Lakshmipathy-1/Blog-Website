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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReactMarkdown from "react-markdown";

dayjs.extend(relativeTime);

const BlogCard = ({ blog }) => {
  const badgeColor =
    blog.badge === 'Trending'
      ? 'bg-black text-white border-white'
      : blog.badge === 'New Article'
      ? 'bg-blue-100 text-blue-800 border-blue-300'
      : 'bg-gray-200 text-gray-800 border-gray-300';

  return (
    <div className="grid-3col-3 relative m-1">
      <Card className="h-full flex flex-col justify-between relative overflow-hidden">
        
        {/* ✅ Image section (use img_url instead of image) */}
        {blog.img_url && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={blog.img_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-2 flex-1">
          {/* ✅ Badge */}
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

          {/* ✅ Title + Subtitle */}
          <CardHeader>
            <CardTitle className="text-lg mt-2">
              <ReactMarkdown>{blog.title}</ReactMarkdown>
            </CardTitle>
            {blog.subtitle && (
              <CardDescription className="mt-1">
                <ReactMarkdown>{blog.subtitle?.slice(0, 100) + "..."}</ReactMarkdown>
              </CardDescription>
            )}
          </CardHeader>

          {/* ✅ Short Content */}
          <CardContent className="mt-2 ml-0.5">
            <ReactMarkdown>
              {blog.content?.slice(0, 100) + "..."}
            </ReactMarkdown>
          </CardContent>
        </div>

        {/* ✅ Footer */}
        <CardFooter className="flex flex-col items-start gap-2 px-6 pb-4">
          <p className="text-sm text-gray-400">
            Published on {dayjs(blog.created_at).format("DD MMM YYYY, h:mm A")}
            {" • "}
            {dayjs(blog.created_at).fromNow()}
          </p>
          <p className="text-sm text-gray-400">
            Published By {blog.username}
          </p>
          <Button asChild className="w-fit px-4 py-2 text-sm mt-2">
            <Link to={`/blogs/${blog.id}`}>Read More</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default BlogCard
