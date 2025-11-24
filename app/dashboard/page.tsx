/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setUser(data.user);
    };

    loadUser();
  }, []);

  if (!user) return <div>Loading bro...</div>;

  return (
    <div className="p-10">
      <h1>Welcome bro </h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
