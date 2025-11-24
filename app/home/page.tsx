/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
        return;
      }
      setUser(data.user);
    };

    loadUser();
  }, []);

  if (!user) return <div className="p-10">Loading bro...</div>;

  return (
    <div className="max-w-5xl mx-auto p-10">

      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <img
          src="/ImageWithFallback.png"
          className="rounded-xl shadow-lg w-full"
          alt="UI Preview"
        />

        <div>
          <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
            Free Tool
          </span>

          <h1 className="text-3xl font-bold mt-4">
            Making Instagram feed planning easier by bringing your grid view to Notion
          </h1>

          <p className="text-gray-600 mt-3">
            Just a few steps and you’ll have a beautiful Instagram-style gallery that updates automatically.
          </p>

          <button
            onClick={() => router.push("/setup")}
            className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition"
          >
            Get Started →
          </button>
        </div>
      </div>

      {/* Steps Section */}
      <h2 className="text-xl font-semibold mt-20 mb-6">Easy setups (5 mins):</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="font-bold mb-2">1. Setup Notion Template</h3>
          <p className="text-gray-600 text-sm">Create your database in Notion</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="font-bold mb-2">2. Connect Integration</h3>
          <p className="text-gray-600 text-sm">Link your Notion workspace</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="font-bold mb-2">3. Embed Widget</h3>
          <p className="text-gray-600 text-sm">Add to your Notion page</p>
        </div>
      </div>
    </div>
  );
}
