/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.replace("/login");
      setUser(data.user);
    };
    loadUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar />

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
          <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow transition">
            <h3 className="font-bold mb-2 text-black flex items-center gap-2">
              <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
              Setup Notion Template
            </h3>
            <p className="text-gray-600 text-sm">Create your database in Notion</p>
          </div>

          <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow transition">
            <h3 className="font-bold mb-2 text-black flex items-center gap-2">
              <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
              Connect Integration
            </h3>
            <p className="text-gray-600 text-sm">Link your Notion workspace</p>
          </div>

          <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow transition">
            <h3 className="font-bold mb-2 text-black flex items-center gap-2">
              <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
              Embed Widget
            </h3>
            <p className="text-gray-600 text-sm">Add to your Notion page</p>
          </div>
        </div>

        {/* New Section: Video Tutorials + Why Use This */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {/* VIDEO TUTORIALS */}
          <div className="p-6 bg-purple-50 rounded-xl border border-purple-200 shadow-sm">
            <h3 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
              <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">🎬</span>
              Video Tutorials
            </h3>

            <ul className="space-y-2 text-sm text-purple-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                Setup Guide
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                Using Pro Features
              </li>
            </ul>
          </div>

          {/* WHY USE THIS */}
          <div className="p-6 bg-white rounded-xl border shadow-sm">
            <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
              Why use this?
            </h3>

            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span>
                Plan your Instagram feed visually
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span>
                Sync automatically with Notion database
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span>
                No coding required
              </li>
            </ul>
          </div>
        </div>

      </div>
    </>
  );
}
