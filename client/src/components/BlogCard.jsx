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

dayjs.extend(relativeTime);


const BlogCard = ({ blog }) => {
  const badgeColor = blog.badge === 'Trending'
    ? 'bg-black text-white border-white'
    : blog.badge === 'New Article'
    ? 'bg-blue-100 text-blue-800 border-blue-300'
    : 'bg-gray-200 text-gray-800 border-gray-300';

  return (
    <div className="grid-3col-3 relative m-1">
      <Card className="h-full flex flex-col justify-between relative">
        <div className="p-2">
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
            <CardTitle className="text-lg mt-4.5">{blog.title}</CardTitle>
            <CardDescription className="mt-1 ">{blog.subtitle}</CardDescription>
          </CardHeader>

          <CardContent className="mt-2 ml-0.5">
            <p>{blog.content.slice(0, 100)}...</p>
          </CardContent>
        </div>

        <CardFooter className="flex flex-col items-start gap-2 px-6 pb-4">
          <p className="text-sm text-gray-400 mb-6">
            Published on {dayjs(blog.created_at).format("DD MMM YYYY, h:mm A")}
            {" • "}
            {dayjs(blog.created_at).fromNow()}
          </p>
          <p className="text-sm text-gray-400 mb-6">Published By {blog.username}</p>
          <Button asChild className="w-fit px-4 py-2 text-sm">
            <Link to={`/blogs/${blog.id}`}>Read More</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default BlogCard
