"use client";

import Image from "next/image";
import LoginPage from "./auth/login/page";
import { useEffect } from "react";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = cookies.get("login_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    } else {
      router.replace("/welcome");
    }
  }, []);
  return (
    <>  
    {/* <LoginPage /> */}
    </>
  );
}
