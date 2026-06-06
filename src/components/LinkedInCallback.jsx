import { useEffect, useState, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function LinkedInCallback() {
  const [status, setStatus] = useState("Connecting to LinkedIn...");
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const params = new URLSearchParams(window.location.search);
    const code   = params.get("code");

    if (code) {
      exchangeToken(code);
    } else {
      setStatus("❌ No code found");
    }
  }, []);

  const exchangeToken = async (code) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/linkedin/exchange`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code }),
      });

      const data = await response.json();
      console.log("Token Exchange:", data);

      if (data.status === "success") {
        localStorage.setItem("linkedin_token", data.token);
        localStorage.setItem("linkedin_name",  data.name);
        setStatus(`✅ Connected as ${data.name}! Redirecting...`);
        setTimeout(() => { window.location.href = "/"; }, 1500);
      } else {
        setStatus(`❌ ${data.message}`);
      }
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="bg-gray-800 border border-blue-500 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">💼</div>
        <div className="text-blue-400 font-bold mb-2">LinkedIn OAuth</div>
        <div className="text-gray-300 text-sm">{status}</div>
      </div>
    </div>
  );
}