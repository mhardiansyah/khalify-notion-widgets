"use client";

import { api } from "@/app/lib/axios";
import { useState } from "react";
import bcrypt from "bcryptjs";
import cookies from "js-cookie";


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

      // const token = await bcrypt.hash(email, 10);

      // cookies.set("login_token", token, { expires: 1 / 24 });


      const res = await api.post("/auth/magic-link", { email});



      cookies.set("login_email", email, { expires: 1 / 24 }); 

      alert("Cek email lo bro, magic link udah dikirim ✨");
    } catch (err: any) {
      alert(err.message);
      console.log("err:  ", err);
      
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
