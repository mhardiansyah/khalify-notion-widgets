"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");

  const sendOtp = async () => {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (res.ok) setSent(true);
  };

  const verifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
    if (res.ok) window.location.href = "/account";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-sm">
        {!sent ? (
          <>
            <h1 className="text-xl font-bold mb-4">Login</h1>

            <input
              className="w-full p-2 mb-4 rounded bg-gray-800"
              placeholder="Your email…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={sendOtp}
              className="w-full p-2 bg-blue-600 rounded"
            >
              Send Verification Code
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold mb-4">Enter OTP</h1>

            <input
              className="w-full p-2 mb-4 rounded bg-gray-800"
              placeholder="6 Digit Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              className="w-full p-2 bg-green-600 rounded"
            >
              Verify & Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
