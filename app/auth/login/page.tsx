"use client";

import { api } from "@/app/lib/axios";
import { useState } from "react";
import cookies from "js-cookie";
import { toast } from "sonner";
import Image from "next/image";

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

      toast.success("Magic link terkirim. Cek email lo 👀");
    } catch (err: any) {
      toast.error("Gagal kirim magic link 😵");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-10 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200">
            <Image
              src="/LogoDanNama.png"
              alt="Logo"
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
        </div>

        {/* Brand
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          khlasify
        </h2> */}

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Login to your account
        </h1>

        {/* Input */}
        <input
          type="email"
          placeholder="Enter your email address..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 
                     focus:outline-none focus:ring-2 focus:ring-purple-500
                     text-sm mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-lg bg-purple-500 hover:bg-purple-600 
                     disabled:bg-purple-300 text-white py-3 font-medium
                     transition-all mb-4"
        >
          {loading ? "Ngirim magic link..." : "Send Magic Link →"}
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-400">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
