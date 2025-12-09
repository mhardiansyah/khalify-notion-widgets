"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function CallbackBody() {
  const router = useRouter();

  useEffect(() => {
    const finish = async () => {
      try {
        const rawUrl = window.location.href;

        console.log("CALLBACK URL:", rawUrl);
        console.log("COOKIE:", document.cookie);

        // BUANG HASH (#pkce)
        const cleanUrl = rawUrl.split("#")[0];

        console.log("CLEAN URL SENT TO SUPABASE:", cleanUrl);

        const { data, error } = await supabase.auth.exchangeCodeForSession(cleanUrl);

        if (error) {
          console.error("Exchange error:", error);
          router.replace("/auth/login");
          return;
        }

        console.log("SESSION CREATED:", data);
        router.replace("/welcome");
      } catch (err) {
        console.error("Callback error:", err);
        router.replace("/auth/login");
      }
    };

    finish();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Verifying...
    </div>
  );
}
