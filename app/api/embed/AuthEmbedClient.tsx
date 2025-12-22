"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/lib/axios";
import cookies from "js-cookie";

export default function AuthEmbedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = cookies.get("login_email");

    if (!token || !email) {
      setStatus("error");
      setTimeout(() => router.replace("/auth/login"), 1500);
      return;
    }

    const verify = async () => {
      try {
        const res = await api.post("/auth/verify-token", { token, email });

        cookies.set("login_token", res.data.data.jwt, { expires: 1 / 24 });

        const jwt = res.data.data.jwt;
        cookies.set("access_token", jwt, {
          expires: 30,
          secure: true,
          sameSite: "strict",
        });

        setStatus("success");

        setTimeout(() => {
          router.replace("/welcome");
        }, 1500);
      } catch (err) {
        console.error("verify error:", err);
        setStatus("error");

        setTimeout(() => {
          router.replace("/auth/login");
        }, 1500);
      }
    };

    verify();
  }, [router, searchParams]);

  // 🔥 UI NYATA ADA DI SINI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        {status === "loading" && (
          <>
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="text-xl font-semibold">Verifying magic link</h1>
            <p className="text-sm text-gray-500 mt-2">
              Lagi ngecek akses kamu ✨
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-xl font-semibold text-green-600">
              Login berhasil 🎉
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Kamu bakal diarahkan otomatis...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-xl font-semibold text-red-600">
              Link tidak valid 😵
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Mengarahkan ke halaman login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
