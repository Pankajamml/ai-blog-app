import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const COLORS = ["#00D4FF", "#A855F7", "#10B981", "#F59E0B", "#EF4444"];

export default function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/analytics`);
      const data     = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-12">
        Loading analytics...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-red-400 py-12">
        Failed to load analytics
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-900 to-cyan-800 border border-cyan-700 rounded-xl p-5">
          <div className="text-cyan-300 text-xs uppercase tracking-widest mb-1">
            Total Blogs
          </div>
          <div className="text-white text-3xl font-bold">
            {stats.total}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-green-800 border border-green-700 rounded-xl p-5">
          <div className="text-green-300 text-xs uppercase tracking-widest mb-1">
            Published
          </div>
          <div className="text-white text-3xl font-bold">
            {stats.published}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-900 to-amber-800 border border-amber-700 rounded-xl p-5">
          <div className="text-amber-300 text-xs uppercase tracking-widest mb-1">
            Drafts
          </div>
          <div className="text-white text-3xl font-bold">
            {stats.drafts}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">

        {/* By Platform */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
            Blogs by Platform
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.byPlatform}
                dataKey="count"
                nameKey="platform"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {stats.byPlatform.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* By Tone */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">
            Blogs by Tone
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.byTone}>
              <XAxis dataKey="tone" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#A855F7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Line Chart */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <div className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
          Activity (Last 7 Days)
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats.perDay}>
            <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
            <YAxis stroke="#64748B" fontSize={11} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: "#10B981", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
          Recent Blogs
        </div>
        <div className="space-y-2">
          {stats.recent.map((blog) => (
            <div
              key={blog.id}
              className="flex items-center justify-between bg-gray-900 rounded-lg p-3"
            >
              <div className="text-white text-sm font-medium truncate flex-1">
                {blog.topic}
              </div>
              <div className="flex items-center gap-2 ml-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  blog.status === "published"
                    ? "bg-green-900 text-green-300"
                    : "bg-amber-900 text-amber-300"
                }`}>
                  {blog.status}
                </span>
                <span className="text-gray-500 text-xs">
                  {blog.platform}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}