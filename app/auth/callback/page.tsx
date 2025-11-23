"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const code = searchParams.get("code");

    // handle errors
    if (error || errorCode) {
      setStatus("error");
      setMessage("Magic link invalid atau sudah expired bro 😭");
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("Kode verifikasi tidak ditemukan ❌");
      return;
    }

    const run = async () => {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        setStatus("error");
        setMessage("Gagal verifikasi session 😭");
        return;
      }

      router.replace("/dashboard");
    };

    run();
  }, [router, searchParams]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Verifikasi magic link lo bro ⏳...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>{message}</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        onClick={() => router.push("/login")}
      >
        Balik Login
      </button>
    </div>
  );
}
