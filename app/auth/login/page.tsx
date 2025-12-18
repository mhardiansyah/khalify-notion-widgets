"use client";

import { api } from "@/app/lib/axios";
import { useState } from "react";
import cookies from "js-cookie";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      toast.error("Email-nya jangan kosong bro 😭");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/magic-link", { email });

      cookies.set("login_email", email, { expires: 1 / 24 });

      toast.success("Magic link terkirim ✨ Cek email lo");
    } catch (err: any) {
      toast.error("Gagal kirim magic link 😵");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
            K
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Login pake magic link, tanpa password
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 
                       focus:outline-none focus:ring-2 focus:ring-purple-500
                       text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 
                       disabled:bg-purple-300 text-white py-3 font-medium
                       transition-all"
          >
            {loading ? "Ngirim magic link..." : "Send Magic Link →"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
