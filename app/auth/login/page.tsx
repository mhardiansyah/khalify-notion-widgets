"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      alert("Masukin email dulu bro");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://khalify-be.vercel.app/auth/magic-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      localStorage.setItem("login_email", email);


      if (!res.ok) {
        throw new Error(data.message || "Gagal kirim magic link");
      }

      alert("Cek email lo bro, magic link udah dikirim ✨");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col gap-4 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold">Login</h1>

      <input
        type="email"
        placeholder="email lo bro..."
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded"
      >
        {loading ? "Ngirim..." : "Kirim Magic Link"}
      </button>
    </div>
  );
}
