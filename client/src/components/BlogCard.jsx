import React from 'react'
import {Card, CardContent, CardDescription, CardFooter, CardHeader,CardTitle} from '@/components/ui/card'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { Badge } from "@/components/ui/badge"

const BlogCard = ({ blog }) => {
    return (
        <div className="grid-3col-3">
            <Card className="h-full flex flex-col justify-between relative m-1">
                <div>
                    {blog.trending === true ? 
                    (<Badge variant="secondary" className="text-xs absolute top-4 right-4 tracking-wider border bg-neutral-200 px-2 py-1 rounded-xl shadow-sm">Trending</Badge>):
                    ""}
                    
                    <CardHeader className="m-3 p-3">
                        <CardTitle>{blog.title}</CardTitle>
                        <CardDescription>{blog.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent className="m-3 p-3">
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
