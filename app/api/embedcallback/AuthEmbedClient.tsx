"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/lib/axios";

export default function AuthEmbedClient() {
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


        await api.post("/auth/verify-token", { token, email });



        // bersihin email setelah sukses
        localStorage.removeItem("login_email");

        router.replace("/welcome");
      } catch (err) {
        router.replace("/auth/login");
        console.error("Error verifying token:", err);
      }
    };

    verify();
  }, [router, searchParams]);

  return null;
}
