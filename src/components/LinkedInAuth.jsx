import { useState, useEffect } from "react";

const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
const REDIRECT_URI       = import.meta.env.VITE_LINKEDIN_REDIRECT_URI;
const API_URL            = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function LinkedInAuth({ onToken }) {
  const [connected,  setConnected]  = useState(false);
  const [userName,   setUserName]   = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => {
    // Check current URL for code
    const params = new URLSearchParams(window.location.search);
    const code   = params.get("code");
    const state  = params.get("state");

    // Check if we are on callback URL
    const isCallback = window.location.pathname.includes("callback") ||
                       window.location.pathname.includes("linkedin");

    if (code && (state === "random_state_123" || isCallback)) {
      setConnecting(true);
      exchangeToken(code);
    }
  }, []);

  const connectLinkedIn = () => {
    const authUrl =
      `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code` +
      `&client_id=${LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent("openid profile w_member_social")}` +
      `&state=random_state_123`;

    window.location.href = authUrl;
  };

  const exchangeToken = async (code) => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/linkedin/exchange`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ code }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setConnected(true);
        setUserName(data.name);
        onToken(data.token);
        // Clean URL
        window.history.replaceState({}, "", "/");
      } else {
        setError(data.message || "Connection failed!");
      }

    } catch (err) {
      setError(`Error: ${err.message}`);
    }

    setConnecting(false);
  };

  if (connecting) {
    return (
      <div className="bg-blue-900 border border-blue-500 rounded-xl p-4 text-center">
        <div className="text-blue-300 text-sm">
          ⏳ Connecting to LinkedIn...
        </div>
      </div>
    );
  }

  if (connected) {
    return (
      <div className="bg-blue-900 border border-blue-500 rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-blue-300 text-xs uppercase tracking-widest mb-1">
            LinkedIn Connected
          </div>
          <div className="text-white font-bold text-sm">
            ✅ {userName}
          </div>
        </div>
        <button
          onClick={() => {
            setConnected(false);
            setUserName("");
            onToken("");
          }}
          className="text-blue-400 text-xs hover:text-white transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="bg-red-900 border border-red-500 rounded-xl p-3 text-red-300 text-sm">
          ❌ {error}
        </div>
        <button
          onClick={() => {
            setError("");
            setConnecting(false);
          }}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition"
        >
          💼 Try Again
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectLinkedIn}
      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
    >
      <span>💼</span>
      <span>Connect LinkedIn Account</span>
    </button>
  );
}