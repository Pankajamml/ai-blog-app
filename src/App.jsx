import { useState } from "react";
import BlogEditor from "./components/BlogEditor";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function App() {
  const [topic, setTopic]       = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [tone, setTone]         = useState("professional");
  const [content, setContent]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [blogId, setBlogId]     = useState(null);
  const [blogs, setBlogs]       = useState([]);
  const [copied, setCopied]     = useState(false);
  const [image, setImage]       = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [scheduledAt, setScheduledAt] = useState("");

  const generateBlog = async () => {
    if (!topic) return;
    setLoading(true);
    setContent("");
    setError("");

    try {
    const response = await fetch(`${API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        platform,
        tone,
        image_url: imageUrl || null,  // ← Add this line
        scheduled_at: scheduledAt || null,  // ← Add this line
      }),
    });

      const data = await response.json();

      if (data.status === "success") {
        setContent(data.content);
        setBlogId(data.blog_id);
      } else {
        setError(data.message || "Something went wrong!");
      }

    } catch (err) {
      setError(`Error: ${err.message}`);
    }

    setLoading(false);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_URL}/api/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        setImageUrl(data.url);
      } else {
        setError(data.message || "Image upload failed!");
      }

    } catch (err) {
      setError(`Upload Error: ${err.message}`);
    }

    setUploading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      uploadImage(file);
    }
  };

  const fetchBlogs = async () => {
    const response = await fetch(`${API_URL}/api/blogs`);
    const data     = await response.json();
    setBlogs(data);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">
          AI Blog Generator
        </h1>
        <p className="text-gray-400 text-sm">
          React → Laravel → Groq AI → MySQL → S3
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">

        {/* Topic Input */}
        <input
          type="text"
          placeholder="e.g. Why every developer should learn AWS"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateBlog()}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />

        {/* Platform + Tone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block uppercase tracking-widest">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="linkedin">LinkedIn</option>
              <option value="medium">Medium</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block uppercase tracking-widest">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="technical">Technical</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <label className="text-gray-400 text-xs mb-3 block uppercase tracking-widest">
            Blog Cover Image (Optional)
          </label>

          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition">
              {uploading ? "Uploading..." : "📷 Choose Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {image && !uploading && (
              <span className="text-green-400 text-sm">
                ✅ {image.name}
              </span>
            )}

            {uploading && (
              <span className="text-yellow-400 text-sm">
                ⏳ Uploading to S3...
              </span>
            )}
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="mt-3">
              <img
                src={imageUrl}
                alt="Blog cover"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-gray-500 text-xs mt-1">
                ✅ Uploaded to S3: {imageUrl.substring(0, 50)}...
              </p>
            </div>
          )}
        </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <label className="text-gray-400 text-xs mb-3 block uppercase tracking-widest">
              Schedule Publish Date
            </label>

            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />

            {scheduledAt && (
              <p className="text-green-400 text-xs mt-2">
                📅 Scheduled for: {scheduledAt}
              </p>
            )}
          </div>

        {/* Generate Button */}
        <button
          onClick={generateBlog}
          disabled={loading || !topic}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? "✍️ Generating..." : "Generate Blog ✨"}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-500 rounded-xl p-4 text-red-300 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Editor */}
        {content && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                ✅ Generated Blog — Edit Below
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded-lg transition"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>

            <BlogEditor
              content={content}
              onChange={setContent}
            />

            {blogId && (
              <div className="text-gray-500 text-xs text-right">
                Blog ID: #{blogId} — Saved ✅
              </div>
            )}
          </div>
        )}

        {/* Saved Blogs */}
        <button
          onClick={fetchBlogs}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition border border-gray-700"
        >
          📋 View Saved Blogs
        </button>

        {blogs.length > 0 && (
          <div className="space-y-3">
            <div className="text-purple-400 text-xs font-bold uppercase tracking-widest">
              Saved Blogs ({blogs.length})
            </div>
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 cursor-pointer hover:border-cyan-700 transition"
                onClick={() => setContent(blog.content)}
              >
                {blog.image_url && (
                  <img
                    src={blog.image_url}
                    alt={blog.topic}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="text-cyan-400 font-bold text-sm">
                  {blog.topic}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {blog.platform} · {blog.tone} · {blog.created_at}
                </div>
                
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}