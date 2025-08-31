import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import useBlogWizard from "@/hooks/BlogGeneration";

const BlogWizard = ({ username }) => {
  const {
    topic,
    setTopic,
    category,
    setCategory,
    tone,
    setTone,
    loading,
    blog,
    error,
    handleGenerate,
    handlePublish,
  } = useBlogWizard(username);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">✨ Blog Generator</h1>
      <p className="text-gray-500 mb-6">
        Let AI help you write your next blog post.
      </p>

      {/* Input fields */}
      <div className="space-y-4">
        <input
          type="text"
          className="w-full p-3 border rounded-xl shadow-sm focus:ring focus:outline-none focus:ring-blue-500"
          placeholder="Enter a topic (e.g., Remote Work)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-3 border rounded-xl shadow-sm focus:ring focus:outline-none focus:ring-blue-500"
          placeholder="Enter a category (e.g., Technology, Lifestyle)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-3 border rounded-xl shadow-sm focus:ring focus:outline-none focus:ring-blue-500"
          placeholder="Enter a tone (e.g., Professional, Casual, Persuasive)"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        />
      </div>

      <Button
        className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
        onClick={handleGenerate}
        disabled={loading || !topic || !category || !tone}
      >
        {loading ? "Generating..." : "Generate Blog"}
      </Button>

      {/* Error */}
      {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}

      {/* Blog Preview */}
      {blog && (
        <Card className="mt-6 rounded-xl shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
            <p className="text-gray-600 italic mb-4">{blog.subtitle}</p>

            <div className="prose max-w-none text-gray-800 leading-relaxed">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>

            <Button
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md"
              onClick={handlePublish}
            >
              🚀 Publish Blog
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogWizard;
