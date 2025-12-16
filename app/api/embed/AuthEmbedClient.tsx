"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/lib/axios";
import cookies from "js-cookie";
import bcrypt from "bcryptjs";

export default function AuthEmbedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = cookies.get("login_email");
    console.log("token: ", token);
    console.log("email: ", email);

    if (!token || !email) {
      router.replace("/auth/login");
      return;
    }

    const verify = async () => {
      try {
        const res = await api.post("/auth/verify-token", { token, email });
        console.log("res: " ,res);

        cookies.set("login_token", res.data.data.jwt, { expires: 1 / 24 });

        // const password = await bcrypt.hash("khalify2025goSecure", 10);
        // cookies.set("login_password", password, { expires: 1 / 24 });

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
