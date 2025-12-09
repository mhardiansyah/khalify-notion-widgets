"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function CallbackBody() {
  const router = useRouter();

  useEffect(() => {
    const finish = async () => {
      // WAJIB!! tukar code PKCE menjadi session cookie
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("LOGIN ERROR:", error);
        router.replace("/login");
        return;
      }

      console.log("SESSION CREATED:", data);

      router.replace("/welcome"); // atau ke /accounts
    };

    finish();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Verifying...
    </div>
  );
}
