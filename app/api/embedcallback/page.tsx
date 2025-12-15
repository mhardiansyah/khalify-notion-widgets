"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthEmbedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = localStorage.getItem("login_email");

    if (!token || !email) {
      router.replace("/auth/login");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          "https://khalify-be.vercel.app/auth/verify-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // 🔥 penting buat cookie
            body: JSON.stringify({
              token,
              email,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Token invalid");
        }

        // JWT idealnya diset HttpOnly cookie dari BE
        router.replace("/welcome");
      } catch (err) {
        router.replace("/auth/login");
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Verifying magic link...
    </div>
  );
}
