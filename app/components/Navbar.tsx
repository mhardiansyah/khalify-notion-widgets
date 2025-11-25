"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    };

    loadUser();
  }, []);

  return (
    <nav className="w-full border-b bg-white/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-6">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 text-white font-bold w-8 h-8 flex justify-center items-center rounded-lg">
            {userEmail ? userEmail[0].toUpperCase() : "?"}
          </div>
          <div>
            <h1 className="font-semibold">{userEmail ?? "Loading..."}</h1>
            <p className="text-xs text-gray-500 -mt-1">Instagram Grid Preview</p>
          </div>
        </div>

        {/* MIDDLE NAV */}
        <div className="flex items-center gap-6">
          <Link href="/home" className="text-purple-600 font-medium flex items-center gap-1">
            <span>🏠</span> Welcome
          </Link>
          <Link href="/setup" className="text-gray-700 flex items-center gap-1">
            <span>⚙️</span> Setup
          </Link>
          <Link href="/help" className="text-gray-700 flex items-center gap-1">
            <span>❔</span> Help
          </Link>
          <Link href="/account" className="text-gray-700 flex items-center gap-1">
            <span>👤</span> Account
          </Link>
        </div>

        {/* RIGHT */}
        <div className="text-xs text-gray-600 text-right leading-tight">
          <p className="flex items-center gap-1 justify-end">
            Made with <span className="text-red-500">❤️</span> by
          </p>
          <p className="font-semibold">@rainbowgrow</p>
        </div>
      </div>
    </nav>
  );
}
