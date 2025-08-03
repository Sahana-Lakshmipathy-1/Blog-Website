// src/pages/BlogDetails.jsx
import { useParams } from 'react-router-dom'
import blogs from '../data/blog.json'

const BlogDetails = () => {
  const { id } = useParams()
  const blog = blogs.find((b) => b.id.toString() === id)

  if (!blog) {
    return <div className="p-6 text-red-600">Blog not found.</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-lg text-gray-600 mb-4">{blog.subtitle}</p>
      <p className="text-sm text-gray-500 mb-8">
        Published on {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <div className="text-base leading-relaxed">{blog.content}</div>
    </div>
  )
}

export default BlogDetails
