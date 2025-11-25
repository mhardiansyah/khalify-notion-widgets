/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function CallbackBody() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const code = searchParams.get("code");

    console.log("PARAMS:", { error, errorCode, code });

    // ERROR langsung dari Supabase (misal otp_expired)
    if (error || errorCode) {
      setStatus("error");
      setMessage("Magic link invalid atau expired bro 😭");
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("Kode verifikasi tidak ditemukan ");
      return;
    }

    const run = async () => {
      try {
        console.log("EXCHANGE START dengan code:", code);

        const { data, error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        console.log(" SUPABASE EXCHANGE RESPONSE:", {
          data,
          exchangeError,
        });

        // Meskipun error, Supabase bisa tetap login via cookie (PKCE)
        const { data: userData } = await supabase.auth.getUser();

        console.log("COOKIE SESSION CHECK:", userData);

        if (userData?.user) {
          console.log("LOGIN BERHASIL VIA COOKIE");
          return router.replace("/welcome");
        }

        if (exchangeError) {
          setStatus("error");
          setMessage("Gagal verifikasi session bro 😭");
          return;
        }

        setStatus("error");
        setMessage("Tidak bisa memverifikasi login 😭");
      } catch (err) {
        console.error("UNEXPECTED ERROR:", err);
        setStatus("error");
        setMessage("Terjadi kesalahan tak terduga 😭");
      }
    };

    run();
  }, [router, searchParams]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Verifikasi magic link lo bro ...
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
