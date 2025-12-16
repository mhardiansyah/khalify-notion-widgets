"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/lib/axios";
import cookies from "js-cookie";


export default function AuthEmbedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = cookies.get("login_email");

    if (!token || !email) {
      router.replace("/auth/login");
      return;
    }

    const verify = async () => {
      try {
        const res = await api.post("/auth/verify-token", { token, email });
        cookies.set("login_token", res.data.data.jwt, { expires: 1 / 24 });

        // hapus cookie setelah sukses  
        cookies.remove("login_email");

        router.replace("/welcome");
      } catch (err) {
        console.error("Error verifying token:", err);
        router.replace("/auth/login");
      }
    };

    verify();
  }, [router, searchParams]);

  return null;
}
