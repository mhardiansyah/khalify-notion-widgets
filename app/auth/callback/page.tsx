"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const processMagicLink = async () => {
      try {
        const url = window.location.href;

        const { data, error } = await supabase.auth.exchangeCodeForSession(url);

        if (error) {
          console.error("LOGIN ERROR:", error);
          router.replace("/login");
          return;
        }

        console.log("SESSION CREATED:", data);

        router.replace("/welcome");
      } catch (err) {
        console.error("Callback crash:", err);
        router.replace("/login");
      }
    };

    processMagicLink();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Verifying your login...
    </div>
  );
}
